const apiEndPoints = {
  signupNew: "/public/auth/signup-new",
  verifyOtpAndCreateBusiness: "/public/auth/verify-otp-and-create-business",
  updateBusiness: "/auth/update-business",
  searchProducts: "/auth/products/search",
  addProduct: "/inventory/add-inventory",
  getBusinessInventory: "/inventory/get-business-inventory",
  initiateLogin: "/public/auth/initiate-login",
  verifyOtpAndLogin: "/public/auth/verify-otp-and-login",
  getShopOrders: "/shop-order/get-my-orders",
  getSelfCustomerOrders: "/order/get-my-orders",
  updateOrderStatus: "/shop-order/update-order-status",

  // Order endpoints
  acceptOrder: (orderId: string) => `/api/orders/${orderId}/accept`,
  rejectOrder: (orderId: string) => `/api/orders/${orderId}/reject`,
};

export default apiEndPoints;
