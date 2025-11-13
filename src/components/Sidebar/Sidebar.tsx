import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"
function Sidebar() {
  const sidebarList = [
    {
      to: "/dashboard",
      icon: "fa-solid fa-chart-line",
      label: "Dashboard",
    },
    {
      to: "/products",
      icon: "fa-solid fa-table-list",
      label: "Produtos",
    },
    {
      to: "/clients",
      icon: "fa-solid fa-users",
      label: "Clientes",
    },
    {
      to: "/sallers",
      icon: "fa-solid fa-id-card-clip",
      label: "Vendedores",
    },
    {
      to: "/sales",
      icon: "fa-solid fa-comments-dollar",
      label: "Vendas",
    },
  ]
  return (
    <div className='min-h-[100vh] w-2xs bg-sky-700 flex flex-col gap-7'>
      <h1 className='text-gray-50 font-medium text-3xl ml-5 mt-4'>SalesRank</h1>
      <div className='menu w-full h-fit'>
        {sidebarList.map((item) => (
          <Link
            to={item.to}
            className='text-gray-100 text-xl font-medium flex justify-between items-center py-3 pl-3 hover:bg-sky-600'>
            <div className='flex items-center'>
              <FontAwesomeIcon
                icon={item.icon as IconProp}
                size='sm'
                style={{ marginRight: "0.5rem" }}
              />
              <p>{item.label}</p>
            </div>
            <FontAwesomeIcon
              icon={"fa-solid fa-chevron-right" as IconProp}
              size='sm'
              style={{ marginRight: "0.5rem" }}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
