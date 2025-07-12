import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  avatar?: string
  bio?: string
  location?: {
    city: string
    state: string
    country: string
  }
  points: number
  rating: number
  totalRatings: number
  totalSwaps: number
  preferences: {
    categories: string[]
    sizes: string[]
    conditions: string[]
  }
  isVerified: boolean
  role: "user" | "admin" | "moderator"
  status: "active" | "suspended" | "banned"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    points: {
      type: Number,
      default: 100, // Starting points for new users
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalSwaps: {
      type: Number,
      default: 0,
    },
    preferences: {
      categories: [String],
      sizes: [String],
      conditions: [String],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ "location.city": 1 })

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
