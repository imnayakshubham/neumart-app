"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        const data = await response.json()

        if (data.success) {
          setOrders(data.orders)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 text-3xl font-bold">No Orders Yet</h1>
        <p className="mb-8 text-muted-foreground">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Orders</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Link key={order._id} href={`/orders/${order._id}`}>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order._id.slice(0, 8)}</CardTitle>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                    <p className="font-medium">
                      ${order.total.toFixed(2)}
                      {order.discountApplied && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Discount: ${order.discountAmount.toFixed(2)})
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge variant={order.status === "Delivered" ? "default" : "outline"}>{order.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

