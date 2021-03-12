const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");

// I will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// Upload Image Only Admin.
router.post("/upload", auth, authAdmin, (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send("There is no files uploaded");
    console.log(req.files);
    const file = req.files.file;
    // 1024 * 1024  = 1mb
    if (file.size > 1024 * 1024 * 2) {
      removeTem(file.tempFilePath);
      return res.status(400).json({ msg: "Size to large!" });
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTem(file.tempFilePath);
      return res.status(400).json({ msg: "file foramt incorrect!" });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "test" },
      async (error, result) => {
        if (error) throw error;
        removeTem(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
// Delete Image
router.post("/destroy", auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id)
      return res.status(400).json({ msg: "There are no images selected!" });
    cloudinary.v2.uploader.destroy(public_id, async (error, result) => {
      if (error) throw error;
      res.json({ msg: "Images have been deleted!" });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

const removeTem = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};

module.exports = router;
