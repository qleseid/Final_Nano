import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AlertService, AuthenticationService } from "../../_services/index";

@Component(
  {
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})

export class RegisterComponent
{
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: AuthenticationService,
    private alertService: AlertService
  ) {}

  register()
  {
    this.loading = true;
    this.userService.signup(this.model).subscribe( data =>
      {
        this.alertService.success("Registration successful", true);
        this.router.navigate(["/login"]);
      },
      error =>
      {
        this.alertService.error(error.error.message);
        this.loading = false;
      }
    );
  }
}
