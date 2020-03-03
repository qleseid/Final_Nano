import { UserService } from "./_services/user.service";
import { AuthGuard } from "./_guards/auth.guard";
import { ErrorInterceptor } from "./_interceptor/error.interceptor";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeViewComponent } from "./pages/home-view/home-view.component";
import { LoginComponent } from "./pages/login/index";
import { RegisterComponent } from "./pages/register/register.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationService, AlertService } from "./_services";
import { AlertComponent } from "./_interceptor/alert.component";
import { LoginFormComponent } from "./pages/login/login-form/login-form/login-form.component";
import { SelectedComponent } from "./pages/home-view/selected/selected.component";
import { NewItemComponent } from "./pages/home-view/new-item/new-item.component";
import { FileSelectDirective } from "ng2-file-upload";

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    LoginFormComponent,
    SelectedComponent,
    NewItemComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
