const client = require("../dbConnection");
const BaseService = require("../base.service");

class UserService extends BaseService {
  constructor() {
    console.log("user service conmstructor called");
    super(client);
  }

  async getUsers() {
    try {
      const users = await super.getRecords("users");
      return { status: "success", data: { users } };
    } catch (error) {
      return { status: "fail", error: error };
    }
  }

  async getUser(id) {
    try {
      const user = await super.getRecordById("users", id);
      return { status: "success", data: { user } };
    } catch (error) {
      return { status: "fail", error: error };
    }
  }

  async updateUser(userBody) {
    try {
      const updatedUser = await super.updateRecord("users", userBody);
      return { status: "success", data: updatedUser };
    } catch (err) {
      return { status: "fail", error: err };
    }
  }

  async deleteUser(id) {
    try {
      const deletedUser = await super.deleteRecord("users", id);

      console.log(deletedUser);
      if (deletedUser === 1)
        return { status: "success", msg: "User Deleted Successfuly" };
      else return { status: "fail", error: "User not found" };
    } catch (error) {
      console.log(error);
      return { status: "fail", error: error };
    }
  }
}
module.exports = UserService;
