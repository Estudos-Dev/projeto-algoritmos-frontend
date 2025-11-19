import { useEffect } from "react"
import { useStopwatch } from "react-timer-hook"
export const Ranking = () => {
  const {
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, interval: 20 })

  useEffect(() => {
    start()
    const timer = setTimeout(() => {
      pause()
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className='w-[50%] flex flex-col gap-4'>
      <div className='bg-white p-4 rounded-lg gap-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <span className='text-sky-700 font-semibold'>Filtros:</span>

          <label className='flex items-center gap-2 text-sm'>
            <span className='min-w-[72px] text-slate-600'>Quantidade</span>
            <select
              name='quantity'
              id='quantity'
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
              className='border border-slate-200 rounded px-2 py-1 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'>
              <option value='quicksort'>QuickSort</option>
              <option value='bubblesort'>BubbleSort</option>
            </select>
          </label>
        </div>

        <div className='flex items-center gap-3 mt-3 md:mt-0'>
          <button
            onClick={start}
            className='bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-sm shadow-sm'
            aria-label='Iniciar'>
            Começar
          </button>

          <button
            onClick={pause}
            className='bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md text-sm'
            aria-label='Parar'>
            Parar
          </button>

          <div className='ml-1 px-3 py-1 rounded-md bg-slate-100 font-mono text-sm text-slate-800'>
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}:
            {String(Math.floor(milliseconds / 10)).padStart(2, "0")}
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
              <tr className='odd:bg-gray-50'>
                <td className='px-4 py-2'>1</td>
                <td className='px-4 py-2'>Teclado gamer</td>
                <td className='px-4 py-2'>1232313.222</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
