import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom"
import Sidebar from "./components/Sidebar/Sidebar"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import Dashboard from "./pages/Dashboard"
function App() {
  return (
    <div className='w-full flex min-h-svh justify-between bg-gray-200'>
      <Sidebar />
      <div className='w-full'>
        <Outlet />
      </div>
      {/* <DataTable columns={columns} data={products} /> */}
    </div>
  )
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/dashboard' index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}
export default AppRoutes

library.add(fab, fas, far)
