import User from "../models/User"
import Swap from "../models/Swap"
import PointsTransaction from "../models/PointsTransaction"
import Item from "../models/Item"

export class SwapService {
  // Calculate points difference for swap
  static async calculateSwapCost(requestedItemId: string, offeredItemId?: string) {
    const requestedItem = await Item.findById(requestedItemId)
    if (!requestedItem) throw new Error("Requested item not found")

    const pointsRequired = requestedItem.points
    let pointsOffered = 0
    let pointsDifference = 0

    if (offeredItemId) {
      // Direct swap with item
      const offeredItem = await Item.findById(offeredItemId)
      if (!offeredItem) throw new Error("Offered item not found")

      pointsOffered = offeredItem.points
      pointsDifference = Math.max(0, pointsRequired - pointsOffered)
    } else {
      // Points-only swap
      pointsDifference = pointsRequired
    }

    return {
      pointsRequired,
      pointsOffered,
      pointsDifference,
    }
  }

  // Create a swap request
  static async createSwapRequest(data: {
    requesterId: string
    ownerId: string
    requestedItemId: string
    offeredItemId?: string
    message?: string
  }) {
    const { requesterId, ownerId, requestedItemId, offeredItemId, message } = data

    // Calculate swap costs
    const swapCosts = await this.calculateSwapCost(requestedItemId, offeredItemId)

    // Check if requester has sufficient points for points-only swap
    const requester = await User.findById(requesterId)
    if (!requester) throw new Error("Requester not found")

    if (!offeredItemId && requester.points < swapCosts.pointsDifference) {
      throw new Error(`Insufficient points. Required: ${swapCosts.pointsDifference}, Available: ${requester.points}`)
    }

    const swapRequest = new Swap({
      requester: requesterId,
      owner: ownerId,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      swapType: offeredItemId ? "direct" : "points",
      pointsOffered: swapCosts.pointsOffered,
      pointsRequired: swapCosts.pointsRequired,
      pointsDifference: swapCosts.pointsDifference,
      message,
    })

    await swapRequest.save()
    return swapRequest
  }

  // Accept a swap request and process the exchange
  static async acceptSwapRequest(swapRequestId: string, ownerId: string) {
    const swapRequest = await Swap.findById(swapRequestId)
      .populate("requester")
      .populate("owner")
      .populate("requestedItem")
      .populate("offeredItem")

    if (!swapRequest) throw new Error("Swap request not found")
    if (swapRequest.owner._id.toString() !== ownerId) {
      throw new Error("Unauthorized to accept this swap request")
    }
    if (swapRequest.status !== "pending") {
      throw new Error("Swap request is no longer pending")
    }

    // Start transaction
    const session = await User.startSession()
    session.startTransaction()

    try {
      const requester = await User.findById(swapRequest.requester._id).session(session)
      const owner = await User.findById(swapRequest.owner._id).session(session)

      if (!requester || !owner) throw new Error("Users not found")

      // For points-only swap, check if requester still has enough points
      if (swapRequest.swapType === "points" && requester.points < swapRequest.pointsDifference) {
        throw new Error("Insufficient points")
      }

      // Process points transfer
      if (swapRequest.swapType === "points") {
        // Deduct points from requester
        requester.points -= swapRequest.pointsDifference
        await requester.save({ session })

        // Record points transaction for requester
        const requesterTransaction = new PointsTransaction({
          user: requester._id,
          type: "spent",
          amount: -swapRequest.pointsDifference,
          description: `Points spent for ${swapRequest.requestedItem.title}`,
          relatedItem: swapRequest.requestedItem._id,
          relatedSwap: swapRequest._id,
        })
        await requesterTransaction.save({ session })
      }

      // Award points to owner for their item
      owner.points += swapRequest.pointsRequired
      await owner.save({ session })

      // Record points transaction for owner
      const ownerTransaction = new PointsTransaction({
        user: owner._id,
        type: "earned",
        amount: swapRequest.pointsRequired,
        description: `Points earned from swapping ${swapRequest.requestedItem.title}`,
        relatedItem: swapRequest.requestedItem._id,
        relatedSwap: swapRequest._id,
      })
      await ownerTransaction.save({ session })

      // If direct swap, award points to requester for their offered item
      if (swapRequest.swapType === "direct" && swapRequest.offeredItem) {
        requester.points += swapRequest.pointsOffered
        await requester.save({ session })

        // Record points transaction for requester's offered item
        const requesterEarnedTransaction = new PointsTransaction({
          user: requester._id,
          type: "earned",
          amount: swapRequest.pointsOffered,
          description: `Points earned from offering ${swapRequest.offeredItem.title}`,
          relatedItem: swapRequest.offeredItem._id,
          relatedSwap: swapRequest._id,
        })
        await requesterEarnedTransaction.save({ session })
      }

      // Update item statuses
      await Item.findByIdAndUpdate(swapRequest.requestedItem._id, { status: "swapped" }, { session })

      if (swapRequest.offeredItem) {
        await Item.findByIdAndUpdate(swapRequest.offeredItem._id, { status: "swapped" }, { session })
      }

      // Update swap request status
      swapRequest.status = "accepted"
      swapRequest.completedAt = new Date()
      await swapRequest.save({ session })

      // Update user swap counts
      requester.totalSwaps += 1
      owner.totalSwaps += 1
      await requester.save({ session })
      await owner.save({ session })

      await session.commitTransaction()
      return swapRequest
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  // Award bonus points for various activities
  static async awardBonusPoints(userId: string, amount: number, description: string, relatedItemId?: string) {
    const session = await User.startSession()
    session.startTransaction()

    try {
      const user = await User.findById(userId).session(session)
      if (!user) throw new Error("User not found")

      // Add points to user
      user.points += amount
      await user.save({ session })

      // Record transaction
      const transaction = new PointsTransaction({
        user: userId,
        type: "bonus",
        amount,
        description,
        relatedItem: relatedItemId,
      })
      await transaction.save({ session })

      await session.commitTransaction()
      return { user, transaction }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  // Get user's points transaction history
  static async getPointsHistory(userId: string, limit = 20, offset = 0) {
    return await PointsTransaction.find({ user: userId })
      .populate("relatedItem", "title images")
      .populate("relatedSwap")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
  }
}
