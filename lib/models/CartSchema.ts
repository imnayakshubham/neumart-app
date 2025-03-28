import mongoose, { Schema, Document, Model } from "mongoose"

export const CartItemSchema = new Schema(
    {
        id: { type: String, ref: "Product", required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        user_id: {
            type: Number, default: 1
        },
    },
    { timestamps: true }
)
