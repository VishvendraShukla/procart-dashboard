import axios, { AxiosResponse } from "axios";
import { showErrorToast } from "../components/Toast";
import { NavigateFunction } from "react-router-dom";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

class BaseApiService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private navigate: NavigateFunction;

  constructor(baseUrl: string, navigate: NavigateFunction) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
    this.navigate = navigate;
  }

  private getConfig() {
    const session = localStorage.getItem("session");
    if (session) {
      const auth = JSON.parse(session);
      this.headers["Authorization"] = `Bearer ${auth["token"]}`;
    }
    return {
      headers: this.headers,
    };
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.get(
        `${this.baseUrl}${endpoint}`,
        this.getConfig()
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async post<T, U>(endpoint: string, data: U): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.post(
        `${this.baseUrl}${endpoint}`,
        data,
        this.getConfig()
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async put<T, U>(endpoint: string, data: U): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.put(
        `${this.baseUrl}${endpoint}`,
        data,
        this.getConfig()
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.delete(
        `${this.baseUrl}${endpoint}`,
        this.getConfig()
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleResponse<T>(
    response: AxiosResponse<ApiResponse<T>>
  ): ApiResponse<T> {
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    console.log(error);
    if (error.status === 401) {
      console.error("Unauthorized access, please login");
      localStorage.removeItem("session");
      this.navigate("/login");
    }
    if (axios.isAxiosError(error)) {
      const response = error.response;
      if (response) {
        const errorMessage =
          response.data?.message || "An unexpected error occurred";
        showErrorToast(errorMessage);
        return response.data;
      }
    }
    showErrorToast("Something went wrong.");
    throw new Error("Something went wrong");
  }
}

export default BaseApiService;
