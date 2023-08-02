const mongoose = require('mongoose');

// construct the db connection uri
const dbBaseUrl = process.env.DB_URL;
const dbPassword = process.env.DB_PASSWORD;
const uri = dbBaseUrl.replace('<password>', dbPassword)

// exporting the connection
module.exports = mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch(err=>console.log('DB connection error: ', err));
