import { UserService } from "./_services/user.service";
import { AuthGuard } from "./_guards/auth.guard";
import { ErrorInterceptor } from "./_interceptor/error.interceptor";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeViewComponent } from "./pages/home-view/home-view.component";
import { LoginComponent } from "./pages/login/index";
import { RegisterComponent } from "./pages/register/register.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationService, AlertService } from "./_services";
import { AlertComponent } from './_interceptor/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ErrorInterceptor,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
