import mongoose, { Schema, type Document } from "mongoose"

export interface IItem extends Document {
  _id: string
  title: string
  description: string
  category: string
  type: string
  size: string
  condition: string
  points: number
  tags: string[]
  images: string[]
  status: "pending" | "approved" | "rejected" | "swapped" | "unavailable"
  owner: mongoose.Types.ObjectId
  location?: {
    city: string
    state: string
    country: string
  }
  views: number
  likes: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  approvedAt?: Date
  approvedBy?: mongoose.Types.ObjectId
  rejectionReason?: string
}

const ItemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Tops & T-Shirts",
        "Dresses",
        "Pants & Jeans",
        "Shorts",
        "Skirts",
        "Outerwear",
        "Shoes",
        "Accessories",
        "Activewear",
        "Formal Wear",
      ],
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["like-new", "excellent", "very-good", "good", "fair"],
    },
    points: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    tags: [String],
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 1 && v.length <= 5,
        message: "Items must have between 1 and 5 images",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "swapped", "unavailable"],
      default: "pending",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    approvedAt: Date,
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: String,
  },
  {
    timestamps: true,
  },
)

// Indexes
ItemSchema.index({ status: 1 })
ItemSchema.index({ category: 1 })
ItemSchema.index({ condition: 1 })
ItemSchema.index({ size: 1 })
ItemSchema.index({ points: 1 })
ItemSchema.index({ owner: 1 })
ItemSchema.index({ createdAt: -1 })
ItemSchema.index({ title: "text", description: "text", tags: "text" })

// Calculate points based on condition
ItemSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("condition")) {
    const conditionPoints = {
      "like-new": 50,
      excellent: 40,
      "very-good": 30,
      good: 20,
      fair: 10,
    }
    this.points = conditionPoints[this.condition as keyof typeof conditionPoints] || 20
  }
  next()
})

export default mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema)
