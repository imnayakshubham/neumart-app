import type { CartItem, DiscountCode, Order } from "./types"
import { generateDiscountCode, generateId } from "./utils"

export const DEFAULT_ORDER_THRESHOLD = 1

interface Store {
  orders: Order[]
  discountCodes: DiscountCode[]
  orderCount: number
  orderThreshold: number
}


export const store: Store = {
  orders: [],
  discountCodes: [],
  orderCount: 0,
  orderThreshold: DEFAULT_ORDER_THRESHOLD,
}

export function placeOrder(items: CartItem[], discountCode?: string | null): Order {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  let discountAmount = 0
  let discountApplied = false
  let appliedDiscountCode: string | undefined = undefined

  if (discountCode) {
    const discount = store.discountCodes.find((d) => d.code === discountCode && !d.used)

    if (discount) {
      discountAmount = (discount.percentage / 100) * subtotal
      discountApplied = true
      discount.used = true
      appliedDiscountCode = discountCode
    }
  }

  const orderId = generateId()

  const order: Order = {
    id: orderId,
    date: new Date().toISOString(),
    items: JSON.parse(JSON.stringify(items)),
    subtotal,
    total: subtotal - discountAmount,
    status: "Processing",
    discountApplied,
    discountCode: appliedDiscountCode,
    discountAmount,
  }

  store.orders.push(order)

  store.orderCount++

  if (store.orderCount % store.orderThreshold === 0) {
  }

  console.log(`Order added to store. Total orders: ${store.orders.length}`)
  console.log(`Order details:`, order)

  return order
}

export function generateNewDiscountCode(percentage: number): DiscountCode {
  const code = generateDiscountCode()

  const discountCode: DiscountCode = {
    code,
    percentage,
    used: false,
  }

  store.discountCodes.push(discountCode)

  return discountCode
}

export function getAdminStats() {
  const totalOrders = store.orders.length
  const totalItemsSold = store.orders.reduce(
    (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  )
  const totalRevenue = store.orders.reduce((total, order) => total + order.total, 0)
  const ordersWithDiscount = store.orders.filter((order) => order.discountApplied).length
  const totalDiscountAmount = store.orders.reduce((total, order) => total + order.discountAmount, 0)

  const ordersUntilNextDiscount = store.orderThreshold - (store.orderCount % store.orderThreshold)


  const recentOrders = [...store.orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    totalOrders,
    totalItemsSold,
    totalRevenue,
    ordersWithDiscount,
    totalDiscountAmount,
    discountCodes: store.discountCodes,
    ordersUntilNextDiscount,
    orderThreshold: store.orderThreshold,
    recentOrders,
  }
}

export function updateOrderThreshold(threshold: number) {
  if (threshold > 0) {
    store.orderThreshold = threshold
    return true
  }
  return false
}

export function getOrders(): Order[] {
  return store.orders
}

export function getOrderById(id: string): Order | undefined {
  const order = store.orders.find((order) => order.id === id)

  if (order) {
    console.log(`Found order with ID ${id}:`, order)
  } else {
    console.log(
      `No order found with ID ${id}. Available orders:`,
      store.orders.map((o) => o.id),
    )
  }

  return order
}

export function deleteDiscountCode(code: string): boolean {
  const index = store.discountCodes.findIndex((discount) => discount.code === code && !discount.used)

  if (index !== -1) {
    store.discountCodes.splice(index, 1)
    return true
  }

  return false
}