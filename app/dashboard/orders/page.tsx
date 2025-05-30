"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchOrders, Order, OrderItem } from "@/app/Utils/orderUtils";
import Table from "@/app/components/Table";
import { format } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const acceptedOrders = await fetchOrders("accepted");
        setOrders(acceptedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Sort orders by createdAt in descending order (newest first)
  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders]);

  const itemColumns = [
    {
      header: "Item",
      accessor: "productTitle" as keyof OrderItem,
      width: "w-4/10",
      render: (item: OrderItem) => (
        <div className="flex items-start gap-2">
          {item.imagesUrl && item.imagesUrl.length > 0 && (
            <div className="h-10 w-10 flex-shrink-0 mt-1">
              <img
                src={item.imagesUrl[0]}
                alt={item.productTitle}
                className="h-full w-full object-contain rounded"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 break-words">
              {item.productTitle}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 break-words">
              {item.brand} • {item.weight}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      accessor: "price" as keyof OrderItem,
      width: "w-2/10",
      render: (item: OrderItem) => (
        <div className="text-gray-900 font-medium break-words">
          ₹{parseInt(item.price) * item.quantity}
        </div>
      ),
    },
    {
      header: "Quantity",
      accessor: "quantity" as keyof OrderItem,
      width: "w-2/10",
      render: (item: OrderItem) => (
        <div className="text-gray-900 font-medium break-words">
          {item.quantity}x
        </div>
      ),
    },
    {
      header: "Unit Price",
      accessor: "price" as keyof OrderItem,
      width: "w-2/10",
      render: (item: OrderItem) => (
        <div className="text-gray-900 font-medium break-words">
          ₹{item.price}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Accepted Orders
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all accepted orders for your shop, sorted by most recent
            first.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No accepted orders found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedOrders.map((order) => (
            <div
              key={order.shopOrderId}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Order #{order.shopOrderId}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on{" "}
                      {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm text-gray-500">
                      Delivery Fee:{" "}
                      <span className="font-medium text-gray-900">
                        ₹{order.deliveryFee}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Total Amount: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <Table
                  columns={itemColumns}
                  data={order.items}
                  keyExtractor={(item) => item.productID}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
