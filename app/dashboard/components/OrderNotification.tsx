import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import ApiHelper from "@/app/Utils/apiHelper";
import apiEndPoints from "@/app/Utils/apiEndPoints";
import { handleApiError } from "@/app/Utils/apiHelper";
import {
  acceptOrder,
  rejectOrder,
  Order,
  OrderItem,
} from "@/app/Utils/orderUtils";
import Table from "@/app/components/Table";
import Button from "@/app/components/Button";

export default function OrderNotification() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3"); // You'll need to add this sound file
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play sound when order is received
  useEffect(() => {
    if (order && !isPlaying) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing sound:", error);
        });
      }
    } else if (!order && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [order, isPlaying]);

  const fetchPendingOrder = useCallback(async () => {
    try {
      // Only fetch if there's no current order
      if (order) return;

      setIsLoading(true);
      setError(null);
      const orderResponse = await ApiHelper.get<{ ordersList: Order[] }>(
        apiEndPoints.getShopOrders
      );
      const ordersList = orderResponse?.ordersList || [];
      const pendingOrder =
        ordersList?.find((order: Order) => order.status === "pending") || null;

      if (pendingOrder) {
        setOrder(pendingOrder);
      }
    } catch (err) {
      const { message } = handleApiError(err, "Failed to fetch pending orders");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [order]);

  const startPolling = useCallback(() => {
    // Clear any existing timeout
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    // Set up new polling timeout
    pollingTimeoutRef.current = setTimeout(() => {
      fetchPendingOrder();
      startPolling(); // Schedule next poll
    }, 5000);
  }, [fetchPendingOrder]);

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      await acceptOrder(orderId);
      setIsPlaying(false);
      setOrder(null);
      // Navigate to orders page after accepting
      router.push("/dashboard/orders");
    } catch (err) {
      const { message } = handleApiError(err, "Failed to accept order");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      await rejectOrder(orderId);
      setIsPlaying(false);
      setOrder(null);
    } catch (err) {
      const { message } = handleApiError(err, "Failed to reject order");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPendingOrder();
    startPolling();

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [fetchPendingOrder, startPolling, stopPolling]);

  const columns = [
    {
      header: "Item",
      accessor: "productTitle" as keyof OrderItem,
      width: "w-7/10",
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
      width: "w-1/10",
      render: (item: OrderItem) => (
        <div className="text-gray-900 font-medium break-words">
          {item.quantity}x
        </div>
      ),
    },
  ];

  if (!order) return null;

  return (
    <Transition.Root show={!!order} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {}}
        // This ensures the modal blocks all other interactions
        static
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-90 transition-opacity opacity-75"
          aria-hidden="true"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-2 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-2 sm:px-4">
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center gap-2">
                      <ShoppingBagIcon className="h-6 w-6 text-green-600 animate-bounce" />
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        New Order Received
                      </Dialog.Title>
                    </div>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Order Items
                          </p>
                          <div className="mt-2">
                            <Table
                              columns={columns}
                              data={order?.items || []}
                              keyExtractor={(item) => item.productID}
                            />
                          </div>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-900">
                              ₹
                              {order?.items.reduce(
                                (sum, item) =>
                                  sum + parseInt(item.price) * item.quantity,
                                0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Delivery Fee</span>
                            <span className="text-gray-900">
                              ₹{order?.deliveryFee}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-medium mt-1">
                            <span className="text-gray-900">Total Amount</span>
                            <span className="text-gray-900">
                              ₹{order?.totalAmount}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Order Time
                          </p>
                          <p className="mt-1 text-sm text-gray-900">
                            {order?.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    variant="success"
                    size="md"
                    isLoading={isLoading}
                    onClick={() =>
                      order && handleAcceptOrder(order.shopOrderId)
                    }
                    className="sm:ml-3 sm:w-auto w-full"
                  >
                    Accept Order
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    isLoading={isLoading}
                    onClick={() =>
                      order && handleRejectOrder(order.shopOrderId)
                    }
                    className="mt-3 sm:mt-0 sm:w-auto w-full"
                  >
                    Reject Order
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
