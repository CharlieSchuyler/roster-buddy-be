const express = require("express");
const router = express.Router();

// other imports
const path = require("path");
const multer = require("multer");

// multer config
storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},

	filename: (req, file, cb) => {
		console.log(file);
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

// file upload
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
	res.render("index");
});

router.post("/file", upload.single("file"), (req, res) => {
	res.send("Uploaded");
});

module.exports = router;
