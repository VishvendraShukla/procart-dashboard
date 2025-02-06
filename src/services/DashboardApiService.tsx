import { NavigateFunction } from "react-router-dom";
import BaseApiService from "./BaseApiService";
import { DashboardCardData, DashboardUserData, PageResult } from "../types";

class DashboardApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async retrieveDashboardCardData() {
    return await this.get<Array<DashboardCardData>>("/dashboard");
  }
  public async retrieveDashboardUsersData(page: number, size: number) {
    return await this.get<PageResult<DashboardUserData>>(
      `/dashboard/users?page=${page}&size=${size}`
    );
  }
}

export default DashboardApiService;
