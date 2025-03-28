import mongoose, { Schema, Document, Model } from "mongoose"
import { DEFAULT_ORDER_DISCOUNT_PERCENT, DEFAULT_ORDER_THRESHOLD } from "@/lib/constants"

export interface IDiscountCode extends Document {
    code: string
    percentage: number
    used: boolean
    access: boolean,
    user_id: Number
}

export const DiscountCodeSchema: Schema<IDiscountCode> = new Schema(
    {
        code: { type: String, required: true, unique: true, trim: true },
        percentage: {
            type: Number, required: true,
            default: DEFAULT_ORDER_DISCOUNT_PERCENT,
            min: 0, max: 100
        },
        used: { type: Boolean, default: false, },
        access: { type: Boolean, default: true },
        user_id: {
            type: Number, default: 1
        },
    },
    {
        timestamps: true,
    }
)

const DiscountCode: Model<IDiscountCode> =
    mongoose.models.DiscountCode || mongoose.model<IDiscountCode>("DiscountCode", DiscountCodeSchema)

export default DiscountCode
