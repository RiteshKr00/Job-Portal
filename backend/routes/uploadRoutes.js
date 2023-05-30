const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const path = require("path");
const JobApplicant = require("../db/JobApplicant");
const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

router.post("/resume", upload.single("file"), async (req, res) => {
  const { file } = req;
  const id = req.body.userid;
  console.log(req.body.userid);
  const fileExtension = path.extname(file.originalname);
  console.log();
  if (fileExtension.toLowerCase() != ".pdf") {
    console.log("first");
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${id}${fileExtension}`;

    // Write the file to the destination directory
    fs.writeFile(
      `${__dirname}/../public/resume/${filename}`,
      file.buffer,
      (err) => {
        if (err) {
          console.error("Error while uploading:", err);
          res.status(400).json({
            message: "Error while uploading",
          });
        } else {
          // const updatedJobApplicant = JobApplicant.findById(id);
          // console.log(updatedJobApplicant);

          // res.send({
          //   message: "File uploaded successfully",
          //   url: `/host/resume/${filename}`,
          // });
          JobApplicant.findById(id)
            .then((jobApplicant) => {
              if (!jobApplicant) {
                console.error("Job applicant not found");
                res.status(404).json({
                  message: "Job applicant not found",
                });
              } else {
                jobApplicant.resume = id;
                // jobApplicant.resume.url = `/host/resume/${filename}`;

                return jobApplicant.save();
              }
            })
            .then((updatedJobApplicant) => {
              console.log(updatedJobApplicant);
              res.send({
                message: "File uploaded successfully",
                url: `/host/resume/${filename}`,
              });
            })
            .catch((err) => {
              console.error("Error while updating resume field:", err);
              res.status(400).json({
                message: "Error while updating resume field",
              });
            });
        }
      }
    );
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" &&
    file.detectedFileExtension != ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;
