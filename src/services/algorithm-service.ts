import type { SaleResponse } from "./sales-service"

// QuickSort implementation that sorts sales by `total` in ascending or descending order
export function QuickSort(
  items: SaleResponse[],
  order: "desc" | "asc" = "desc"
): SaleResponse[] {
  if (!items || items.length <= 1) return [...items]

  const arr = [...items]

  function qs(low: number, high: number) {
    if (low >= high) return

    const pivotValue = arr[Math.floor((low + high) / 2)].total
    let i = low
    let j = high

    while (i <= j) {
      // Para descending: arr[i].total > pivot vai para frente
      // Para ascending: arr[i].total < pivot vai para frente
      if (order === "desc") {
        while (arr[i].total > pivotValue) i++
        while (arr[j].total < pivotValue) j--
      } else {
        while (arr[i].total < pivotValue) i++
        while (arr[j].total > pivotValue) j--
      }

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

// BubbleSort implementation that sorts sales by `total` in ascending or descending order
export function BubbleSort(
  items: SaleResponse[],
  order: "desc" | "asc" = "desc"
): SaleResponse[] {
  const arr = [...(items || [])]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      const shouldSwap =
        order === "desc"
          ? arr[j].total < arr[j + 1].total
          : arr[j].total > arr[j + 1].total

      if (shouldSwap) {
        const tmp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tmp
      }
    }
  }

  return arr
}

// MergeSort implementation that sorts sales by `total` in ascending or descending order
export function MergeSort(
  items: SaleResponse[],
  order: "desc" | "asc" = "desc"
): SaleResponse[] {
  if (!items || items.length <= 1) return [...items]

  const arr = [...items]

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      const leftValue = leftArr[i].total
      const rightValue = rightArr[j].total

      const shouldTakeLeft =
        order === "desc" ? leftValue >= rightValue : leftValue <= rightValue

      if (shouldTakeLeft) {
        arr[k++] = leftArr[i++]
      } else {
        arr[k++] = rightArr[j++]
      }
    }

    while (i < leftArr.length) {
      arr[k++] = leftArr[i++]
    }

    while (j < rightArr.length) {
      arr[k++] = rightArr[j++]
    }
  }

  function mergeSort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      mergeSort(left, mid)
      mergeSort(mid + 1, right)
      merge(left, mid, right)
    }
  }

  mergeSort(0, arr.length - 1)
  return arr
}

export function linearSearch(
  arr: SaleResponse[],
  target: string,
  key: string = "descricao"
) {
  let comparisons = 0
  const result = []
  for (const item of arr) {
    comparisons++
    if ((item as any)[key].toLowerCase().includes(target.toLowerCase())) {
      result.push(item)
    }
  }

  return { result, comparisons }
}
