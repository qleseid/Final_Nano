import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from "@angular/core";
let LoginFormComponent = class LoginFormComponent {
    constructor() {
        this.model = {};
        this.sendForm = new EventEmitter();
    }
    ngOnInit() {
    }
    login() {
        this.sendForm.emit(this.model);
    }
};
tslib_1.__decorate([
    Input()
], LoginFormComponent.prototype, "loading", void 0);
tslib_1.__decorate([
    Output()
], LoginFormComponent.prototype, "sendForm", void 0);
LoginFormComponent = tslib_1.__decorate([
    Component({
        selector: "app-login-form",
        templateUrl: "./login-form.component.html",
        styleUrls: ["./login-form.component.scss"]
    })
], LoginFormComponent);
export { LoginFormComponent };
//# sourceMappingURL=login-form.component.js.map