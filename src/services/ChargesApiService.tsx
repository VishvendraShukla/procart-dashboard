import { Charge, PageResult } from "../types";
import BaseApiService from "./BaseApiService";
import { NavigateFunction } from "react-router-dom";

class ChargesApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async fetchCharges(page: number, size: number) {
    return await this.get<PageResult<Charge>>(
      `/charge?page=${page}&size=${size}`
    );
  }
}

export default ChargesApiService;
