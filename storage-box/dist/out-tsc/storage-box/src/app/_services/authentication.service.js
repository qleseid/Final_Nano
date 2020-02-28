import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { shareReplay, tap } from "rxjs/operators";
import { appConfig } from "../app.config";
let AuthenticationService = class AuthenticationService {
    constructor(loginService, router, http) {
        this.loginService = loginService;
        this.router = router;
        this.http = http;
    }
    login(email, password) {
        return this.loginService.login(email, password).pipe(shareReplay(), tap((res) => {
            // the auth tokens will be in the header of this response
            this.setSession(res.body._id, res.headers.get("x-access-token"), res.headers.get("x-refresh-token"));
            console.log("LOGGED IN!");
        }));
    }
    signup(user) {
        return this.loginService.signup(user).pipe(shareReplay(), tap((res) => {
            // Auth tokens will be in the header of this response
            this.setSession(res.body._id, res.headers.get("x-access-token"), res.headers.get("x-refresh-token"));
            console.log("Successfully signed up and now logged in!");
        }));
    }
    logout() {
        this.removeSession();
        this.router.navigate(["/login"]);
    }
    getAccessToken() {
        return localStorage.getItem("x-access-token");
    }
    getRefreshToken() {
        return localStorage.getItem("x-refresh-token");
    }
    getUserId() {
        return localStorage.getItem("user-id");
    }
    setAccessToken(accessToken) {
        localStorage.setItem("x-access-token", accessToken);
    }
    setSession(userId, accessToken, refreshToken) {
        localStorage.setItem("user-id", userId);
        localStorage.setItem("x-access-token", accessToken);
        localStorage.setItem("x-refresh-token", refreshToken);
    }
    removeSession() {
        localStorage.removeItem("user-id");
        localStorage.removeItem("x-access-token");
        localStorage.removeItem("x-refresh-token");
    }
    getNewAccessToken() {
        return this.http.get(`${appConfig.apiUrl}/users/me/access-token`, {
            headers: {
                "x-refresh-token": this.getRefreshToken(),
                _id: this.getUserId()
            },
            observe: "response"
        }).pipe(tap((res) => {
            this.setAccessToken(res.headers.get("x-access-token"));
        }));
    }
};
AuthenticationService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], AuthenticationService);
export { AuthenticationService };
//# sourceMappingURL=authentication.service.js.map