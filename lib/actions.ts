"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "./db"
import DiscountCode from "./models/DiscountCodeSchema"

export async function applyDiscountCode(code: string) {
  await connectDB()
  const discountCode = await DiscountCode.findOne(
    { code: code, used: false },
  )

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

  const discountCode = await DiscountCode.findOneAndUpdate(
    { code: code, used: false },
    { $set: { used: true } },
    { new: true }
  ).lean()


  if (discountCode) {
    revalidatePath("/admin")
    return true
  }

  return false
}

