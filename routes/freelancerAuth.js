const express = require("express");
const Freelancer = require("../models/freelancer");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

freelancerRouter = express.Router();


freelancerRouter.post("/api/v1/freelancer/signup", async (req, res) => {

  try{

  const { email, password, name, image } = req.body;

  const existingFreelancer = await Freelancer.findOne({ email });

  if (existingFreelancer) {
    return res
      .status(400) 
      .json({ msg: "Freelancer with same email already exists!" });
      //this will return the status code as 400 and the message
  }
  //200 - OK

  //hashing our password so that it can't be seen if leaked/hacked
  const hashedPassword = await bcryptjs.hash(password, 8); //8 ==> salt

  let freelancer = new Freelancer({
    email,
    password: hashedPassword,
    image,
    name,
  });

  freelancer = await freelancer.save();

  //return that data to the user
  res.json(freelancer); // by default status code is 200
  }catch (e) {
    res.status(500).json({error: e.message});
  }
});


//SIGN IN route
freelancerRouter.post('/api/v1/freelancer/signin', async (req, res) => {
    try{
        const { email, password } = req.body;

        const freelancer = await Freelancer.findOne({ email });

        if (!freelancer) {
            return res.status(400).json({msg: 'Freelancer with this email does not exist'});
        }
        if (!bcryptjs.compareSync(password, freelancer.password)) {

            return res.status(400).json({msg: 'Incorrect password'});
        }

        const token = jwt.sign({id: freelancer._id}, "passwordKey");

        res.json({
            token,
            ...freelancer._doc
        });
    }catch (e) {
        res.status(500).json({error: e.message});
    }
});


//validating the token
freelancerRouter.post("/tokenIsValid", async (req, res) => {
    try{
        const token = req.header('x-auth-token');
        if (!token) {
            return res.json(false);
        }

        const verified = jwt.verify(token, 'passwordKey');

        if(!verified) return res.json(false);

        const freelancer = await Freelancer.findById(verified.id);

        if(!freelancer) return res.json(false);

        res.json(true);

    }catch (e) {
    }
});


module.exports = freelancerRouter;
