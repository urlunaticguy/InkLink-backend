const express = require("express");
const Agency = require("../models/agency");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

agencyRouter = express.Router();


//SIGN UP route
agencyRouter.post("/api/v1/agency/signup", async (req, res) => {

  try{
  const { email, password, name, image } = req.body;

  const existingAgency = await Agency.findOne({ email });

  if (existingAgency) {
    return res
      .status(400) //Bad request ==> client error status code
      .json({ status:400, message: "Agency with same email already exists!" });
      //this will return the status code as 400 and the message
  }
  //200 - OK

  const hashedPassword = await bcryptjs.hash(password, 8); 

  let agency = new Agency({
    email,
    password: hashedPassword,
    image,
    name,
  });

  agency = await agency.save();

  res.json({
    status: 200,
    message: "success",
    data: agency
  }); 
  }catch (e) {
    res.status(500).json({
        status: 500,
        message: e.message,
    });
  }
});


agencyRouter.post('/api/v1/agency/signin', async (req, res) => {
    try{
        const { email, password } = req.body;

        const agency = await Agency.findOne({ email });

        if (!agency) {
            return res.status(400).json({status:400, message: 'Agency with this email does not exist'});
        }
        if (!bcryptjs.compareSync(password, agency.password)) {

            return res.status(400).json({status:400, message:'Incorrect password'});
        }

        const token = jwt.sign({id: agency._id}, "passwordKey");

        res.json({
            token,
            status: 200,
            message: "success",
            data:{ ...agency._doc}
        });
    }catch (e) {
        res.status(500).json({
            status: 500,
            message: e.message,
        });
    }
});


//validating the token
agencyRouter.post("/tokenIsValid", async (req, res) => {
    try{
        const token = req.header('x-auth-token');
        if (!token) {
            return res.json(false);
        }

        const verified = jwt.verify(token, 'passwordKey');

        if(!verified) return res.json(false);

        const agency = await Agency.findById(verified.id);

        if(!agency) return res.json(false);

        res.json(true);

    }catch (e) {
    }
});

module.exports = agencyRouter;