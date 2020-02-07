import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { throwError } from "rxjs";
import { tap } from "rxjs/operators";
let ErrorInterceptor = class ErrorInterceptor {
    constructor() { }
    intercept(request, next) {
        // extract error message from http body if an error occurs
        return next.handle(request).pipe(tap(error => {
            console.log("Error Interceptor: " + error);
            if (error instanceof ErrorEvent) {
                return throwError(error.error);
            }
        }));
    }
};
ErrorInterceptor = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], ErrorInterceptor);
export { ErrorInterceptor };
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
//# sourceMappingURL=error.interceptor.js.map