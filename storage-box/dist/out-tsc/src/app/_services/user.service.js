import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { appConfig } from "../app.config";
let UserService = class UserService {
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(appConfig.apiUrl + "/users/all");
    }
    getById(id) {
        return this.http.get(appConfig.apiUrl + "/users/" + id);
    }
    delete(id) {
        return this.http.delete(appConfig.apiUrl + "/users/" + id);
    }
};
UserService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map