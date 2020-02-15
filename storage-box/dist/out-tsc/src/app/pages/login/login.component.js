import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
let LoginComponent = class LoginComponent {
    constructor(route, router, authenticationService, alertService) {
        this.route = route;
        this.router = router;
        this.authenticationService = authenticationService;
        this.alertService = alertService;
        this.model = {};
        this.loading = false;
    }
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || "/";
    }
    login() {
        this.loading = true;
        this.authenticationService
            .login(this.model.username, this.model.password)
            .subscribe(data => {
            this.router.navigate([this.returnUrl]);
        }, error => {
            this.alertService.error(error.error.message);
            this.loading = false;
        });
    }
};
LoginComponent = tslib_1.__decorate([
    Component({
        selector: "app-login",
        templateUrl: "./login.component.html",
        styleUrls: ["./login.component.scss"]
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map