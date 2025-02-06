import { NavigateFunction } from "react-router-dom";
import { Currency, PageResult } from "../types";
import BaseApiService from "./BaseApiService";

class CurrenciesApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async fetchCurrencies(page: number, size: number) {
    return await this.get<PageResult<Currency>>(
      `/currencies?page=${page}&size=${size}`
    );
  }
}

export default CurrenciesApiService;
