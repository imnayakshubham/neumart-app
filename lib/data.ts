import type { Product } from "./types"

const products: Product[] = [
  {
    id: "prod_1",
    name: "NeuMart NeoPod Smart Speaker",
    description:
      "Voice-controlled smart speaker with ambient lighting and premium sound quality. Control your smart home devices with simple voice commands.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1000&auto=format&fit=crop",
    category: "Smart Home",
  },
  {
    id: "prod_2",
    name: "NeuMart HoloLens AR Glasses",
    description:
      "Augmented reality glasses for immersive experiences. Overlay digital content on your real-world environment for work and entertainment.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop",
    category: "Wearables",
  },
  {
    id: "prod_3",
    name: "NeuMart QuantumX Wireless Earbuds",
    description:
      "Noise-cancelling earbuds with 24-hour battery life. Crystal clear audio with deep bass and comfortable all-day wear design.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop",
    category: "Audio",
  },
  {
    id: "prod_4",
    name: "NeuMart NeoCharge Wireless Charging Pad",
    description:
      "Fast wireless charging for all compatible devices. Sleek, minimalist design with LED indicators and foreign object detection.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1543472750-506bacbf5808?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
  },
  {
    id: "prod_5",
    name: "NeuMart PulseTrack Fitness Band",
    description:
      "Advanced fitness tracking with heart rate monitoring, sleep analysis, and workout detection. Water-resistant design for all activities.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000&auto=format&fit=crop",
    category: "Wearables",
  },
  {
    id: "prod_6",
    name: "NeuMart SkyDrone Pro",
    description:
      "4K camera drone with obstacle avoidance, 30-minute flight time, and 3-axis gimbal for ultra-smooth footage. Includes carrying case.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop",
    category: "Drones",
  },
  {
    id: "prod_7",
    name: "NeuMart NeoDesk Smart Lamp",
    description:
      "Adjustable desk lamp with wireless charging base, color temperature control, and app connectivity. Perfect for home office setups.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop",
    category: "Smart Home",
  },
  {
    id: "prod_8",
    name: "NeuMart VortexBook Ultra",
    description:
      "Ultra-thin laptop with 4K touchscreen display, 16GB RAM, 512GB SSD, and all-day battery life. Includes premium aluminum chassis.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
    category: "Computers",
  },
  {
    id: "prod_9",
    name: "NeuMart NeoWatch Series X",
    description:
      "Advanced smartwatch with health monitoring, GPS, and 5-day battery life. Water-resistant to 50m with customizable watch faces.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop",
    category: "Wearables",
  },
  {
    id: "prod_10",
    name: "NeuMart UltraGrip Phone Case",
    description:
      "Premium phone case with military-grade drop protection, antimicrobial coating, and wireless charging compatibility.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1592320402243-605cc3e935f7?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
  },
  {
    id: "prod_11",
    name: "NeuMart SoundWave Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with 360° sound, 20-hour battery life, and waterproof design. Perfect for outdoor adventures.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop",
    category: "Audio",
  },
  {
    id: "prod_12",
    name: "NeuMart PowerBank Pro 20000mAh",
    description:
      "High-capacity power bank with fast charging, dual USB ports, and LED power indicator. Charges multiple devices simultaneously.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
  },
  {
    id: "prod_13",
    name: "NeuMart SmartHome Hub Controller",
    description:
      "Central hub for all your smart home devices with voice control, automation scheduling, and energy monitoring features.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop",
    category: "Smart Home",
  },
  {
    id: "prod_14",
    name: "NeuMart VR Gaming Headset",
    description:
      "Immersive virtual reality headset with 4K resolution per eye, spatial audio, and advanced motion tracking for gaming and experiences.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1622979135240-caa6648190b6?q=80&w=1000&auto=format&fit=crop",
    category: "Gaming",
  },
  {
    id: "prod_15",
    name: "NeuMart ProGamer Mechanical Keyboard",
    description:
      "RGB mechanical gaming keyboard with customizable key switches, macro programming, and aircraft-grade aluminum construction.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop",
    category: "Gaming",
  },
  {
    id: "prod_16",
    name: "NeuMart UltraWide Curved Monitor",
    description:
      "34-inch curved gaming monitor with 144Hz refresh rate, 1ms response time, and HDR support for immersive gaming and productivity.",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop",
    category: "Computers",
  },
]

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return products
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products.find((product) => product.id === id)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return products.filter((product) => product.category === category)
}

export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const lowercaseQuery = query.toLowerCase()

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery),
  )
}

