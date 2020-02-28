import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./_guards/auth.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeViewComponent } from "./pages/home-view/home-view.component";


const routes: Routes = [
  {path: "", component: HomeViewComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},

  // Everything else redirect to home
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
