import clientsService, {
  type ClientRequest,
  type ClientResponse,
} from "@/services/clients-service"
import productsService, {
  type ProductRequest,
  type ProductResponse,
} from "@/services/products-service"
import type { SaleResponse } from "@/services/sales-service"
import sallersService, { type SellerResponse } from "@/services/sallers-service"
import React, { useEffect, useState } from "react"

type EntityType = "client" | "seller" | "product"

export const ManagementPanel = () => {
  const [activeTab, setActiveTab] = useState<EntityType>("client")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<
    ProductResponse | ClientResponse | SellerResponse | SaleResponse | null
  >(null)

  const [inputName, setInputName] = useState<string>("")
  const [inputEmail, setInputEmail] = useState<string>("")
  const [inputPrice, setInputPrice] = useState<string>("")

  // Mock data
  const [customers, setCustomers] = useState<ClientResponse[]>([])

  const [sellers, setSellers] = useState<SellerResponse[]>([])

  const [products, setProducts] = useState<ProductResponse[]>([])
  const [quantity, setQuantity] = useState(10)

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "client":
        return customers
      case "seller":
        return sellers
      case "product":
        return products
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
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: any) => {
    setInputName(item.name)
    setInputEmail(item.email)
    setInputPrice(item.price)
    setIsFormOpen(true)
    setEditingItem(item)
  }

  const handleDelete = async (id: number) => {
    try {
      switch (activeTab) {
        case "client":
          await clientsService.deleteClient(id)
          break

        case "seller":
          await sallersService.deleteSeller(id)
          break

        case "product":
          await productsService.deleteProduct(id)
          break

        default:
          break
      }
      fetchData()
      setEditingItem(null)
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    switch (activeTab) {
      case "client":
        const newClient: ClientRequest = {
          name: inputName,
          email: inputEmail,
        }
        await clientsService.createClient(newClient)
        break

      case "seller":
        const newSeller: ClientRequest = {
          name: inputName,
          email: inputEmail,
        }
        await sallersService.createSeller(newSeller)
        break

      case "product":
        const newProduct: ProductRequest = {
          name: inputName,
          price: Number(inputPrice),
        }
        await productsService.createProduct(newProduct)
        break
      default:
        break
    }

    fetchData()
    setEditingItem(null)
    setIsFormOpen(false)
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    switch (activeTab) {
      case "client":
        const newClient: ClientRequest = {
          id: editingItem!.id,
          name: inputName,
          email: inputEmail,
        }
        await clientsService.updateClient(newClient)
        break

      case "seller":
        const newSeller: ClientRequest = {
          id: editingItem!.id,
          name: inputName,
          email: inputEmail,
        }
        await sallersService.updateSeller(newSeller)
        break

      case "product":
        const newProduct: ProductRequest = {
          id: editingItem!.id,
          name: inputName,
          price: Number(inputPrice),
        }
        await productsService.updateProduct(newProduct)
        break

      default:
        break
    }
    fetchData()
    setEditingItem(null)
    setIsFormOpen(false)
  }

  const getTabLabel = (tab: EntityType): string => {
    const labels: Record<EntityType, string> = {
      client: "Clientes",
      seller: "Vendedores",
      product: "Produtos",
    }
    return labels[tab]
  }

  const fetchData = async () => {
    try {
      const [clientsResponse, productsResponse, sellersResponse] =
        await Promise.all([
          clientsService.getClients(quantity),
          productsService.getProducts(quantity),
          sallersService.getSellers(quantity),
        ])

      setCustomers(clientsResponse)
      setProducts(productsResponse)
      setSellers(sellersResponse)
    } catch (error: any) {
      console.error("Failed to fetch data")
    }
  }

  useEffect(() => {
    fetchData()
  }, [quantity])

  const getColumns = () => {
    switch (activeTab) {
      case "client":
        return ["Nome", "Email"]
      case "seller":
        return ["Nome", "Email"]
      case "product":
        return ["Nome", "Preço"]
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
      case "Preço":
        return `R$ ${item.price?.toFixed(2) || "0.00"}`
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

  const clearInputs = () => {
    setInputName("")
    setInputEmail("")
    setInputPrice("")
  }

  return (
    <div className='w-full flex flex-col gap-3 sm:gap-4 items-center'>
      <h2 className='text-lg font-semibold text-slate-700'>
        Gerenciamento de dados
      </h2>
      <div className='w-full bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col gap-4'>
        {/* Tab Navigation */}
        <div className='flex gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto'>
          {(["client", "seller", "product"] as EntityType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSearchQuery("")
                setIsFormOpen(false)
                clearInputs()
                setEditingItem(null)
              }}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "text-sky-700 border-b-2 border-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}>
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Form Section */}
        {isFormOpen && (
          <form
            onSubmit={editingItem ? handleEditSubmit : handleSave}
            className='p-3 sm:p-4 rounded-lg bg-sky-50 border border-sky-200'>
            <h3 className='text-sm font-semibold text-slate-700 mb-3'>
              {editingItem ? "Editar" : "Adicionar"}{" "}
              {getTabLabel(activeTab).toLowerCase()}
            </h3>
            <div className='space-y-2 sm:space-y-3 mb-3'>
              {activeTab === "client" && (
                <>
                  <input
                    type='text'
                    placeholder='Nome do cliente'
                    onChange={(e) => setInputName(e.target.value)}
                    value={inputName}
                    className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                  />
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={(e) => setInputEmail(e.target.value)}
                    value={inputEmail}
                    className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                  />
                </>
              )}
              {activeTab === "seller" && (
                <>
                  <input
                    type='text'
                    placeholder='Nome do vendedor'
                    onChange={(e) => setInputName(e.target.value)}
                    value={inputName}
                    className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                  />
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={(e) => setInputEmail(e.target.value)}
                    value={inputEmail}
                    className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                  />
                </>
              )}
              {activeTab === "product" && (
                <>
                  <input
                    type='text'
                    placeholder='Nome do produto'
                    onChange={(e) => setInputName(e.target.value)}
                    value={inputName}
                    className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                  />
                  <input
                    type='number'
                    placeholder='Preço'
                    onChange={(e) => setInputPrice(e.target.value)}
                    value={inputPrice}
                    className='w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300'
                  />
                </>
              )}
            </div>
            <div className='flex gap-2'>
              <button
                type='submit'
                className='flex-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-sm shadow-sm'>
                Salvar
              </button>
              <button
                onClick={() => {
                  setIsFormOpen(false)
                  clearInputs()
                  setEditingItem(null)
                }}
                className='flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-md text-sm'>
                Cancelar
              </button>
            </div>
          </form>
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
        <label htmlFor='' className=''>
          <span className='mr-2'>Quantidade:</span>
          <select
            onChange={(e) => setQuantity(Number(e.target.value))}
            name=''
            id='quantity'
            className='border border-slate-200 rounded px-3 py-'>
            <option value='10'>10</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
            <option value='500'>500</option>
            <option value='1000'>1000</option>
          </select>
        </label>
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
                filteredData.map((item: any) => (
                  <tr
                    key={item.id}
                    className='odd:bg-gray-50 hover:bg-sky-50 transition-colors border-t border-slate-200'>
                    {getColumns().map((col) => (
                      <td
                        key={col}
                        className='px-2 sm:px-4 py-2 text-slate-700'>
                        <div className='line-clamp-2'>
                          {renderCell(item, col)}
                        </div>
                      </td>
                    ))}
                    <td className='px-2 sm:px-4 py-2'>
                      <div className='flex gap-1 sm:gap-2'>
                        <button
                          onClick={() => handleEdit(item)}
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
    </div>
  )
}
