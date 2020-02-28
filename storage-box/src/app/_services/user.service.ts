import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { appConfig } from "../app.config";

@Injectable(
  {
  providedIn: "root"
})
export class UserService
{
    constructor(private http: HttpClient) { }

    getAll()
    {
        return this.http.get<any[]>(appConfig.apiUrl + "/users/all");
    }

    getById(id: string)
    {
        return this.http.get(appConfig.apiUrl + "/users/" + id);
    }

    delete(id: string)
    {
        return this.http.delete(appConfig.apiUrl + "/users/" + id);
    }
}
