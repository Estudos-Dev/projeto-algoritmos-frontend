import type { Product } from "@/types/Product"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number
      return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    },
  },
]
