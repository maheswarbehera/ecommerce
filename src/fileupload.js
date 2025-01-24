import fs from "fs"
import { uploadOnCloudinary } from "./utils/cloudinary.js";

const fileUpload = async(req, res) => {
    let localfile = req.file.path
// console.log(req.file)
//     console.log(localfile)
    if (!localfile) {
        return res.status(400).send("No file uploaded.");
      }

      const image = await uploadOnCloudinary(localfile)
    //   console.log(image)
      res.json({
        message: "File uploaded successfully!",
        url: image.url,
      });
}

export {fileUpload}