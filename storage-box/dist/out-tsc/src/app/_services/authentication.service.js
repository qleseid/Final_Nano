import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { appConfig } from "../app.config";
let AuthenticationService = class AuthenticationService {
    constructor(http) {
        this.http = http;
    }
    login(username, password) {
        return this.http
            .post(appConfig.apiUrl + "/users/login", {
            username,
            password
        })
            .pipe(map(user => {
            // login successful if there's a jwt token in the response
            console.log("AUTH token: " + user.accessToken);
            console.log("AUTH: " + user);
            if (user && user.accessToken) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem("currentUser", JSON.stringify(user));
            }
            return user;
        }));
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem("currentUser");
    }
};
AuthenticationService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], AuthenticationService);
export { AuthenticationService };
//# sourceMappingURL=authentication.service.js.map