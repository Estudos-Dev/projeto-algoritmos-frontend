import type { SaleResponse } from "@/types/Sale"

// QuickSort implementation that sorts sales by `total` descending
export function QuickSort(items: SaleResponse[]): SaleResponse[] {
  if (!items || items.length <= 1) return [...items]

  const arr = [...items]

  function qs(low: number, high: number) {
    if (low >= high) return
    const pivot = arr[Math.floor((low + high) / 2)].total
    let i = low
    let j = high
    while (i <= j) {
      while (arr[i].total > pivot) i++
      while (arr[j].total < pivot) j--
      if (i <= j) {
        const tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
        i++
        j--
      }
    }
    if (low < j) qs(low, j)
    if (i < high) qs(i, high)
  }

  qs(0, arr.length - 1)
  return arr
}

// BubbleSort implementation that sorts sales by `total` descending
export function BubbleSort(items: SaleResponse[]): SaleResponse[] {
  const arr = [...(items || [])]
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j].total < arr[j + 1].total) {
        const tmp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tmp
      }
    }
  }
  return arr
}
