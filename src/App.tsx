import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { Ranking } from "./components/ranking/ranking"

function App() {
  return (
    <div className='w-full flex min-h-svh items-center bg-blue-100 flex-col'>
      <h1 className='mt-8 text-4xl font-semibold text-slate-900'>Sales Rank</h1>
      <div className='w-[90%] flex flex-col items-center'>
        <Ranking />
        {/* <DataTable columns={columns} data={products} /> */}
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </Router>
  )
}
export default AppRoutes

library.add(fab, fas, far)
