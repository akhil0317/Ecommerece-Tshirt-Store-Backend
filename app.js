require('dotenv').config()
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();


const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");


//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
    // useFindAndModify: false
}).then(()=>{
    console.log("DB CONNECTED");
}).catch(()=>console.log("DB ERROR"))

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes)
app.use("/api",paymentRoutes)

//PORT
const PORT = process.env.PORT||8029;

//starting a server
app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`);
})