import { columns } from "./components/ProductTable/columns"
import { DataTable } from "./components/ProductTable/DataTable"
import { products } from "./types/Product"

function App() {
  return (
    <div className="w-full flex min-h-svh flex-col items-center justify-center">
      <DataTable columns={columns} data={products}/>
    </div>
  )
}

export default App
