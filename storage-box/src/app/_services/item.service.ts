import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { appConfig } from "../app.config";

@Injectable({
  providedIn: "root"
})
export class ItemService {

  constructor(private http: HttpClient) { }

    getAll(owner: string)
    {
        return this.http.get<any[]>(`${appConfig.apiUrl}/item/all` + owner);
    }

    getById(id: string)
    {
        return this.http.get(`${appConfig.apiUrl}/item` + id);
    }

    create(item: any, owner: string)
    {
        return this.http.post(`${appConfig.apiUrl}/item`,
        {
          item,
          owner
        },
        {
          observe: "response"
        });
    }

    patch(item: any, id: string)
    {
        return this.http.patch(`${appConfig.apiUrl}/item`,
        {
          item,
          id
        },
        {
          observe: "response"
        });
    }

    delete(id: string)
    {
        return this.http.delete(`${appConfig.apiUrl}/item` + id);
    }
}
