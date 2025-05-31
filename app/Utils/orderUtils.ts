import ApiHelper from "./apiHelper";
import apiEndPoints from "./apiEndPoints";
import { handleApiError } from "./apiHelper";

export interface OrderItem {
  productID: string;
  productTitle: string;
  weight: string;
  price: string;
  brand: string;
  imagesUrl: string[];
  quantity: number;
}

export interface Order {
  shopOrderId: string;
  status: string;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export const acceptOrder = async (orderId: string): Promise<void> => {
  try {
    await ApiHelper.put(apiEndPoints.updateOrderStatus, {
      shopOrderId: orderId,
      status: "accepted",
    });
  } catch (err) {
    const { message } = handleApiError(err, "Failed to accept order");
    throw new Error(message);
  }
};

export const rejectOrder = async (orderId: string): Promise<void> => {
  try {
    await ApiHelper.put(apiEndPoints.updateOrderStatus, {
      shopOrderId: orderId,
      status: "rejected",
    });
  } catch (err) {
    const { message } = handleApiError(err, "Failed to reject order");
    throw new Error(message);
  }
};

export const fetchOrders = async (status?: string): Promise<Order[]> => {
  try {
    const response = await ApiHelper.get<{ ordersList: Order[] }>(
      apiEndPoints.getShopOrders
    );
    const orders = response?.ordersList || [];
    if (status) {
      return orders.filter((order) => order.status === status);
    }
    return orders;
  } catch (err) {
    const { message } = handleApiError(err, "Failed to fetch orders");
    throw new Error(message);
  }
};
