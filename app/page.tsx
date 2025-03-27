import ProductGrid from "@/components/product-grid"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section id="products" className="mb-16">
        <ProductGrid />
      </section>
    </div>
  )
}

