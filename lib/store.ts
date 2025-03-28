import { DEFAULT_ORDER_DISCOUNT_PERCENT, DEFAULT_ORDER_THRESHOLD } from "@/lib/constants"
import DiscountCode from "./models/DiscountCodeSchema"
import type { CartItem } from "./types"
import { generateDiscountCode, generateId } from "./utils"
import { connectDB } from "./db"
import Order, { IOrder } from "./models/OrderSchema"
import ConfigsModel, { IConfig } from "./models/ConfigSchema"


export async function getOrCreateConfig({ user_id = 1 }: { user_id: number }): Promise<IConfig | null> {
  try {
    await connectDB()

    const defaultConfig: Partial<IConfig> = {
      user_id: user_id,
      ordersUntilNextDiscount: 1,
      orderThreshold: DEFAULT_ORDER_THRESHOLD,
      discountPercentage: DEFAULT_ORDER_DISCOUNT_PERCENT,
      orderCount: 0,
    }

    const config = await ConfigsModel.findOneAndUpdate(
      { user_id: user_id },
      { $setOnInsert: defaultConfig },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean()

    return config as IConfig
  } catch (error) {
    return null
  }
}

export async function placeOrder(items: CartItem[], discountCode?: string | null) {
  try {
    await connectDB()
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    let discountAmount = 0
    let discountApplied = false
    let appliedDiscountCode: string | undefined = undefined

    if (discountCode) {

      const discount = await DiscountCode.findOne(
        { access: true, code: discountCode, used: false }
      )

      if (discount) {
        discountAmount = (discount.percentage / 100) * subtotal
        discountApplied = true
        discount.used = true
        appliedDiscountCode = discountCode
      }
    }

    const orderPayload = {
      items: JSON.parse(JSON.stringify(items)),
      subtotal,
      total: subtotal - discountAmount,
      status: "Processing",
      discountApplied,
      discountCode: appliedDiscountCode,
      discountAmount,
    }

    const order = await Order.create(orderPayload)

    const config = await getOrCreateConfig({ user_id: 1 })
    if (config) {
      console.log({ config })
      if (config?.orderCount % config.orderThreshold === 0) {
        generateNewDiscountCode(config.orderThreshold)
      } else {
        await ConfigsModel.findOneAndUpdate(
          { user_id: 1 },
          { $inc: { orderCount: 1 } },
          { new: true, upsert: true }
        )
      }
    }



    return order
  } catch (error) {
    console.log({ error })
    return null
  }

}

export async function generateNewDiscountCode(percentage: number) {
  try {
    const code = generateDiscountCode()
    const discountCodePayload = {
      code,
      percentage,
    }
    await DiscountCode.create(discountCodePayload)

    await ConfigsModel.findOneAndUpdate(
      { user_id: 1 },
      { $set: { orderCount: 0 } },
      { new: true, upsert: true }
    )
  } catch (error) {
    return null
  }

}

export async function getAdminStats() {
  try {
    const orders = await getOrders()

    const totalOrders = orders.length
    const totalItemsSold = orders.reduce(
      (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    )
    const totalRevenue = orders.reduce((total, order) => total + order.total, 0)
    const ordersWithDiscount = orders.filter((order) => order.discountApplied).length
    const totalDiscountAmount = orders.reduce((total, order) => total + order.discountAmount, 0)
    const config = await getOrCreateConfig({ user_id: 1 })
    const ordersUntilNextDiscount = config ? config.orderThreshold - (config.orderCount % config.orderThreshold) : 0
    const discountCodes = await DiscountCode.find(
      { access: true }
    ).sort({ createdAt: -1 }).lean()

    return {
      totalOrders,
      totalItemsSold,
      totalRevenue,
      ordersWithDiscount,
      totalDiscountAmount,
      discountCodes: discountCodes,
      ordersUntilNextDiscount,
      orderThreshold: config?.orderThreshold,
      recentOrders: orders.slice(0, 5),

    }
  } catch (error) {
    return null
  }
}

export async function updateOrderThreshold(threshold: number, percentage: number): Promise<boolean> {
  try {
    if (threshold > 0) {
      const result = await ConfigsModel.updateOne(
        { user_id: 1 },
        { $set: { orderThreshold: threshold, discountPercentage: percentage } }
      )
      if (result.modifiedCount > 0) {
        return true
      } else {
        return false
      }
    }

    return false
  } catch (error) {
    return false
  }
}

export async function getOrders(): Promise<IOrder[]> {
  try {
    await connectDB()

    const orders = await Order.find({ access: true }).sort({ createdAt: -1 }).lean()

    return orders
  } catch (error) {
    return []
  }
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  try {
    await connectDB()

    const order = await Order.findOne({ access: true, _id: id }).lean()

    if (!order) {
      return null
    }

    return order
  } catch (error) {
    return null
  }
}

export async function deleteDiscountCode(code: string): Promise<boolean> {
  try {
    await connectDB()

    const result = await DiscountCode.updateOne(
      { code: code, used: false },
      { $set: { access: false } }
    )

    if (result.modifiedCount > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}