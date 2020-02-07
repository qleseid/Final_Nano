import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
let RegisterComponent = class RegisterComponent {
    constructor(router, userService, alertService) {
        this.router = router;
        this.userService = userService;
        this.alertService = alertService;
        this.model = {};
        this.loading = false;
    }
    register() {
        this.loading = true;
        this.userService.create(this.model).subscribe(data => {
            this.alertService.success("Registration successful", true);
            this.router.navigate(["/login"]);
        }, error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }
};
RegisterComponent = tslib_1.__decorate([
    Component({
        selector: "app-register",
        templateUrl: "./register.component.html",
        styleUrls: ["./register.component.scss"]
    })
], RegisterComponent);
export { RegisterComponent };
//# sourceMappingURL=register.component.js.map