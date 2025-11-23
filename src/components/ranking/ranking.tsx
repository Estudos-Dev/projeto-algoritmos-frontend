import { useState } from "react"
import salesService from "@/services/sales-service"
import type { SaleResponse } from "@/types/Sale"
import { QuickSort, BubbleSort, MergeSort } from "@/services/algorithm-service"

interface PerformanceHistory {
  id: string
  algorithm: string
  order: "desc" | "asc"
  quantity: number
  duration: number
  timestamp: Date
}

export const Ranking = () => {
  const [ranking, setRanking] = useState<SaleResponse[]>([])
  const [fullRanking, setFullRanking] = useState<SaleResponse[]>([])
  const [quantity, setQuantity] = useState<number>(100)
  const [algorithm, setAlgorithm] = useState<string>("quicksort")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [performanceHistory, setPerformanceHistory] = useState<
    PerformanceHistory[]
  >([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResult, setSearchResult] = useState<SaleResponse | null>(null)
  const [searchResultIndex, setSearchResultIndex] = useState<number | null>(
    null
  )

  const [cachedData, setCachedData] = useState<Map<number, SaleResponse[]>>(
    new Map()
  )
  const [algorithmDurationSec, setAlgorithmDurationSec] = useState<
    number | null
  >(null)
  const [fetchDurationSec, setFetchDurationSec] = useState<number | null>(null)
  const [loadingStage, setLoadingStage] = useState<
    "idle" | "fetching" | "generating"
  >("idle")

  // Função Linear Search para buscar pelo nome
  const linearSearch = (
    query: string
  ): { result: SaleResponse | null; index: number | null } => {
    if (!query.trim()) {
      return { result: null, index: null }
    }

    const lowerQuery = query.toLowerCase()
    for (let i = 0; i < fullRanking.length; i++) {
      const name = fullRanking[i].clientName.toLowerCase()
      if (name.includes(lowerQuery)) {
        return { result: fullRanking[i], index: i }
      }
    }

    return { result: null, index: null }
  }

  // Função para adicionar ao histórico (últimas 3)
  const addToHistory = (
    algo: string,
    order: "desc" | "asc",
    qty: number,
    duration: number
  ) => {
    const newEntry: PerformanceHistory = {
      id: `${Date.now()}`,
      algorithm: algo,
      order,
      quantity: qty,
      duration,
      timestamp: new Date(),
    }

    setPerformanceHistory((prev) => [newEntry, ...prev].slice(0, 3))
  }

  // Função para gerar ranking (agora dentro do componente)
  const generateRanking = (
    algo: string,
    qty: number,
    items: SaleResponse[],
    order: "desc" | "asc" = "desc"
  ) => {
    // Ordena os dados primeiro
    let sorted: SaleResponse[] = []
    if (algo === "bubblesort") {
      sorted = BubbleSort(items, order)
    } else if (algo === "mergesort") {
      sorted = MergeSort(items, order)
    } else {
      sorted = QuickSort(items, order)
    }

    // Pega top N
    const top = sorted.slice(0, qty)
    setRanking(top)
    setFullRanking(top)
    setSearchQuery("")
    setSearchResult(null)
    setSearchResultIndex(null)
  }

  // Pre-carrega dados na inicialização
  useState(() => {
    const preloadData = async () => {
      try {
        const data100 = await salesService.getSalles(100)
        setCachedData((prev) => new Map(prev).set(100, data100))

        // Gera ranking inicial
        generateRanking(algorithm, 100, data100, sortOrder)
      } catch (error) {
        console.error("Failed to preload data", error)
      }
    }
    preloadData()
  }, [])

  const handleStart = async () => {
    try {
      // Se já tem em cache, não faz requisição
      if (cachedData.has(quantity)) {
        setLoadingStage("generating")

        const sortStart = performance.now()
        generateRanking(
          algorithm,
          quantity,
          cachedData.get(quantity)!,
          sortOrder
        )
        const sortEnd = performance.now()

        const duration = (sortEnd - sortStart) / 1000
        setAlgorithmDurationSec(duration)
        setFetchDurationSec(0)
        addToHistory(algorithm, sortOrder, quantity, duration)
        setLoadingStage("idle")
        return
      }

      // Se não tem, busca do backend
      setLoadingStage("fetching")
      const fetchStart = performance.now()
      const data = await salesService.getSalles(quantity)
      const fetchEnd = performance.now()

      setLoadingStage("generating")
      const sortStart = performance.now()
      generateRanking(algorithm, quantity, data, sortOrder)
      const sortEnd = performance.now()

      const duration = (sortEnd - sortStart) / 1000
      setCachedData((prev) => new Map(prev).set(quantity, data))
      setFetchDurationSec((fetchEnd - fetchStart) / 1000)
      setAlgorithmDurationSec(duration)
      addToHistory(algorithm, sortOrder, quantity, duration)
    } catch (error) {
      console.error("Failed to fetch/sort ranking", error)
    } finally {
      setLoadingStage("idle")
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleAlgorithmChange = (newAlgorithm: string) => {
    setAlgorithm(newAlgorithm)
  }

  const handleSortOrderChange = (newOrder: "desc" | "asc") => {
    setSortOrder(newOrder)

    // // Re-ordena com os dados em cache
    // if (cachedData.has(quantity)) {
    //   const sortStart = performance.now()
    //   generateRanking(algorithm, quantity, cachedData.get(quantity)!, newOrder)
    //   const sortEnd = performance.now()

    //   const duration = (sortEnd - sortStart) / 1000
    //   setAlgorithmDurationSec(duration)
    //   addToHistory(algorithm, newOrder, quantity, duration)
    // }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      const { result, index } = linearSearch(query)
      setSearchResult(result)
      setSearchResultIndex(index)
      if (result) {
        setRanking([result])
      } else {
        setRanking([])
      }
    } else {
      setSearchResult(null)
      setSearchResultIndex(null)
      setRanking(fullRanking)
    }
  }

  const getAlgorithmLabel = (algo: string): string => {
    const labels: Record<string, string> = {
      quicksort: "QuickSort",
      bubblesort: "BubbleSort",
      mergesort: "MergeSort",
    }
    return labels[algo] || algo
  }

  const getOrderLabel = (order: "desc" | "asc"): string => {
    return order === "desc" ? "↓" : "↑"
  }

  return (
    <div className='w-full flex flex-col gap-3 sm:gap-4'>
      <div className='bg-white p-3 sm:p-4 rounded-lg gap-3 sm:gap-4 flex flex-col shadow-sm'>
        {/* Filtros */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-wrap'>
          <span className='text-sky-700 font-semibold text-sm whitespace-nowrap'>
            Filtros:
          </span>

          <label className='flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap'>
            <span className='text-slate-600'>Quantidade:</span>
            <select
              value={String(quantity)}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              disabled={loadingStage !== "idle"}
              className='border border-slate-200 rounded px-2 py-1 bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 disabled:opacity-50'>
              <option value='10'>10</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
              <option value='500'>500</option>
              <option value='1000'>1000</option>
            </select>
          </label>

          <label className='flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap'>
            <span className='text-slate-600'>Algoritmo:</span>
            <select
              value={algorithm}
              onChange={(e) => handleAlgorithmChange(e.target.value)}
              disabled={loadingStage !== "idle"}
              className='border border-slate-200 rounded px-2 py-1 bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 disabled:opacity-50'>
              <option value='quicksort'>QuickSort</option>
              <option value='bubblesort'>BubbleSort</option>
              <option value='mergesort'>MergeSort</option>
            </select>
          </label>

          <label className='flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap'>
            <span className='text-slate-600'>Ordem:</span>
            <select
              value={sortOrder}
              onChange={(e) => handleSortOrderChange(e.target.value as any)}
              disabled={loadingStage !== "idle"}
              className='border border-slate-200 rounded px-2 py-1 bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 disabled:opacity-50'>
              <option value='desc'>Maior → Menor</option>
              <option value='asc'>Menor → Maior</option>
            </select>
          </label>
        </div>

        {/* Botões e Info */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center  gap-2 sm:gap-3'>
          <button
            onClick={handleStart}
            disabled={loadingStage !== "idle"}
            className='bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm shadow-sm disabled:opacity-60 whitespace-nowrap order-2 sm:order-1'>
            Ordenar
          </button>

          <div className='px-3 py-1.5 rounded-md bg-sky-100 font-mono text-xs text-sky-800 flex items-center justify-center order-1 sm:order-2'>
            <p className='text-slate-600 font-bold mr-1'>Tempo:</p>{" "}
            {algorithmDurationSec?.toFixed(5) ?? 0}s
          </div>
        </div>
      </div>

      {performanceHistory.length > 0 && (
        <div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm'>
          <h3 className='text-xs sm:text-sm font-semibold text-slate-700 mb-3'>
            Histórico de Performance
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
            {performanceHistory.map((entry, idx) => (
              <div
                key={entry.id}
                className='border border-slate-200 rounded-lg p-2 sm:p-3 bg-gradient-to-br from-sky-50 to-slate-50 hover:shadow-md transition-shadow'>
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-600 text-white text-xs font-bold'>
                      {idx + 1}
                    </span>
                    <span className='text-xs sm:text-sm font-semibold text-slate-800'>
                      {getAlgorithmLabel(entry.algorithm)}
                    </span>
                  </div>
                  <span className='text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded'>
                    {getOrderLabel(entry.order)}
                  </span>
                </div>
                <div className='space-y-1 text-xs text-slate-600'>
                  <div className='flex justify-between'>
                    <span>Quantidade:</span>
                    <span className='font-mono font-semibold text-slate-800'>
                      {entry.quantity}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tempo:</span>
                    <span className='font-mono font-semibold text-sky-700'>
                      {entry.duration.toFixed(5)}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm'>
        <div className='mb-3 sm:mb-4'>
          <label className='block text-xs sm:text-sm font-semibold text-slate-700 mb-2'>
            Buscar por nome
          </label>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder='Digite o nome do cliente...'
            className='w-full border border-slate-200 rounded px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
          />
          {searchQuery && searchResult && searchResultIndex !== null && (
            <div className='mt-2 p-2 sm:p-3 rounded-lg bg-green-50 border border-green-200'>
              <p className='text-xs text-green-800'>
                <span className='font-semibold'>Encontrado!</span> Posição{" "}
                <span className='font-mono font-bold'>
                  {searchResultIndex + 1}
                </span>{" "}
                - {searchResult.clientName}
              </p>
            </div>
          )}
          {searchQuery && !searchResult && (
            <div className='mt-2 p-2 sm:p-3 rounded-lg bg-yellow-50 border border-yellow-200'>
              <p className='text-xs text-yellow-800'>
                <span className='font-semibold'>Não encontrado</span> - Nenhum
                resultado para "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        <div className='w-full overflow-x-auto rounded-xl'>
          {loadingStage !== "idle" ? (
            <div className='text-xs sm:text-base font-medium text-slate-600 animate-pulse flex items-center justify-center py-8'>
              {loadingStage === "fetching" && "Buscando itens..."}
              {loadingStage === "generating" && "Ordenando..."}
            </div>
          ) : (
            <table className='table-auto w-full text-center text-xs sm:text-sm'>
              <thead className='bg-gradient-to-r from-sky-50 via-white to-sky-50'>
                <tr>
                  <th className='px-2 sm:px-4 py-2 font-medium text-sky-700'>
                    Posição
                  </th>
                  <th className='px-2 sm:px-4 py-2 font-medium text-sky-700'>
                    Cliente
                  </th>
                  <th className='px-2 sm:px-4 py-2 font-medium text-sky-700'>
                    Vendedor
                  </th>
                  <th className='px-2 sm:px-4 py-2 font-medium text-sky-700'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranking && ranking.length > 0 ? (
                  ranking.map((sale, idx) => (
                    <tr
                      key={sale.id}
                      className='odd:bg-gray-50 hover:bg-sky-50 transition-colors border-t border-slate-200'>
                      <td className='px-2 sm:px-4 py-2'>
                        {searchResult ? searchResultIndex! + 1 : idx + 1}
                      </td>
                      <td className='px-2 sm:px-4 py-2 text-center'>
                        <div className='line-clamp-2'>
                          {sale.clientName ||
                            sale.sellerName ||
                            `Venda ${sale.id}`}
                        </div>
                      </td>
                      <td className='px-2 sm:px-4 py-2 text-center'>
                        <div className='line-clamp-2'>{sale.sellerName}</div>
                      </td>
                      <td className='px-2 sm:px-4 py-2 font-semibold'>
                        R$ {Number(sale.total).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className='px-2 sm:px-4 py-2 text-slate-500 text-xs sm:text-sm'
                      colSpan={3}>
                      Sem dados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
