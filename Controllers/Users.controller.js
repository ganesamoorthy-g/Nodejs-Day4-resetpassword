const UserRouter = require("express").Router();
const UserModel = require("../Models/Users.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET ALL THE USERS
UserRouter.get("/", (req, res, next) => {
  UserModel.find()
    .then((cursor) => {
      if (cursor && cursor.length > 0) {
        return res.status(200).json({
          data: cursor,
          success: true,
          message: "Users fetched successfully!!!",
        });
      } else {
        return res.status(200).json({
          data: [],
          success: true,
          message: "No Data Found!!!",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        success: false,
        message: "Error Fetching Users Data!!!",
        error: err,
      });
    });
});

UserRouter.post("/create", (req, res, next) => {
  const data = req.body;
  let hashedPassword;
  bcrypt.hash(req.body.password, saltRounds)
    .then(function(hash) {
      hashedPassword = hash;
      // console.log(hashedPassword);

      const User = new UserModel({
        ...data,
        password: hashedPassword
      });

      User.save()
        .then((result) => {
          if (result && result._id) {
            return res.status(200).json({
              message: "User Created Successfully!!",
              data: result,
            });
          }
        })
        .catch((err) => {
          return res.status(401).json({
            message: "Alas! Error Creating User!!",
            error: err,
          });
        });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Error Hashing Password!!",
        error: err,
      });
    });
});

module.exports = UserRouter;
