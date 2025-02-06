import { NavigateFunction } from "react-router-dom";
import BaseApiService from "./BaseApiService";
import { Inventory, PageResult } from "../types";

class InventoryApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async fetchInventoryRecords(page: number, size: number) {
    return await this.get<PageResult<Inventory>>(
      `/inventories?page=${page}&size=${size}`
    );
  }
}
export default InventoryApiService;
