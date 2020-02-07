import { Injectable } from "@angular/core";
// tslint:disable-next-line: import-spacing
import
{
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

@Injectable(
  {
  providedIn: "root"
})
export class AuthGuard implements CanActivate
{
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  {
    if (localStorage.getItem("currentUser"))
    {
      // logged in so return true
      console.log("AUTH GUARD GOOD: " + localStorage.length);
      return true;
    }

    // not logged in so redirect to login page with the return url
    console.log("AUTH GUARD FAIL: " + localStorage.length);
    this.router.navigate(["/login"],
    { queryParams:
      { returnUrl: state.url }
    });
    return false;
  }
}
