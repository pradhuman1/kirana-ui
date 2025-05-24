"use client";

import Table from "@/app/components/Table";

interface InventoryItem {
  _id: string;
  productTitle: string;
  brand: string;
  quantity: number;
  price: string;
}

interface TableViewProps {
  inventory: InventoryItem[];
}

export default function ProductTableView({ inventory }: TableViewProps) {
  const columns = [
    {
      header: "Product Title",
      accessor: "productTitle" as const,
      width: "w-2/5",
    },
    {
      header: "Brand",
      accessor: "brand" as const,
      width: "w-1/5",
    },
    {
      header: "Quantity",
      accessor: "quantity" as const,
      width: "w-1/5",
    },
    {
      header: "Price",
      accessor: "price" as const,
      width: "w-1/5",
      render: (item: InventoryItem) => `₹${item.price}`,
    },
  ];

  return (
    <Table
      columns={columns}
      data={inventory}
      keyExtractor={(item) => item._id}
    />
  );
}
