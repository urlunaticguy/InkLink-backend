const mongoose = require("mongoose");
const jobSchema = require("./job");

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        return value.length > 6;
      },
      message: "Please enter a long password",
    },
  },
  jobs: [{
    job: {
      type: jobSchema, // reference the jobSchema
      required: true,
    },
    created_on: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updated_on: {
      type: Date,
      required: true,
      default: Date.now,
    },
  }],
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
