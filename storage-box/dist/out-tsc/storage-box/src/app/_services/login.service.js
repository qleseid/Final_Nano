import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { appConfig } from "../app.config";
// import { User } from "../_models/index";
let LoginService = class LoginService {
    constructor(http) {
        this.http = http;
    }
    login(username, password) {
        return this.http.post(`${appConfig.apiUrl}/login`, {
            username,
            password
        }, {
            observe: "response"
        });
    }
    signup(user) {
        return this.http.post(`${appConfig.apiUrl}/make`, user, {
            observe: "response"
        });
    }
};
LoginService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], LoginService);
export { LoginService };
//# sourceMappingURL=login.service.js.map