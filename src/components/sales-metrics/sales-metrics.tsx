export const SalesMetrics = () => {
  return (
    <div className='w-full flex flex-col gap-2'>
      <h2 className='text-2xl'>Métricas</h2>
      <div className='w-full flex justify-between'>
        <div className='bg-white min-w-[30%] p-3 pr-7 rounded-sm shadow-xl'>
          <p className='text-xl font-medium mb-3'>Total de vendas</p>
          <span className='text-3xl font-semibold'>1234</span>
        </div>
        <div className='bg-white min-w-[30%] p-3 pr-7 rounded-sm shadow-xl'>
          <p className='text-xl font-medium mb-3'>Produtos em estoque</p>
          <span className='text-3xl font-semibold'>1234</span>
        </div>
        <div className='bg-white min-w-[30%] p-3 pr-7 rounded-sm shadow-xl'>
          <p className='text-xl font-medium mb-3'>Faturamento</p>
          <span className='text-3xl font-semibold'>R$1234</span>
        </div>
      </div>
    </div>
  )
}
