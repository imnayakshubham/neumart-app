"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { getProductById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const newParams = await params
        const data = await getProductById(newParams.id)
        if (data) {
          setProduct(data)
        } else {
          router.push("/products")
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        router.push("/products")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params, router])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }

      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart.`,
      })
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number.parseInt(e.target.value))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="mt-4">The product you're looking for doesn't exist.</p>
        <Button className="mt-6" onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    )
  }

  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                {quantityOptions.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <h3 className="font-semibold">Product Details</h3>
              <p className="text-sm text-muted-foreground">
                Experience the future of technology with the {product.name}. This premium product offers cutting-edge
                features and sleek design to enhance your digital lifestyle.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Premium quality materials</li>
                <li>1-year manufacturer warranty</li>
                <li>Energy efficient design</li>
                <li>Compatible with all NeuMart ecosystem products</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4 pt-4">
              <h3 className="font-semibold">Shipping Information</h3>
              <p className="text-sm text-muted-foreground">
                We offer free standard shipping on all orders over $50. Express shipping is available for an additional
                fee.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Standard Shipping: 3-5 business days</li>
                <li>Express Shipping: 1-2 business days</li>
                <li>International Shipping: 7-14 business days</li>
              </ul>
            </TabsContent>
            <TabsContent value="returns" className="space-y-4 pt-4">
              <h3 className="font-semibold">Return Policy</h3>
              <p className="text-sm text-muted-foreground">
                We accept returns within 30 days of delivery for a full refund or exchange.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Items must be in original condition</li>
                <li>Return shipping is free for defective items</li>
                <li>Refunds are processed within 5-7 business days</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

