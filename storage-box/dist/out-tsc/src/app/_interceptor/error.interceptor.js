import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { Observable, throwError, Subject, EMPTY } from "rxjs";
import { tap, catchError, switchMap } from "rxjs/operators";
let ErrorInterceptor = class ErrorInterceptor {
    constructor(authService) {
        this.authService = authService;
        this.accessTokenRefreshed = new Subject();
    }
    intercept(request, next) {
        // Handle the request
        request = this.addAuthHeader(request);
        // call next() and handle the response
        return next.handle(request).pipe(catchError((error) => {
            console.log(error);
            if (error.status === 401) {
                // 401 error so we are unauthorized
                // refresh the access token
                return this.refreshAccessToken()
                    .pipe(switchMap(() => {
                    request = this.addAuthHeader(request);
                    return next.handle(request);
                }), catchError((err) => {
                    console.log(err);
                    this.authService.logout();
                    return EMPTY;
                }));
            }
            return throwError(error);
        }));
    }
    refreshAccessToken() {
        if (this.refreshingAccessToken) {
            return new Observable(observer => {
                this.accessTokenRefreshed.subscribe(() => {
                    // this code will run when the access token has been refreshed
                    observer.next();
                    observer.complete();
                });
            });
        }
        else {
            this.refreshingAccessToken = true;
            // we want to call a method in the auth service to send a request to refresh the access token
            return this.authService.getNewAccessToken().pipe(tap(() => {
                console.log("Access Token Refreshed!");
                this.refreshingAccessToken = false;
                this.accessTokenRefreshed.next();
            }));
        }
    }
    addAuthHeader(request) {
        // get the access token
        const token = this.authService.getAccessToken();
        if (token) {
            // append the access token to the request header
            return request.clone({
                setHeaders: {
                    "x-access-token": token
                }
            });
        }
        return request;
    }
};
ErrorInterceptor = tslib_1.__decorate([
    Injectable({
        providedIn: "root"
    })
], ErrorInterceptor);
export { ErrorInterceptor };
//# sourceMappingURL=error.interceptor.js.map