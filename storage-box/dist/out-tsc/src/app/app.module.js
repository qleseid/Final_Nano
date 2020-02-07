import * as tslib_1 from "tslib";
import { ErrorInterceptorProvider } from "./_interceptor/error.interceptor";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeViewComponent } from "./pages/home-view/home-view.component";
import { LoginComponent } from "./pages/login/login/login.component";
import { RegisterComponent } from "./pages/register/register/register.component";
import { HttpClientModule } from "@angular/common/http";
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    NgModule({
        declarations: [
            AppComponent,
            HomeViewComponent,
            LoginComponent,
            RegisterComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            HttpClientModule
        ],
        providers: [
            ErrorInterceptorProvider
        ],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map