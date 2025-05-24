"use client";

interface InventoryItem {
  _id: string;
  productTitle: string;
  brand: string;
  quantity: number;
  price: string;
  imagesUrl: string[];
}

interface GridViewProps {
  inventory: InventoryItem[];
}

export default function ProductGridView({ inventory }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {inventory.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={item.imagesUrl?.[0] || "/placeholder-product.png"}
              alt={item.productTitle}
              className="w-full h-48 object-contain bg-gray-50"
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {item.productTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                ₹{item.price}
              </span>
              <span className="text-sm text-gray-500">
                Qty: {item.quantity}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
