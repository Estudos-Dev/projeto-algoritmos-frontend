import { useState } from "react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface Seller {
  id: string
  name: string
  email: string
  commission: number
}

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

interface Sale {
  id: string
  clientName: string
  sellerName: string
  productName: string
  total: number
  date: string
}

type EntityType = "customer" | "seller" | "product" | "sale"

export const ManagementPanel = () => {
  const [activeTab, setActiveTab] = useState<EntityType>("customer")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Mock data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Master Gama SS",
      email: "master@example.com",
      phone: "11999999999",
    },
    {
      id: "2",
      name: "Super Max Ltda",
      email: "supermax@example.com",
      phone: "11988888888",
    },
  ])

  const [sellers, setSellers] = useState<Seller[]>([
    { id: "1", name: "João Silva", email: "joao@example.com", commission: 10 },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
      commission: 12,
    },
  ])

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Produto A", price: 100, quantity: 50 },
    { id: "2", name: "Produto B", price: 250, quantity: 30 },
  ])

  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      clientName: "Master Gama SS",
      sellerName: "João Silva",
      productName: "Produto A",
      total: 5000,
      date: "2025-11-22",
    },
    {
      id: "2",
      clientName: "Super Max Ltda",
      sellerName: "Maria Santos",
      productName: "Produto B",
      total: 7500,
      date: "2025-11-21",
    },
  ])

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "customer":
        return customers
      case "seller":
        return sellers
      case "product":
        return products
      case "sale":
        return sales
      default:
        return []
    }
  }

  // Filter data by search
  const getFilteredData = () => {
    const data = getCurrentData()
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase()
    return data.filter((item: any) => {
      const name = item.name?.toLowerCase() || ""
      const email = item.email?.toLowerCase() || ""
      const clientName = item.clientName?.toLowerCase() || ""
      const sellerName = item.sellerName?.toLowerCase() || ""
      const productName = item.productName?.toLowerCase() || ""

      return (
        name.includes(query) ||
        email.includes(query) ||
        clientName.includes(query) ||
        sellerName.includes(query) ||
        productName.includes(query)
      )
    })
  }

  // Handle operations (mocks for now)
  const handleAdd = () => {
    setEditingId(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    // Mock delete
    console.log(`Delete ${activeTab} with id: ${id}`)
  }

  const handleSave = () => {
    // Mock save
    console.log(`Save ${activeTab}`)
    setIsFormOpen(false)
  }

  const getTabLabel = (tab: EntityType): string => {
    const labels: Record<EntityType, string> = {
      customer: "Clientes",
      seller: "Vendedores",
      product: "Produtos",
      sale: "Vendas",
    }
    return labels[tab]
  }

  const getColumns = () => {
    switch (activeTab) {
      case "customer":
        return ["Nome", "Email", "Telefone"]
      case "seller":
        return ["Nome", "Email", "Comissão (%)"]
      case "product":
        return ["Nome", "Preço", "Quantidade"]
      case "sale":
        return ["Cliente", "Vendedor", "Produto", "Total", "Data"]
      default:
        return []
    }
  }

  const renderCell = (item: any, field: string) => {
    switch (field) {
      case "Nome":
        return item.name || item.clientName || "-"
      case "Email":
        return item.email || "-"
      case "Telefone":
        return item.phone || "-"
      case "Comissão (%)":
        return item.commission || "-"
      case "Preço":
        return `R$ ${item.price?.toFixed(2) || "0.00"}`
      case "Quantidade":
        return item.quantity || "-"
      case "Cliente":
        return item.clientName || "-"
      case "Vendedor":
        return item.sellerName || "-"
      case "Produto":
        return item.productName || "-"
      case "Total":
        return `R$ ${item.total?.toFixed(2) || "0.00"}`
      case "Data":
        return item.date || "-"
      default:
        return "-"
    }
  }

  const filteredData = getFilteredData()

  return (
    <div className='w-full bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col gap-4'>
      {/* Tab Navigation */}
      <div className='flex gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto'>
        {(["customer", "seller", "product", "sale"] as EntityType[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSearchQuery("")
                setIsFormOpen(false)
              }}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "text-sky-700 border-b-2 border-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}>
              {getTabLabel(tab)}
            </button>
          )
        )}
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className='p-3 sm:p-4 rounded-lg bg-sky-50 border border-sky-200'>
          <h3 className='text-sm font-semibold text-slate-700 mb-3'>
            {editingId ? "Editar" : "Adicionar"}{" "}
            {getTabLabel(activeTab).toLowerCase()}
          </h3>
          <div className='space-y-2 sm:space-y-3 mb-3'>
            {activeTab === "customer" && (
              <>
                <input
                  type='text'
                  placeholder='Nome do cliente'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='email'
                  placeholder='Email'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='tel'
                  placeholder='Telefone'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
              </>
            )}
            {activeTab === "seller" && (
              <>
                <input
                  type='text'
                  placeholder='Nome do vendedor'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='email'
                  placeholder='Email'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='number'
                  placeholder='Comissão (%)'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
              </>
            )}
            {activeTab === "product" && (
              <>
                <input
                  type='text'
                  placeholder='Nome do produto'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='number'
                  placeholder='Preço'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='number'
                  placeholder='Quantidade'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
              </>
            )}
            {activeTab === "sale" && (
              <>
                <input
                  type='text'
                  placeholder='Cliente'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='text'
                  placeholder='Vendedor'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='text'
                  placeholder='Produto'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
                <input
                  type='number'
                  placeholder='Total'
                  className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                />
              </>
            )}
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              className='flex-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-sm shadow-sm'>
              Salvar
            </button>
            <button
              onClick={() => setIsFormOpen(false)}
              className='flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-md text-sm'>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Search and Add Button */}
      <div className='flex flex-col sm:flex-row gap-2'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Buscar ${getTabLabel(activeTab).toLowerCase()}...`}
          className='flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
        />
        <button
          onClick={handleAdd}
          className='bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm shadow-sm whitespace-nowrap w-full sm:w-auto'>
          + Adicionar
        </button>
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-lg border border-slate-200'>
        <table className='w-full text-xs sm:text-sm'>
          <thead className='bg-gradient-to-r from-sky-50 via-white to-sky-50'>
            <tr>
              {getColumns().map((col) => (
                <th
                  key={col}
                  className='px-2 sm:px-4 py-2 text-left font-medium text-sky-700'>
                  {col}
                </th>
              ))}
              <th className='px-2 sm:px-4 py-2 text-left font-medium text-sky-700'>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item: any, idx) => (
                <tr
                  key={item.id}
                  className='odd:bg-gray-50 hover:bg-sky-50 transition-colors border-t border-slate-200'>
                  {getColumns().map((col) => (
                    <td key={col} className='px-2 sm:px-4 py-2 text-slate-700'>
                      <div className='line-clamp-2'>
                        {renderCell(item, col)}
                      </div>
                    </td>
                  ))}
                  <td className='px-2 sm:px-4 py-2'>
                    <div className='flex gap-1 sm:gap-2'>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className='text-sky-600 hover:text-sky-700 font-medium text-xs'>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className='text-red-600 hover:text-red-700 font-medium text-xs'>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={getColumns().length + 1}
                  className='px-2 sm:px-4 py-4 text-center text-slate-500 text-xs sm:text-sm'>
                  {searchQuery
                    ? "Nenhum resultado encontrado"
                    : "Nenhum item disponível"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
