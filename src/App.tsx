import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { Ranking } from "./components/ranking/ranking"
import { ManagementPanel } from "./components/form/form"

function App() {
  return (
    <div className='w-full flex min-h-svh items-center bg-blue-100 flex-col gap-4 sm:gap-5 px-2 sm:px-4'>
      <h1 className='mt-6 sm:mt-8 text-2xl sm:text-3xl lg:text-4xl font-semibold text-sky-700 text-center'>
        Sales Rank
      </h1>
      <div className='w-full max-w-full lg:max-w-[1600px] flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 items-start'>
        <div className='w-full lg:flex-1 min-w-0'>
          <Ranking />
        </div>
        <div className='w-full lg:flex-1 min-w-0'>
          <ManagementPanel />
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/home' element={<App />} />
      </Routes>
    </Router>
  )
}
export default AppRoutes

library.add(fab, fas, far)
