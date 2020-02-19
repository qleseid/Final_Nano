import * as tslib_1 from "tslib";
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./_guards/auth.guard";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeViewComponent } from "./pages/home-view/home-view.component";
const routes = [
    { path: "", component: HomeViewComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    // Everything else redirect to home
    { path: "**", redirectTo: "" }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map