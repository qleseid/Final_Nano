import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { appConfig } from "../app.config";
// import { User } from "../_models/index";
let UserService = class UserService {
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(appConfig.apiUrl + "/users/all");
    }
    getById(_id) {
        return this.http.get(appConfig.apiUrl + "/users/" + _id);
    }
    create(user) {
        return this.http.post(appConfig.apiUrl + "/users", user);
    }
    update(user) {
        return this.http.patch(appConfig.apiUrl + "/users/" + user._id, user);
    }
    delete(_id) {
        return this.http.delete(appConfig.apiUrl + "/users/" + _id);
    }
};
UserService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map