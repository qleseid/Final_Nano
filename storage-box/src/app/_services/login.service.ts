import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { appConfig } from "../app.config";
// import { User } from "../_models/index";

@Injectable(
  {
  providedIn: "root"
})
export class LoginService
{
    constructor(private http: HttpClient) { }

    login(username: string, password: string)
    {
        return this.http.post(`${appConfig.apiUrl}/login`,
        {
          username,
          password
        },
        {
          observe: "response"
        });
    }

    signup(user: any) {
      return this.http.post(`${appConfig.apiUrl}/make`, user,
        {
          observe: "response"
        });
    }
}
