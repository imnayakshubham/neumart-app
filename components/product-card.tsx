"use client"

import type React from "react"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div
        className={cn("group overflow-hidden rounded-xl border bg-card p-3 transition-all hover:shadow-md", className)}
      >
        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            <Button size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

