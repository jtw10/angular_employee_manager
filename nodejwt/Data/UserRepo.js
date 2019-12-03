const User = require("../Models/User");

class UserRepo {
  UserRepo() {}

  async allUsers() {
    let users = await User.find().exec();
    return users;
  }

  async getUserByEmail(email) {
    var user = await User.findOne({ email: email });
    if (user) {
      let response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getUserByUsername(username) {
    var user = await User.findOne({ username: username });
    if (user) {
      let response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getRolesByUsername(username) {
    var user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
    if (user.roles) {
      return user.roles;
    } else {
      return [];
    }
  }

  async getUserDetailsByUsername(username) {
    var user = await User.findOne({ username: username });
    if (user) {
      let response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async update(editedObj) {
    // Set up response object which contains origianl product object and empty error message.
    let response = {
      obj: editedObj,
      errorMessage: ""
    };

    try {
      // Ensure the content submitted by the user validates.
      var error = await editedObj.validateSync();
      if (error) {
        response.errorMessage = error.message;
        return response;
      }

      // Load the actual corresponding object in the database.
      let userObject = await this.getUserDetailsByUsername(editedObj.username);

      // Check if user exists.
      if (userObject) {
        // User exists so update it.
        let updated = await User.updateOne(
          { username: editedObj.username }, // Match id.

          // Set new attribute values here.
          {
            $set: {
              username: editedObj.username,
              firstName: editedObj.firstName,
              lastName: editedObj.lastName,
              streetAddress: editedObj.streetAddress,
              phone: editedObj.phone,
              email: editedObj.email
            }
          }
        );

        // No errors during update.
        if (updated.nModified != 0) {
          response.obj = editedObj;
          return response;
        }
        // Errors occurred during the update.
        else {
          respons.errorMessage =
            "An error occurred during the update. Changes did not save.";
        }
        return response;
      }

      // Product not found.
      else {
        response.errorMessage = "Error finding this user's infromation.";
      }
      return response;
    } catch (err) {
      // An error occurred during the update.
      response.errorMessage = err.message;
      return response;
    }
  }

  async updateSalary(editedObj) {
    // Set up response object which contains origianl product object and empty error message.
    let response = {
      obj: editedObj,
      errorMessage: ""
    };

    try {
      // Ensure the content submitted by the user validates.
      var error = await editedObj.validateSync();
      if (error) {
        response.errorMessage = error.message;
        return response;
      }

      // Load the actual corresponding object in the database.
      let userObject = await this.getUserDetailsByUsername(editedObj.username);

      // Check if user exists.
      if (userObject) {
        // User exists so update it.
        let updated = await User.updateOne(
          { username: editedObj.username }, // Match id.

          // Set new attribute values here.
          {
            $set: {
              salary: editedObj.salary
            }
          }
        );

        // No errors during update.
        if (updated.nModified != 0) {
          response.obj = editedObj;
          return response;
        }
        // Errors occurred during the update.
        else {
          respons.errorMessage =
            "An error occurred during the update. Changes did not save.";
        }
        return response;
      }

      // Product not found.
      else {
        response.errorMessage = "Error finding this user's infromation.";
      }
      return response;
    } catch (err) {
      // An error occurred during the update.
      response.errorMessage = err.message;
      return response;
    }
  }
}

module.exports = UserRepo;
