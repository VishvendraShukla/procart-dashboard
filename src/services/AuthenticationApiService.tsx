import BaseApiService from "./BaseApiService";
import { NavigateFunction } from "react-router-dom";

interface AuthenticationRequest {
  username: string;
  password: string;
}

class AuthenticationApiService extends BaseApiService {
  constructor(navigate: NavigateFunction) {
    super("http://localhost:8080/api/v1", navigate);
  }

  public async login(username: string, password: string) {
    const authenticate: AuthenticationRequest = {
      username: username,
      password: password,
    };
    return await this.post<any, AuthenticationRequest>(
      "/authenticate",
      authenticate
    );
  }
}

export default AuthenticationApiService;
