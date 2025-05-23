"use client";

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

export default function TableView({ inventory }: TableViewProps) {
  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="w-2/5 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              Product Title
            </th>
            <th
              scope="col"
              className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Brand
            </th>
            <th
              scope="col"
              className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {inventory.map((item) => (
            <tr key={item._id}>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                <div className="break-words">{item.productTitle}</div>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">{item.brand}</td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {item.quantity}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
