const express = require("express");
const mongoose = require("mongoose");
const clientRouter = require('./routes/clientAuth');
const freelancerRouter = require('./routes/freelancerAuth');
const agencyRouter = require('./routes/agencyAuth');
const jobRouter = require('./routes/jobs');
const cors = require('cors');


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(clientRouter);
app.use(freelancerRouter);
app.use(agencyRouter);
app.use(jobRouter);

//cors
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

const DB = "mongodb+srv://bharatahuja:skillvalley@cluster0.atz7e6q.mongodb.net/?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);


//Connections
mongoose.connect(DB).then(() => {
    console.log("MongoDB connected");
}).catch((e) => {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
})
