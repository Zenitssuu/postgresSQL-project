import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    const image = filePath;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataUri = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResp = await cloudinary.uploader.upload(dataUri, {
      folder: "postgress-test",
    });
    // console.log("uploaded image url", uploadResp.url);
    return uploadResp.url;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const destroyFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl
      .split("/upload/")[1] // Get everything after "/upload/"
      .split(".")[0]; // Remove file extension

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
