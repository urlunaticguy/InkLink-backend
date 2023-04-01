const express = require("express");
const Client = require("../models/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

clientRouter = express.Router();

//SIGN UP route
clientRouter.post("/api/v1/client/signup", async (req, res) => {
  // req.body gives us this
  //{
  //   email: string,
  //   password: string,
  //   name: string
  // }

  try {
    //get the data from the client
    const { email, password, name, image } = req.body;

    //validation to perform
    //weak password - 6 characters required,
    //same account with email and password
    //person can have same name and password but not a same email

    //we need to find an existing user
    //findOne is a promise - it is going to be an asynchronus process
    const existingClient = await Client.findOne({ email });

    if (existingClient) {
      return res
        .status(400) //Bad request ==> client error status code
        .json({ status:400, message: "Client with same email already exists!" });
      //this will return the status code as 400 and the message
    }
    //200 - OK

    //hashing our password so that it can't be seen if leaked/hacked
    const hashedPassword = await bcryptjs.hash(password, 8); //8 ==> salt

    //post that data to the database
    //creating a user object to post in database
    let client = new Client({
      email,
      password: hashedPassword,
      image,
      name,
    });

    client = await client.save();

    //return that data to the user
    res.json({
      status: 200,
      message: "success",
      data: client,
    }); // by default status code is 200
  } catch (e) {
    res.status(500).json({
        status: 500,
        message: e.message,
    });
  }
});

//SIGN IN route
clientRouter.post("/api/v1/client/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });

    if (!client) {
      return res
        .status(400)
        .json({ status:400, message: "Client with this email does not exist" });
    }
    if (!bcryptjs.compareSync(password, client.password)) {
      return res.status(400).json({ status:400, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: client._id }, "passwordKey");

    res.json({
      token,
      status: 200,
      message: "success",
      data: {
        ...client._doc,
      },
    });
  } catch (e) {
    res.status(500).json({
        status: 500,
        message: e.message,
    });
  }
});

//validating the token
clientRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }

    const verified = jwt.verify(token, "passwordKey");

    if (!verified) return res.json(false);

    const client = await Client.findById(verified.id);

    if (!client) return res.json(false);

    res.json(true);
  } catch (e) {}
});

//get user data
// authRouter.get('/', auth, async (req, res) => {

//     const client = await Client.findById(req.user);
//     res.json({...client._doc, token: req.token});

// });

// authRouter.get("/user", (req, res) => {
//   res.json({ name: "Bharat Ahuja" });
// });

//telling that this authrouter is not a private variable, it can be used anywhere in the app
module.exports = clientRouter;

//objects ==> {authRouter, name: "bharat"};

//still this does not work because we need middleware

//middleware
//CLIENT -> MIDDLEWARE -> SERVER -> CLIENT
