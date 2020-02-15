import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
let AuthGuard = class AuthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        if (localStorage.getItem("x-refresh-token")) {
            // logged in so return true
            console.log("AUTH GUARD GOOD: " + localStorage.length);
            return true;
        }
        // not logged in so redirect to login page with the return url
        console.log("AUTH GUARD FAIL: " + localStorage.length);
        console.log("AUTH GUARD FAIL: " + localStorage.getItem("x-refresh-token"));
        this.router.navigate(["/login"], { queryParams: { returnUrl: state.url }
        });
        return false;
    }
};
AuthGuard = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map