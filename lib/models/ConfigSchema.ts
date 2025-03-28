import mongoose, { Schema, Document, Model } from "mongoose"
import { DEFAULT_ORDER_DISCOUNT_PERCENT, DEFAULT_ORDER_THRESHOLD } from "../constants"

export interface IConfig extends Document {
    ordersUntilNextDiscount: number
    orderThreshold: number
    discountPercentage?: number,
    user_id: number,
    orderCount: number
}

const Configs: Schema<IConfig> = new Schema(
    {
        user_id: {
            type: Number, default: 1
        },
        ordersUntilNextDiscount: { type: Number, default: 1 },
        orderThreshold: { type: Number, default: DEFAULT_ORDER_THRESHOLD },
        discountPercentage: { type: Number, default: DEFAULT_ORDER_DISCOUNT_PERCENT },
        orderCount: {
            type: Number, default: 0
        }
    },
    {
        timestamps: true,
    }
)

const ConfigsModel: Model<IConfig> =
    mongoose.models.Configs || mongoose.model<IConfig>("Configs", Configs)

export default ConfigsModel
