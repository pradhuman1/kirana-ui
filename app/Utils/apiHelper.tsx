import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

interface ApiResponse<T = any> {
  status: number;
  data: T;
}

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ErrorResponse {
  message: string;
  status?: number;
}

interface ApiConfig extends AxiosRequestConfig {
  allowAbsoluteUrls?: boolean;
}

interface ApiHelperType {
  get: <T = any>(
    url: string,
    params?: Record<string, any>,
    config?: ApiConfig
  ) => Promise<T>;
  post: <T = any>(
    url: string,
    data?: Record<string, any>,
    config?: ApiConfig
  ) => Promise<ApiResponse<T>>;
  put: <T = any>(
    url: string,
    data?: Record<string, any>,
    config?: ApiConfig
  ) => Promise<T>;
  delete: <T = any>(url: string, config?: ApiConfig) => Promise<T>;
  patch: <T = any>(
    url: string,
    data?: Record<string, any>,
    config?: ApiConfig
  ) => Promise<T>;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  allowAbsoluteUrls: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (
  error: unknown,
  defaultMessage: string = "Something went wrong"
): ErrorResponse => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    // Check for response data message
    if (axiosError.response?.data?.message) {
      return {
        message: axiosError.response.data.message,
        status: axiosError.response.status,
      };
    }

    // Check for direct message
    if (axiosError.message) {
      return {
        message: axiosError.message,
        status: axiosError.response?.status,
      };
    }
  }

  // Handle custom error objects
  const customError = error as { message?: string };
  if (customError?.message) {
    return {
      message: customError.message,
    };
  }

  // Return default error message if no specific error message found
  return {
    message: defaultMessage,
  };
};

const ApiHelper: ApiHelperType = {
  get: async <T = any,>(url: string, params = {}, config = {}) => {
    try {
      const response = await apiClient.get<T>(url, { ...config, params });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch data");
    }
  },

  post: async <T = any,>(url: string, data = {}, config = {}) => {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw handleApiError(error, "Failed to submit data");
    }
  },

  put: async <T = any,>(url: string, data = {}, config = {}) => {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update data");
    }
  },

  delete: async <T = any,>(url: string, config = {}) => {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to delete data");
    }
  },

  patch: async <T = any,>(url: string, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update data");
    }
  },
};

export const logoutUser = async (): Promise<void> => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};

export default ApiHelper;
