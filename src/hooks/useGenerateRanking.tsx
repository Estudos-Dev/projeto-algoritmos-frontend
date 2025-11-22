import { useState } from "react"
import type { SaleResponse } from "@/types/Sale"
import { QuickSort, BubbleSort } from "@/services/algorithm-service"

export const useGenerateRanking = () => {
  const [ranking, setRanking] = useState<SaleResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const generateRanking = (
    algorithm: string,
    quantityOfItems: number,
    items: SaleResponse[]
  ) => {
    setIsLoading(true)

    // measure time taken by sorting (synchronous operation)
    let sorted: SaleResponse[] = []
    if (algorithm === "bubblesort") {
      sorted = BubbleSort(items)
    } else {
      sorted = QuickSort(items)
    }

    // take top N results
    const top = sorted.slice(0, quantityOfItems)
    setRanking(top)
    setIsLoading(false)
  }

  return {
    ranking,
    generateRanking,
    isLoading,
  }
}
