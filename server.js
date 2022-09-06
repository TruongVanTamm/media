const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "vantam",
	password: "anhtam12345",
	database: "strapi",
});
app.get("", (req, res) => {
	pool.getConnection((err, connection) => {
        console.log(connection);
		// if (err) throw err;
		// console.log(`connection ad id ${connection.id}`);

		// connection.query("SELECT * FROM user", (err, rows) => {
		// 	connection.release();
        //     if(!err){
        //         res.send(rows)
        //     }
        //     else{
        //         console.log(err)
        //     }
		// });
	});
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
