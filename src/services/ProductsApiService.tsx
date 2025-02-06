import { NavigateFunction } from "react-router-dom";
import BaseApiService from "./BaseApiService";
import { PageResult, Product } from "../types";

class ProductsApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async fetchProducts(page: number, size: number) {
    return await this.get<PageResult<Product>>(
      `/products?page=${page}&size=${size}`
    );
  }
}

export default ProductsApiService;
