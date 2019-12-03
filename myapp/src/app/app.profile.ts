import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./ApiService";
@Component({
  selector: "app-root",
  templateUrl: "profile.html"
})
export class ProfileComponent {
  username = "";
  firstName = "";
  lastName = "";
  streetAddress = "";
  email = "";
  phone = "";

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
    this.getProfileData();
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

  // PROFILE PAGE DATA
  getProfileData() {
    this._apiService.getData("User/ProfileAreaJwt", this.profileDataCallback);
  }
  profileDataCallback(result, _this) {
    if (result.errorMessage == "") {
      _this.reqInfo = result.reqInfo;
      _this.secureData = result.secureData;

      // unpacking user details from the object
      _this.username = _this.secureData.obj.username;
      _this.firstName = _this.secureData.obj.firstName;
      _this.lastName = _this.secureData.obj.lastName;
      _this.streetAddress = _this.secureData.obj.streetAddress;
      _this.email = _this.secureData.obj.email;
      _this.phone = _this.secureData.obj.phone;
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }

  // UPDATE PROFILE DATA
  updateProfileData() {
    var dataObject = {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      streetAddress: this.streetAddress,
      email: this.email,
      phone: this.phone
    };
    this.dataObject.push(dataObject);
    this._apiService.postData(
      "User/UpdateProfileJwt",
      dataObject,
      this.secureUpdateCallback
    );
  }
  secureUpdateCallback(result, _this) {
    if (result.errorMessage == "") {
      window.location.reload();
    } else {
      alert(JSON.stringify(result.errorMessage));
    }
  }
}
