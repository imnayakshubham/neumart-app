"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AdminStats } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, Package, ShoppingBag, Tag, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DEFAULT_ORDER_DISCOUNT_PERCENT, DEFAULT_ORDER_THRESHOLD } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(stats?.discountPercentage ?? DEFAULT_ORDER_DISCOUNT_PERCENT)
  const [orderThreshold, setOrderThreshold] = useState<number | string>(stats?.orderThreshold ?? DEFAULT_ORDER_THRESHOLD)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
          setOrderThreshold(data.stats?.orderThreshold)
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error)
        toast({
          title: "Error",
          description: "Failed to fetch admin statistics.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [toast])

  const handleGenerateDiscount = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/admin/generate-discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentage: discountPercentage ? Number.parseInt(discountPercentage.toString()) : DEFAULT_ORDER_DISCOUNT_PERCENT,
          orderThreshold: orderThreshold ? Number.parseInt(orderThreshold.toString()) : DEFAULT_ORDER_THRESHOLD,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Discount code generated",
          description: `New discount code: ${data.code} (${data.percentage}% off)`,
        })

        const statsResponse = await fetch("/api/admin/stats")
        const statsData = await statsResponse.json()

        if (statsData.success) {
          setStats(statsData.stats)
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to generate discount code.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate discount code.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteDiscountCode = async (code: string) => {
    try {
      const response = await fetch(`/api/admin/discount-codes/${code}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Discount code deleted",
          description: `Discount code ${code} has been deleted.`,
        })

        const statsResponse = await fetch("/api/admin/stats")
        const statsData = await statsResponse.json()

        if (statsData.success) {
          setStats(statsData.stats)
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete discount code.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount code.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store, track sales, and generate discount codes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.ordersUntilNextDiscount || 0} orders until next discount
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalItemsSold || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.totalOrders ? (stats.totalItemsSold / stats.totalOrders).toFixed(1) : 0} items per order
                      avg.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || "0.00"}</div>
                    <p className="text-xs text-muted-foreground">
                      ${stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0.00"} per order
                      avg.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Discount Usage</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats?.totalDiscountAmount.toFixed(2) || "0.00"}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.totalOrders ? ((stats.ordersWithDiscount / stats.totalOrders) * 100).toFixed(1) : 0}% of
                      orders used discounts
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders placed in your store</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : stats?.recentOrders?.length ? (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()} · {order.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <Badge variant={order.discountApplied ? "default" : "outline"} className="mt-1">
                            {order.discountApplied ? "Discounted" : "Full Price"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No orders yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Active Discount Codes</CardTitle>
                <CardDescription>Currently available discount codes</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : stats?.discountCodes.filter((code) => !code.used).length ? (
                  <div className="space-y-3">
                    {stats.discountCodes
                      .filter((code) => !code.used)
                      .map((code) => (
                        <div key={code.code} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{code.code}</p>
                              <Badge variant="outline" className="text-xs">
                                {code.percentage}% off
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Active, unused</p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Discount Code</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this discount code? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDiscountCode(code.code)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Tag className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No active discount codes</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab("discounts")}>
                      Generate Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate Discount Code</CardTitle>
                <CardDescription>Create a new discount code for customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-percentage">Discount Percentage</Label>
                  <div className="flex">
                    <Input
                      id="discount-percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      className="rounded-r-none"
                    />
                    <div className="flex items-center justify-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                      %
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-threshold">Order Threshold (every N orders)</Label>
                  <Input
                    id="order-threshold"
                    type="number"
                    min="1"
                    value={orderThreshold}
                    onChange={(e) => setOrderThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A new discount code will be automatically generated after every {orderThreshold} orders.
                  </p>
                </div>

                <Button onClick={handleGenerateDiscount} disabled={isGenerating || loading} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Discount Code"}
                </Button>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium">How the discount system works:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>
                      Discount codes are automatically generated after every {stats?.orderThreshold || orderThreshold}{" "}
                      orders
                    </li>
                    <li>Each discount code can only be used once</li>
                    <li>
                      After a code is used, a new one becomes available only after the next{" "}
                      {stats?.orderThreshold || orderThreshold} orders
                    </li>
                    <li>You can also manually generate codes with custom percentages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Discount Codes</CardTitle>
                  <CardDescription>Manage all discount codes</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : stats?.discountCodes.length ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Filter by status</Label>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {stats.discountCodes.map((code) => (
                          <div key={code.code} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{code.code}</p>
                                  <Badge variant={code.used ? "outline" : "default"}>
                                    {code.used ? "Used" : "Active"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{code.percentage}% off</p>
                              </div>
                              {!code.used && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Discount Code</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this discount code? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteDiscountCode(code.code)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No discount codes available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Discount Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Discounts</p>
                          <p className="text-2xl font-bold">${stats?.totalDiscountAmount.toFixed(2) || "0.00"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Redemption Rate</p>
                          <p className="text-2xl font-bold">
                            {stats?.totalOrders ? ((stats.ordersWithDiscount / stats.totalOrders) * 100).toFixed(1) : 0}
                            %
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <div>
                          <p className="font-medium">Next Discount Code</p>
                          <p className="text-sm text-muted-foreground">
                            {stats?.ordersUntilNextDiscount || 0} orders remaining
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                          {stats?.ordersUntilNextDiscount || 0}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

