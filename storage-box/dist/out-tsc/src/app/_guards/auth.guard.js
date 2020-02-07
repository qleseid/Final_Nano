import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
let AuthGuard = class AuthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        if (localStorage.getItem("currentUser")) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
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