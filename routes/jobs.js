const express = require("express");
const Client = require("../models/client");
const jobSchema = require("../models/job");
const mongoose = require("mongoose");

jobRouter = express.Router();

jobRouter.post("/api/v1/client/:id/jobs", async (req, res) => {
  try {
    const { title, details, salary, frequency, location, type, tags } = req.body;
    const id = req.params.id;

    let client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        status: 404,
        message: "Client not found",
      });
    }

    if (!client.jobs) {
        client.jobs = [];
    }
  
    client.jobs.push({
        job: {
            title,
            details,
            salary,
            frequency,
            location,
            type,
            tags,
          },
        created_on: new Date(),
        updated_on: new Date(),
      });

    const savedClient = await client.save();

    res.status(200).json({
      status: 200,
      message: "success",
      data: savedClient,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
});


jobRouter.get("/api/v1/client/:clientId", async (req, res) => {
  try {

    const clientId = req.params.clientId;

    let client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        status: 404,
        message: "Client not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "success",
      data: client,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
});


module.exports = jobRouter;
