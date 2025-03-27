"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)

        await new Promise((resolve) => setTimeout(resolve, 500))
        const responseParams = await params
        const response = await fetch(`/api/orders/${responseParams.id}`)
        const data = await response.json()

        if (data.success) {
          setOrder(data.order)
        } else {
          setError(data.message || "Order not found")
          toast({
            title: "Error",
            description: data.message || "Order not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
        setError("Failed to fetch order details")
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="mb-4 h-32 w-full" />
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order Not Found</h1>
        </div>

        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold">Order Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              {error || "The order you're looking for doesn't exist or you don't have access to view it."}
            </p>
            <Button asChild>
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>John Doe</p>
                <p>123 Main Street</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={order.status === "Delivered" ? "default" : "outline"}>{order.status}</Badge>
                <p className="text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>

                {order.discountApplied && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span>-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.discountApplied && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="font-medium">Discount Applied</p>
                  <p className="text-muted-foreground">Code: {order.discountCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

