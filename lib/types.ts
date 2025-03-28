export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  _id: string
  date: string
  items: CartItem[]
  subtotal: number
  total: number
  status: "Processing" | "Shipped" | "Delivered"
  discountApplied: boolean
  discountCode?: string
  discountAmount: number,
  createdAt: string
}

export interface DiscountCode {
  code: string
  percentage: number,
  used: boolean
}

export interface AdminStats {
  totalOrders: number
  totalItemsSold: number
  totalRevenue: number
  ordersWithDiscount: number
  totalDiscountAmount: number
  discountCodes: DiscountCode[]
  ordersUntilNextDiscount: number
  orderThreshold: number
  recentOrders?: Order[]
  discountPercentage?: number
}

