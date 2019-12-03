import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";
@Component({
  selector: "app-root",
  templateUrl: "employees.html"
})
export class EmployeesComponent {
  username = "";
  firstName = "";
  lastName = "";
  streetAddress = "";
  email = "";
  phone = "";

  users: Array<any> = [];
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
    this.getEmployeesData();
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

  // EMPLOYEES PAGE DATA
  getEmployeesData() {
    this._apiService.getData(
      "User/EmployeesAreaJwt",
      this.employeesDataCallback
    );
  }
  employeesDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.reqInfo = result.reqInfo;
      _this.users = result.users;
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }
}
