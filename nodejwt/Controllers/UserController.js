const User = require("../Models/User");
var passport = require("passport");
const RequestService = require("../Services/RequestService");
const UserRepo = require("../Data/UserRepo");
const _userRepo = new UserRepo();

// Displays registration form.
exports.Register = async function(req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("User/Register", { errorMessage: "", user: {}, reqInfo: reqInfo });
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function(req, res) {
  let reqInfo = RequestService.reqHelper(req);
  var newUser = req.body.obj;
  var password = req.body.obj.password;
  var passwordConfirm = req.body.obj.passwordConfirm;

  console.log(newUser);

  // Check if username is taken
  let checkUsername = await _userRepo.getUserByUsername(newUser.username);
  if (checkUsername) {
    console.log("Username Taken");
    let reqInfo = RequestService.reqHelper(req);
    return res.json({
      errorMessage: "Username is taken.",
      reqInfo: reqInfo
    });
  }

  if (password == passwordConfirm) {
    // Creates user object with mongoose model.
    // Note that the password is not present.
    var newUser = new User({
      firstName: req.body.obj.firstName,
      lastName: req.body.obj.lastName,
      email: req.body.obj.email,
      username: req.body.obj.username,
      streetAddress: req.body.obj.streetAddress,
      phone: req.body.obj.phone
    });
    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    User.register(new User(newUser), req.body.obj.password, function(
      err,
      account
    ) {
      // Show registration form with errors if fail.
      if (err) {
        let reqInfo = RequestService.reqHelper(req);
        return res.json({
          errorMessage: err,
          reqInfo: reqInfo
        });
      }
      //   // User registered so authenticate and redirect to secure
      //   // area.
      //   passport.authenticate("local")(req, res, function() {
      //     res.redirect("/User/SecureArea");
      //   });

      let reqInfo = RequestService.reqHelper(req);
      return res.json({
        errorMessage: "",
        reqInfo: reqInfo
      });
    });
  } else {
    let reqInfo = RequestService.reqHelper(req);
    return res.json({
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo
    });
  }
};

// Shows login form.
exports.Login = async function(req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;

  res.render("User/Login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo
  });
};

exports.LoginUser = async function(req, res, next) {
  let roles = await _userRepo.getRolesByUsername(req.body.username);
  sessionData = req.session;
  sessionData.roles = roles;

  passport.authenticate("local", {
    successRedirect: "/User/SecureArea",
    failureRedirect: "/User/Login?errorMessage=Invalid login."
  })(req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
  req.logout();
  let reqInfo = RequestService.reqHelper(req);

  res.render("User/Login", {
    user: {},
    isLoggedIn: false,
    errorMessage: "",
    reqInfo: reqInfo
  });
};

// // This displays a view called 'securearea' but only
// // if user is authenticated.
// exports.SecureArea  = async function(req, res) {
//     let reqInfo = RequestService.reqHelper(req);

//     if(reqInfo.authenticated) {
//         res.render('User/SecureArea', {errorMessage:"", reqInfo:reqInfo})
//     }
//     else {
//         res.redirect('/User/Login?errorMessage=You ' +
//                      'must be logged in to view this page.')
//     }
// }

// This displays a view called 'securearea' but only
// if user is authenticated.
exports.ManagerArea = async function(req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);

  if (reqInfo.rolePermitted) {
    res.render("User/ManagerArea", { errorMessage: "", reqInfo: reqInfo });
  } else {
    res.redirect(
      "/User/Login?errorMessage=You " +
        "must be logged in with proper permissions to view this page."
    );
  }
};

// This function returns data to authenticated users only.
exports.SecureAreaJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req);

  if (reqInfo.authenticated) {
    res.json({
      errorMessage: "",
      reqInfo: reqInfo,
      secureData:
        "Congratulations! You are authenticated and you have " +
        "successfully accessed this message."
    });
  } else {
    res.json({
      errorMessage:
        "/User/Login?errorMessage=You " + "must be logged in to view this page."
    });
  }
};

// This function returns data to logged in managers only.
exports.ManagerAreaJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req, ["Admin", "Manager"]);

  if (reqInfo.rolePermitted) {
    res.json({ errorMessage: "", reqInfo: reqInfo });
  } else {
    res.json({
      errorMessage:
        "You must be logged in with proper " + "permissions to view this page."
    });
  }
};

