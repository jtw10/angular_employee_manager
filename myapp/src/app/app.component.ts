import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";

@Component({
  selector: "app-root",
  template: `
    <div>
      <nav class="navbar navbar-dark navbar-expand-sm bg-dark">
        <a class="navbar-brand" href="#" style="color: hotpink">Homework 3</a>

        <ul class="nav navbar-nav" *ngIf="showContentIfLoggedIn()">
          <li class="nav-item">
            <a routerLink="/profile" routerLinkActive="active" class="nav-link"
              >Profile</a
            >
          </li>
          <li class="nav-item" *ngIf="showManagerContent() || showHRContent()">
            <a
              routerLink="/employees"
              routerLinkActive="active"
              class="nav-link"
              >Employees</a
            >
          </li>
          <li class="nav-item" *ngIf="showHRContent()">
            <a routerLink="/payroll" routerLinkActive="active" class="nav-link"
              >Payroll</a
            >
          </li>
          <li class="nav-item">
            <a href="#" (click)="logout()" class="nav-link"
              >Logout ({{ username }})</a
            >
          </li>
        </ul>

        <ul class="nav navbar-nav" *ngIf="!showContentIfLoggedIn()">
          <li class="nav-item">
            <a routerLink="/register" routerLinkActive="active" class="nav-link"
              >Register</a
            >
          </li>
          <li class="nav-item">
            <a routerLink="/login" routerLinkActive="active" class="nav-link"
              >Login</a
            >
          </li>
        </ul>
      </nav>
      <br />

      <!-- Where router should display a view -->
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent {
  password: string = "";
  username: string = "";

  roles: Array<any> = [];
  timestamp: string = "";

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
    this.showUsernameIfLoggedIn();
    this.updateLinks();
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
      this.username = "";
      return false;
    }
  }

  showUsernameIfLoggedIn() {
    if (sessionStorage.getItem("auth_token") != null) {
      this.username = sessionStorage.getItem("username");
    }
  }

  updateLinks() {
    let TIME_KEY = "currentTime";
    let ROLE_KEY = "roles";

    sessionStorage.setItem(TIME_KEY, JSON.stringify(new Date()));

    // Create some fake data if roles are not cached in the browser.
    if (sessionStorage.getItem(ROLE_KEY) != null) {
      // Read roles from the cache and store in an array.
      this.roles = JSON.parse(sessionStorage.getItem(ROLE_KEY));
    }

    // Read the time from storage.
    // I am updating the time only to prove that updateLinks()
    // gets called every time you click on a different link in the
    // application.
    this.timestamp = sessionStorage.getItem(TIME_KEY);
  }

  // shows content for manager role users
  showManagerContent() {
    let ROLE_KEY = "roles";

    this.roles = JSON.parse(sessionStorage.getItem(ROLE_KEY));
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == "Manager") {
        return true;
      }
    }
    return false;
  }

  // shows content for HR role users
  showHRContent() {
    let ROLE_KEY = "roles";

    this.roles = JSON.parse(sessionStorage.getItem(ROLE_KEY));
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == "HR") {
        return true;
      }
    }
    return false;
  }

  getSecureData() {
    this._apiService.getData("User/SecureAreaJwt", this.secureDataCallback);
  }
  // Callback needs a pointer '_this' to current instance.
  secureDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.secureData = result.secureData;
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }

  getManagerData() {
    this._apiService.getData("User/ManagerAreaJwt", this.managerDataCallback);
  }
  // Callback needs a pointer '_this' to current instance.
  managerDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.reqInfo = result.reqInfo;
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }

  // PROFILE PAGE DATA
  getProfileData() {
    this._apiService.getData("User/ProfileAreaJwt", this.profileDataCallback);
  }
  profileDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.reqInfo = result.reqInfo;
    } else {
      alert(JSON.stringify(result.errorMessage));
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
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }

  // PAYROLL PAGE DATA
  getPayrollData() {
    this._apiService.getData("User/PayrollAreaJwt", this.payrollDataCallback);
  }
  payrollDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.reqInfo = result.reqInfo;
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }

  postSecureMessage() {
    let dataObject = {
      msgFromClient: "hi from client"
    };
    this._apiService.postData(
      "User/PostAreaJwt",
      dataObject,
      this.securePostCallback
    );
  }
  // Callback needs a pointer '_this' to current instance.
  securePostCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.msgFromServer = result["msgFromServer"];
    } else {
      alert(JSON.stringify(result.errorMessage));
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
          // Inspect the data to know how to parse it.
          console.log(JSON.stringify(data));

          if (data["token"] != null) {
            this.token = data["token"];
            sessionStorage.setItem("auth_token", data["token"]);
            this.message = "The user has been logged in.";
          }
        },
        // An error occurred. Data is not received.
        error => {
          alert(JSON.stringify(error));
        }
      );
  }

  //------------------------------------------------------------
  // Log user out. Destroy token.
  //------------------------------------------------------------
  logout() {
    sessionStorage.clear();
    this.showContentIfLoggedIn();

    // Clear data.
    this.secureData = "";
    this.managerData = "";
    this.reqInfo = {};
    this.msgFromServer = "";
  }

  // reload page
  refresh(): void {
    window.location.reload();
  }
}
