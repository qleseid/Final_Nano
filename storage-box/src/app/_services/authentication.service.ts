import { LoginService } from "./login.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { appConfig } from "../app.config";


@Injectable({
  providedIn: "root"
})
export class AuthenticationService
{
  constructor(private loginService: LoginService, private router: Router, private http: HttpClient) { }

  login(email: string, password: string)
  {
    return this.loginService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) =>
      {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get("x-access-token"), res.headers.get("x-refresh-token"));
        console.log("LOGGED IN!");
      })
    );
  }


  signup(user: any)
  {
    return this.loginService.signup(user).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) =>
      {
        // Auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get("x-access-token"), res.headers.get("x-refresh-token"));
        console.log("Successfully signed up and now logged in!");
      })
    );
  }



  logout()
  {
    this.removeSession();
    this.router.navigate(["/login"]);
  }

  getAccessToken()
  {
    return localStorage.getItem("x-access-token");
  }

  getRefreshToken()
  {
    return localStorage.getItem("x-refresh-token");
  }

  getUserId()
  {
    return localStorage.getItem("user-id");
  }

  setAccessToken(accessToken: string)
  {
    localStorage.setItem("x-access-token", accessToken);
  }

  private setSession(userId: string, accessToken: string, refreshToken: string)
  {
    localStorage.setItem("owner", userId);
    localStorage.setItem("user-id", userId);
    localStorage.setItem("x-access-token", accessToken);
    localStorage.setItem("x-refresh-token", refreshToken);
  }

  private removeSession()
  {
    localStorage.removeItem("owner");
    localStorage.removeItem("user-id");
    localStorage.removeItem("x-access-token");
    localStorage.removeItem("x-refresh-token");
  }

  getNewAccessToken()
  {
    return this.http.get(`${appConfig.apiUrl}/users/me/access-token`,
    {
      headers:
      {
        "x-refresh-token": this.getRefreshToken(),
        _id: this.getUserId()
      },
      observe: "response"
    }).pipe(
      tap((res: HttpResponse<any>) =>
      {
        this.setAccessToken(res.headers.get("x-access-token"));
      })
    );
  }
}
