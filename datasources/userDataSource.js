import User from "../models/users.js";

export class UserDataSource {
  async getUsers() {
    return User.find();
  }

  async getUserById(id) {
    return User.findById(id);
  }

  async getUserByEmail(email) {
    return User.findOne({ email });
  }

  async createUser(userInput) {
    return User.create(userInput);
  }
}
