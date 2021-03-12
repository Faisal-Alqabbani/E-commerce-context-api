require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
// import your routers
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use("/user", require("./routers/userRouter"));
app.use("/api", require("./routers/categoryRouter"));
app.use("/api", require("./routers/upload"));
app.use("/api", require("./routers/productRouter"));
app.use("/api", require("./routers/paymentRouter"));

// connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) throw error;
    console.log("Yaaaao we made it. connected to mongodb successfully");
  }
);

app.get("/", (req, res) => {
  res.json({ message: "this is my first route" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
