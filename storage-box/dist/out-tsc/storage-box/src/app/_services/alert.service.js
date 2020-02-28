import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { NavigationStart } from "@angular/router";
import { Subject } from "rxjs";
let AlertService = class AlertService {
    constructor(router) {
        this.router = router;
        this.subject = new Subject();
        this.keepAfterNavigationChange = false;
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                }
                else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }
    success(message, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: "success", text: message });
    }
    error(message, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: "error", text: message });
    }
    getMessage() {
        return this.subject.asObservable();
    }
};
AlertService = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], AlertService);
export { AlertService };
//# sourceMappingURL=alert.service.js.map