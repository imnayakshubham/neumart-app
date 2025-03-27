"use server"

import { revalidatePath } from "next/cache"
import { store } from "@/lib/store"

export async function applyDiscountCode(code: string) {
  const discountCode = store.discountCodes.find((discount) => discount.code === code && !discount.used)
  console.log({ discountCode, store })

  if (!discountCode) {
    return {
      success: false,
      message: "Invalid or already used discount code",
    }
  }

  return {
    success: true,
    discountPercentage: discountCode.percentage,
  }
}

export async function markDiscountAsUsed(code: string) {
  const discountIndex = store.discountCodes.findIndex((discount) => discount.code === code && !discount.used)

  if (discountIndex !== -1) {
    store.discountCodes[discountIndex].used = true
    revalidatePath("/admin")
    return true
  }

  return false
}

