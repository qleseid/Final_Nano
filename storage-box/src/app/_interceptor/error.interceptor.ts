import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ErrorInterceptor implements HttpInterceptor
{

  constructor(){}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>>
  {
    // extract error message from http body if an error occurs
    return next.handle(request).pipe(tap(error => {
      console.log("Error Interceptor: " + error);
      if (error instanceof ErrorEvent)
      {
        return throwError(error.error);
      }
    }));
  }
}

export const ErrorInterceptorProvider =
{
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
