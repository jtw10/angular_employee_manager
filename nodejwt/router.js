var HomeController = require("./Controllers/HomeController");
var UserController = require("./Controllers/UserController");
const authMiddleware = require("./authHelper");
const cors = require("cors");

// Routes
module.exports = function(app) {
  // Main Routes
  app.get("/", HomeController.Index);

  app.get("/User/Register", UserController.Register);
  app.post("/User/RegisterUser", UserController.RegisterUser);
  app.get("/User/Login", UserController.Login);
  app.post("/User/LoginUser", UserController.LoginUser);
  app.get("/User/Logout", UserController.Logout);
  //   app.get("/User/SecureArea", UserController.SecureArea);
  app.get("/User/ManagerArea", UserController.ManagerArea);
  // Sign in
  app.post(
    "/auth",
    cors(),
    // middleware that handles the sign in process
    authMiddleware.signIn,
    authMiddleware.signJWTForUser
  );

  // Accessible to authenticated user. CORS must be enabled
  // for client App to access it.
  app.get(
    "/User/SecureAreaJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.SecureAreaJwt
  );

  // Accessible to manager or admin. CORS must be enabled for
  // client App to access it.
  app.get(
    "/User/ManagerAreaJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.ManagerAreaJwt
  );

  // Receives posted data from authenticated users.
  app.post(
    "/User/PostAreaJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.PostAreaJwt
  );

  // Receives posted updated profile data from authenticated users
  app.post(
    "/User/UpdateProfileJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.UpdateProfileJwt
  );

  // Update user salary
  app.post(
    "/User/UpdateSalaryJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.UpdateSalaryJwt
  );

  // Payroll accessible to HR only. CORS must be enabled for
  // client App to access it.
  app.get(
    "/User/PayrollAreaJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.PayrollAreaJwt
  );

  // Employees accessible to HR and Managers only. CORS must be enabled for
  // client App to access it.
  app.get(
    "/User/EmployeesAreaJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.EmployeesAreaJwt
  );

  // Profile  accessible all authenticated users. CORS must be enabled for
  // client App to access it.
  app.get(
    "/User/ProfileAreaJwt",
    cors(),
    authMiddleware.requireJWT,
    UserController.ProfileAreaJwt
  );
};
