// express config
const express = require("express");
const app = express();
const port = 5000;

// other imports

// routes import
const rosterRoute = require("./routes/Roster");
const uploadRoute = require("./routes/Upload");
const accountRoute = require("./routes/Accounts");
// routes config
app.use("/roster", rosterRoute);
app.use("/upload", uploadRoute);
app.use("/account", accountRoute);

// viewing engine
app.set("view engine", "ejs");

// code below

app.get("/", (req, res) => {
	res.redirect("/upload");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
