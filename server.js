const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
var corsOptions = {
	origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
