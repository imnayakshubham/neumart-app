import mongoose, { Schema, Document, Model } from "mongoose"

export interface IProduct extends Document {
    name: string
    description: string
    price: number
    image: string
    category: string
    user_id: Number
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, required: true },
        category: { type: String, required: true, trim: true, index: true },
        user_id: {
            type: Number, default: 1
        },
    },
    {
        timestamps: true,
    }
)

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
export default Product
