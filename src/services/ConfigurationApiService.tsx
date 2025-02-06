import { Configuration, PageResult } from "../types";
import BaseApiService from "./BaseApiService";
import { NavigateFunction } from "react-router-dom";

class ConfigurationApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async fetchConfiguration(page: number, size: number) {
    return await this.get<PageResult<Configuration>>(
      `/configuration?page=${page}&size=${size}`
    );
  }

  public async fetchConfigurationByKey(key: string) {
    return await this.get<PageResult<Configuration>>(
      `/configuration?key=${key}`
    );
  }

  public async createConfiguration(config: Configuration) {
    return await this.post<any, Configuration>(`/configuration`, config);
  }

  public async updateConfiguration(config: Configuration) {
    return await this.put<any, Configuration>(`/configuration`, config);
  }
}

export default ConfigurationApiService;
