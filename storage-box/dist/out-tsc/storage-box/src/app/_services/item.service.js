import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { appConfig } from "../app.config";
let ItemService = class ItemService {
    constructor(http) {
        this.http = http;
    }
    getAll(owner) {
        return this.http.get(`${appConfig.apiUrl}/item/all` + owner);
    }
    getById(id) {
        return this.http.get(`${appConfig.apiUrl}/item` + id);
    }
    create(item, owner) {
        return this.http.post(`${appConfig.apiUrl}/item`, {
            item,
            owner
        }, {
            observe: "response"
        });
    }
    patch(item, id) {
        return this.http.patch(`${appConfig.apiUrl}/item`, {
            item,
            id
        }, {
            observe: "response"
        });
    }
    delete(id) {
        return this.http.delete(`${appConfig.apiUrl}/item` + id);
    }
};
ItemService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], ItemService);
export { ItemService };
//# sourceMappingURL=item.service.js.map