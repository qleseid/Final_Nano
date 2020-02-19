import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
let AlertComponent = class AlertComponent {
    constructor(alertService) {
        this.alertService = alertService;
        // subscribe to alert messages
        this.subscription = alertService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
    ngOnDestroy() {
        // unsubscribe on destroy to prevent memory leaks
        this.subscription.unsubscribe();
    }
};
AlertComponent = tslib_1.__decorate([
    Component({
        selector: 'alert',
        templateUrl: "./alert.component.html",
        styleUrls: ["./alert.component.scss"]
    })
], AlertComponent);
export { AlertComponent };
//# sourceMappingURL=alert.component.js.map