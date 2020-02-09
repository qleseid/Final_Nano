import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { appConfig } from "../app.config";
// import { User } from "../_models/index";

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

    create(user: any)
    {
        return this.http.post(appConfig.apiUrl + "/users", user);
    }

    update(user: any)
    {
        return this.http.patch(appConfig.apiUrl + "/users/" + user._id, user);
    }

    delete(id: string)
    {
        return this.http.delete(appConfig.apiUrl + "/users/" + id);
    }
}
