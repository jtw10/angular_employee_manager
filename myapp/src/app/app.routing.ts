import { AppComponent } from "./app.component";
import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";
import { RegisterComponent } from "./app.register";
import { ProfileComponent } from "./app.profile";
import { PayrollComponent } from "./app.payroll";
import { EmployeesComponent } from "./app.employees";
import { LoginComponent } from "./app.login";
import { PageDefault } from "./app.pagedefault";
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent },
  { path: "payroll", component: PayrollComponent },
  { path: "employees", component: EmployeesComponent },
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", component: PageDefault }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
