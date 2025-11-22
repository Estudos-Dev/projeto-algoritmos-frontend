import { useGenerateRanking } from "@/hooks/useGenerateRanking"
import { useEffect, useRef, useState } from "react"
import salesService from "@/services/sales-service"
import type { SaleResponse } from "@/types/Sale"

export const Ranking = () => {
  const stopwatchRef = useRef<{
    start: () => void
    pause: () => void
    reset: () => void
  }>(null)

  const { ranking, generateRanking } = useGenerateRanking()
  const [quantity, setQuantity] = useState<number>(100)
  const [algorithm, setAlgorithm] = useState<string>("quicksort")

  const [algorithmDurationSec, setAlgorithmDurationSec] = useState<
    number | null
  >(null)
  const [loadingStage, setLoadingStage] = useState<
    "idle" | "fetching" | "generating"
  >("idle")

  useEffect(() => {
    ;(async () => {
      try {
        setLoadingStage("fetching")
        const data: SaleResponse[] = await salesService.getSalles(quantity)
        generateRanking(algorithm, quantity, data)
      } catch (error) {
        console.error("Failed to fetch sales for ranking", error)
      } finally {
        setLoadingStage("idle")
      }
    })()
  }, [])

  const handleStart = async () => {
    try {
      setLoadingStage("fetching")
      const data: SaleResponse[] = await salesService.getSalles(quantity)

      setLoadingStage("generating")

      // Início do timing
      const startTime = performance.now()

      generateRanking(algorithm, quantity, data)

      // Fim do timing
      const endTime = performance.now()

      // Tempo em segundos
      const durationSeconds = (endTime - startTime) / 1000

      console.log(durationSeconds)
      setAlgorithmDurationSec(durationSeconds)
    } catch (error) {
      console.error("Failed to fetch/sort ranking", error)
    } finally {
      setLoadingStage("idle")
    }
  }

  // Para o cronômetro manualmente a qualquer momento
  const handlePause = () => {
    stopwatchRef.current?.pause()
  }

  return (
    <div className='w-[60rem] flex flex-col gap-4'>
      <div className='bg-white p-4 rounded-lg gap-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <span className='text-sky-700 font-semibold'>Filtros:</span>

          <label className='flex items-center gap-2 text-sm'>
            <span className='min-w-[72px] text-slate-600'>Quantidade</span>
            <select
              name='quantity'
              id='quantity'
              value={String(quantity)}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className='border border-slate-200 rounded px-2 py-1 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'>
              <option value='10'>10</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
              <option value='500'>500</option>
              <option value='1000'>1000</option>
            </select>
          </label>

          <label className='flex items-center gap-2 text-sm'>
            <span className='min-w-[72px] text-slate-600'>Algoritmo</span>
            <select
              name='algorithm'
              id='algorithm'
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='border border-slate-200 rounded px-2 py-1 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'>
              <option value='quicksort'>QuickSort</option>
              <option value='bubblesort'>BubbleSort</option>
            </select>
          </label>
        </div>

        <div className='flex items-center gap-3 mt-3 md:mt-0'>
          <button
            onClick={handleStart}
            disabled={loadingStage !== "idle"}
            className='bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-sm shadow-sm disabled:opacity-60'
            aria-label='Iniciar'>
            Começar
          </button>
          {/* <button
            onClick={handlePause}
            className='bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md text-sm'
            aria-label='Parar'>
            Parar
          </button> */}
          <span className='text-sm'>Tempo de execução:</span>
          <div className='ml-1 px-3 py-1 rounded-md bg-slate-100 font-mono text-sm text-slate-800'>
            {algorithmDurationSec?.toFixed(3) ?? 0}s
          </div>
          <div className='ml-2 text-sm text-slate-600'>
            {loadingStage === "fetching" && "Buscando itens..."}
            {loadingStage === "generating" && "Gerando ranking..."}
          </div>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <div className='w-full overflow-x-auto rounded-xl'>
          <table className='table-auto w-full text-center'>
            <thead className='bg-gradient-to-r from-sky-50 via-white to-sky-50'>
              <tr>
                <th className='px-4 py-2 font-medium text-sky-700'>Posição</th>
                <th className='px-4 py-2 font-medium text-sky-700'>Item</th>
                <th className='px-4 py-2 font-medium text-sky-700'>Total</th>
              </tr>
            </thead>
            <tbody>
              {ranking && ranking.length > 0 ? (
                ranking.map((sale, idx) => (
                  <tr key={sale.id} className='odd:bg-gray-50'>
                    <td className='px-4 py-2'>{idx + 1}</td>
                    <td className='px-4 py-2'>
                      {sale.clientName || sale.sellerName || `Venda ${sale.id}`}
                    </td>
                    <td className='px-4 py-2'>
                      {Number(sale.total).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='px-4 py-2' colSpan={3}>
                    Sem dados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