// This function returns profile page data to all logged in members.
exports.ProfileAreaJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req);

  if (reqInfo.authenticated) {
    res.json({
      errorMessage: "",
      reqInfo: reqInfo,
      secureData: reqInfo.userDetails
    });
  } else {
    res.json({
      errorMessage:
        "/User/Login?errorMessage=You " + "must be logged in to view this page."
    });
  }
};

// This function returns Employee data to managers and HR only.
exports.EmployeesAreaJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req, ["HR", "Manager"]);
  let users = await _userRepo.allUsers();
  if (reqInfo.rolePermitted) {
    res.json({ errorMessage: "", reqInfo: reqInfo, users: users });
  } else {
    res.json({
      errorMessage:
        "You must be logged in with proper " + "permissions to view this page."
    });
  }
};

// This function returns Employee data to managers and HR only.
exports.PayrollAreaJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req, ["HR"]);
  let users = await _userRepo.allUsers();

  if (reqInfo.rolePermitted) {
    res.json({ errorMessage: "", reqInfo: reqInfo, users: users });
  } else {
    res.json({
      errorMessage:
        "You must be logged in with proper " + "permissions to view this page."
    });
  }
};

// This function receives a post from logged in users only.
exports.PostAreaJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req, []);
  console.log(req.body.msgFromClient);
  res.json({
    errorMessage: "",
    reqInfo: reqInfo,
    msgFromServer: "Hi from server"
  });
};

// Updates user's profile details
exports.UpdateProfileJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req, []);
  let details = req.body.obj;

  // Logging updated data
  console.log("Data updated for: " + req.body.obj.username);
  console.log(details);
  // FIXME: Update Details

  // Parcel up data in an object
  let tempUserObj = new User({
    username: details.username,
    firstName: details.firstName,
    lastName: details.lastName,
    streetAddress: details.streetAddress,
    email: details.email,
    phone: details.phone
  });

  // Call update function in repo
  let responseObject = await _userRepo.update(tempUserObj);

  // Update was successful. Show detail page with updated object.
  if (responseObject.errorMessage == "") {
    res.json({
      reqInfo: reqInfo,
      secureData: responseObject.obj,
      errorMessage: ""
    });
  }

  // Update not successful. Show edit form again.
  else {
    res.json({
      errorMessage: responseObject.errorMessage,
      reqInfo: reqInfo,
      secureData: reqInfo.userDetails
    });
  }
};

// Updates user's salary
exports.UpdateSalaryJwt = async function(req, res) {
  let reqInfo = await RequestService.jwtReqHelper(req, []);
  let details = req.body.obj;

  // Logging updated data
  console.log("Data updated for: " + req.body.obj.username);
  console.log(details);
  // FIXME: Update Details

  if (details.salary < 0) {
    res.json({
      reqInfo: reqInfo,
      secureData: reqInfo.userDetails,
      errorMessage: "Please pay your employees properly"
    });
  }
  if (Number.isInteger(details.salary) != true) {
    res.json({
      reqInfo: reqInfo,
      secureData: reqInfo.userDetails,
      errorMessage: "Please enter a valid integer"
    });
  }
  if (Number.isInteger(details.salary) == true) {
    // Parcel up data in an object
    let tempUserObj = new User({
      username: details.username,
      firstName: details.firstName,
      lastName: details.lastName,
      streetAddress: details.streetAddress,
      email: details.email,
      phone: details.phone,
      salary: details.salary
    });

    // Call update function in repo
    let responseObject = await _userRepo.updateSalary(tempUserObj);

    // Update was successful. Show detail page with updated object.
    if (responseObject.errorMessage == "") {
      console.log("Successfully updated salary");
      res.json({
        reqInfo: reqInfo,
        secureData: responseObject.obj,
        errorMessage: ""
      });
    }

    // Update not successful. Show edit form again.
    else {
      console.log("Failed to update salary");
      res.json({
        errorMessage: responseObject.errorMessage,
        reqInfo: reqInfo,
        secureData: reqInfo.userDetails
      });
    }
  }
};
