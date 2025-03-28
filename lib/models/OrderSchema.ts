import mongoose, { Schema, Document, Model } from "mongoose"
import { IProduct } from "./ProductSchema"
import { CartItemSchema } from "./CartSchema"

interface ICartItem extends IProduct {
    quantity: number
}

export interface IOrder extends Document {
    date: Date
    items: ICartItem[]
    subtotal: number
    total: number
    status: "Processing" | "Shipped" | "Delivered"
    discountApplied: boolean
    discountCode?: string
    discountAmount: number,
    access: boolean,
    user_id: Number

}

const OrderSchema: Schema<IOrder> = new Schema(
    {
        items: [CartItemSchema],
        subtotal: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing",
        },
        discountApplied: { type: Boolean, default: false },
        discountCode: { type: String, trim: true, sparse: true },
        discountAmount: { type: Number, default: 0, min: 0 },
        access: {
            type: Boolean,
            default: true
        },
        user_id: {
            type: Number, default: 1
        },

    },
    {
        timestamps: true,
    }
)

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
export default Order
