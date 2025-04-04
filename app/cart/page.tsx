"use client"

import { useCart } from "@/lib/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Tag, Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { applyDiscountCode } from "@/lib/actions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DiscountCode } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function CartPage() {
  const { items, updateItemQuantity, removeItem, clearCart, totalPrice } = useCart()
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [coupons, setCoupons] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const userId = 1

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const response = await fetch(`/api/coupons`)
        const data = await response.json()

        if (response.ok && data.success) {
          setCoupons(data.coupons)
        } else {
          throw new Error(data.message || "Failed to fetch coupons")
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchCoupons()
    }
  }, [userId])

  const removeApplyDiscount = () => {
    setIsApplyingDiscount(false)
    setDiscountCode("")
    setDiscountAmount(0)
    setDiscountApplied(false)
  }


  const handleApplyDiscount = async (code?: string) => {
    const discountCoupounCode = code ? code : discountCode
    if (!discountCoupounCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive",
      })
      return
    }

    setIsApplyingDiscount(true)
    try {
      const result = await applyDiscountCode(discountCoupounCode)

      if (result.success) {
        setDiscountApplied(true)
        setDiscountAmount(((result?.discountPercentage ?? 0) / 100) * totalPrice)
        toast({
          title: "Discount applied",
          description: `${result.discountPercentage}% discount has been applied to your order.`,
        })
      } else {
        toast({
          title: "Invalid discount code",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply discount code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          discountCode: discountApplied ? discountCode : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Order placed successfully",
          description: "Thank you for your purchase!",
        })
        router.push(`/orders/${data.orderId}`);
        clearCart();
      } else {
        toast({
          title: "Checkout failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "Failed to complete checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mb-8 text-muted-foreground">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const handleChange = (value: string) => {
    setDiscountApplied(false)
    setDiscountCode(value);
    handleApplyDiscount(value)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card">
            <div className="p-6">
              {items.map((item) => (
                <div key={item.id} className="mb-6 flex flex-col gap-4 sm:flex-row">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="hidden lg:flex pt-4 justify-end">
            <Button onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>
          </div> */}
        </div>

        <div className="flex gap-8 flex-col">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(totalPrice - (discountApplied ? discountAmount : 0)).toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  disabled={discountApplied || isApplyingDiscount}
                />
                <Button
                  variant="outline"
                  onClick={() => handleApplyDiscount()}
                  disabled={discountApplied || isApplyingDiscount}
                >
                  Apply
                </Button>
              </div>
              {discountApplied && <div className="flex justify-end w-full">
                <Button
                  className="bg-red-500"
                  onClick={() => {
                    removeApplyDiscount()
                  }}
                >
                  Remove Code
                </Button>
              </div>
              }
            </CardContent>
          </Card>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Coupouns</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : coupons.length ? (
                  <RadioGroup value={discountCode} onValueChange={handleChange}>
                    <div className="space-y-3">
                      {coupons.map((code) => (
                        <div key={code.code} className="flex items-center justify-between rounded-lg border p-3">
                          <Label key={code.code} htmlFor={code.code} className="flex gap-2 justify-between w-full cursor-pointer">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{code.code}</p>
                                <Badge variant="outline" className="text-xs">
                                  {code.percentage}% off
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">Active, unused</p>
                            </div>
                          </Label>
                          <RadioGroupItem value={code.code} id={code.code} />
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Tag className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No active discount codes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
      <div className="flex w-full py-2 justify-between sticky bottom-0 bg-background items-center ">
        <div className="flex justify-between font-bold gap-2">
          <span>Total: ${(totalPrice - (discountApplied ? discountAmount : 0)).toFixed(2)}</span>
        </div>
        <Button onClick={handleCheckout} disabled={isCheckingOut}>
          {isCheckingOut ? "Processing..." : "Checkout"}
        </Button>
      </div>
    </div>
  )
}

