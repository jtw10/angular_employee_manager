import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";
@Component({
  selector: "app-root",
  templateUrl: "register.html"
})
export class RegisterComponent {
  firstName = "";
  lastName = "";
  username = "";
  streetAddress = "";
  email = "";
  phone = "";
  password = "";
  password_confirm = "";

  dataObject: Array<any> = [];

  token = "";
  message = "Not logged in.";
  secureData: string = "";
  managerData: string = "";
  reqInfo: {} = null;
  msgFromServer: string = "";
  _apiService: ApiService;
  public site = "http://localhost:1337/";

  // API SERVICE
  constructor(private http: HttpClient) {
    // Pass in http module and pointer to AppComponent.
    this._apiService = new ApiService(http, this);
    this.showContentIfLoggedIn();
  }

  //------------------------------------------------------------
  // Either shows content when logged in or clears contents.
  //------------------------------------------------------------
  showContentIfLoggedIn() {
    // Logged in if token exists in browser cache.
    if (sessionStorage.getItem("auth_token") != null) {
      this.token = sessionStorage.getItem("auth_token");
      this.message = "The user has been logged in.";
      return true;
    } else {
      this.message = "Not logged in.";
      this.token = "";
      return false;
    }
  }

  // REGISTER NEW USER
  registerNewUser() {
    var newUser = {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      streetAddress: this.streetAddress,
      email: this.email,
      phone: this.phone,
      password: this.password,
      passwordConfirm: this.password_confirm
    };
    this.dataObject.push(newUser);
    this._apiService.postCreateUserData(
      "User/RegisterUser",
      newUser,
      this.secureRegisterCallback
    );
  }
  secureRegisterCallback(result, _this) {
    if (result.errorMessage != "") {
      alert(JSON.stringify(result.errorMessage));
      window.location.reload();
    } else {
      window.location.href = "/login";
    }
  }
}
