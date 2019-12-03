import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "login.html"
})
export class LoginComponent {
  password: string = "";
  username: string = "";

  roles: Array<any> = [];

  token = "";
  message = "Not logged in.";
  secureData: string = "";
  managerData: string = "";
  reqInfo: {} = null;
  msgFromServer: string = "";
  _apiService: ApiService;
  public site = "http://localhost:1337/";

  // Since we are using a provider above we can receive
  // an instance through an constructor.
  constructor(private http: HttpClient) {
    // Pass in http module and pointer to AppComponent.
    this._apiService = new ApiService(http, this);
    this.showContentIfLoggedIn();
  }

  showContentIfLoggedIn() {
    // Logged in if token exists in browser cache.
    if (sessionStorage.getItem("auth_token") != null) {
      this.token = sessionStorage.getItem("auth_token");
      this.message = "The user has been logged in.";
    } else {
      this.message = "Not logged in.";
      this.token = "";
    }
  }

  //------------------------------------------------------------
  // Log user in.
  //------------------------------------------------------------
  login() {
    let url = this.site + "auth";

    // This free online service receives post submissions.
    this.http
      .post(url, {
        username: this.username,
        password: this.password
      })
      .subscribe(
        // Data is received from the post request.
        data => {
          if (data["token"] != null) {
            this.token = data["token"];
            let userdata = data["user"];

            sessionStorage.setItem("auth_token", data["token"]);
            sessionStorage.setItem("username", this.username);
            sessionStorage.setItem("roles", JSON.stringify(userdata.roles));

            this.message = "The user has been logged in.";
            // Redirects login to profile page
            window.location.href = "/profile";
          }
        },
        // An error occurred. Data is not received.
        error => {
          alert("Unable to login. Please check your username and password");
        }
      );
  }
}
