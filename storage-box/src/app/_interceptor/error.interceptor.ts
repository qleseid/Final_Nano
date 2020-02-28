import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError, Subject, EMPTY } from "rxjs";
import { tap, catchError, switchMap } from "rxjs/operators";
import { AuthenticationService } from "../_services";

@Injectable({
  providedIn: "root"
})
export class ErrorInterceptor implements HttpInterceptor
{
  refreshingAccessToken: boolean;
  accessTokenRefreshed: Subject<any> = new Subject();

  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any>
  {
    console.log("Error Interceptor");
    // Handle the request
    request = this.addAuthHeader(request);

    // call next() and handle the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) =>
      {
        console.log(error);

        if (error.status === 401)
        {
          // 401 error so we are unauthorized
          console.log("Response 401 Error Interceptor");
          // refresh the access token
          return this.refreshAccessToken()
            .pipe(
              switchMap(() =>
              {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError((err: any) =>
              {
                console.log(err);
                this.authService.logout();
                return EMPTY;
              })
            );
        }

        return throwError(error);
      })
    );
  }

  refreshAccessToken()
  {
    console.log("Error Interceptor: Refresh Access");
    if (this.refreshingAccessToken)
    {
      return new Observable(observer =>
        {
        this.accessTokenRefreshed.subscribe(() =>
        {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        });
      });
    }
    else
    {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(() =>
        {
          console.log("Access Token Refreshed!");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      );
    }
  }


  addAuthHeader(request: HttpRequest<any>)
  {
    // get the access token
    const token = this.authService.getAccessToken();
    console.log("Add Auth Error Interceptor" + token);

    if (token)
    {
      // append the access token to the request header
      return request.clone(
        {
        setHeaders:
        {
          "x-access-token": token
        }
      });
    }
    return request;
  }
}
