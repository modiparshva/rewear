import mongoose, { Schema, type Document } from "mongoose"

export interface ISwap extends Document {
  _id: string
  requester: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId
  requestedItem: mongoose.Types.ObjectId
  offeredItem?: mongoose.Types.ObjectId
  swapType: "direct" | "points"
  pointsRequired: number
  pointsOffered: number
  pointsDifference: number
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  message?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const SwapSchema = new Schema<ISwap>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedItem: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    offeredItem: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
    swapType: {
      type: String,
      enum: ["direct", "points"],
      required: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
    },
    pointsOffered: {
      type: Number,
      default: 0,
    },
    pointsDifference: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    message: String,
    rejectionReason: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes
SwapSchema.index({ requester: 1 })
SwapSchema.index({ owner: 1 })
SwapSchema.index({ status: 1 })
SwapSchema.index({ createdAt: -1 })

export default mongoose.models.Swap || mongoose.model<ISwap>("Swap", SwapSchema)
