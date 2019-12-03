import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";
@Component({
  selector: "app-root",
  templateUrl: "payroll.html"
})
export class PayrollComponent {
  username = "";
  firstName = "";
  lastName = "";
  streetAddress = "";
  email = "";
  phone = "";
  salary = "";

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
    this.getPayrollData();
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

  // PAYROLL PAGE DATA
  getPayrollData() {
    this._apiService.getData("User/PayrollAreaJwt", this.payrollDataCallback);
  }
  payrollDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.reqInfo = result.reqInfo;
      _this.users = result.users;
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }

  // UPDATE EMPLOYEE SALARY
  updateSalary(username, i, newSalary) {
    // validate number
    if (Number.isInteger(newSalary) != true) {
      alert("Please enter a valid number");
      window.location.reload();
    }
    // validate amount
    if (newSalary < 0) {
      alert("Please pay your staff properly");
      window.location.reload();
    }

    // send to api if successfully validated
    var dataObject = {
      username: username,
      firstName: this.users[i].firstName,
      lastName: this.users[i].lastName,
      streetAddress: this.users[i].streetAddress,
      email: this.users[i].email,
      phone: this.users[i].phone,
      salary: newSalary
    };
    this.dataObject.push(dataObject);
    this._apiService.postData(
      "User/UpdateSalaryJwt",
      dataObject,
      this.secureUpdateCallback
    );
  }
  secureUpdateCallback(result, _this) {
    if (result.errorMessage == "") {
      window.location.reload();
    } else {
      // alert(JSON.stringify(result.errorMessage));
    }
  }
}
