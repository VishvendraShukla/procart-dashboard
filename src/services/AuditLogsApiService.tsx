import { NavigateFunction } from "react-router-dom";
import { PageResult, AuditLog } from "../types";
import BaseApiService from "./BaseApiService";

class AuditLogsApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async fetchRecentLogs() {
    return await this.get<PageResult<AuditLog>>(
      `/auditlogs?page=${0}&size=${5}`
    );
  }

  public async fetchLogs(page: number, size: number) {
    return await this.get<PageResult<AuditLog>>(
      `/auditlogs?page=${page}&size=${size}`
    );
  }
}
export default AuditLogsApiService;
