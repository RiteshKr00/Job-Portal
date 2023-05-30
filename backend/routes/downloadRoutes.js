const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/resume/:file", (req, res) => {
  console.log("=======================================++++++==+++++++");
  // const address = path.join(__dirname, `../public/resume/${req.params.file}`);
  // fs.access(address, fs.F_OK, (err) => {
  //   if (err) {
  //     res.status(404).json({
  //       message: "File not found",
  //     });
  //     return;
  //   }
  //   res.sendFile(address);
  // });
  const { file } = req.params;
  console.log(file + ".pdf");
  const filePath = path.join(__dirname, "../public/resume", file + ".pdf");

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error while downloading:", err);
      res.status(404).json({
        message: "File not found",
      });
    }
  });
});

router.get("/profile/:file", (req, res) => {
  const address = path.join(__dirname, `../public/profile/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});

module.exports = router;
