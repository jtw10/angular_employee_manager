import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { EmployeesComponent } from "./app.employees";
import { LoginComponent } from "./app.login";
import { RegisterComponent } from "./app.register";
import { PayrollComponent } from "./app.payroll";
import { ProfileComponent } from "./app.profile";
import { PageDefault } from "./app.pagedefault";

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    LoginComponent,
    RegisterComponent,
    PayrollComponent,
    ProfileComponent,
    PageDefault
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, routing],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
