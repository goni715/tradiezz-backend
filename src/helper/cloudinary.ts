import {v2 as cloudinary } from "cloudinary";
import config from "../config";


cloudinary.config({
    cloud_name: config.cloud_name as string,
    api_key: config.cloud_api_key as string,
    api_secret: config.cloud_api_secret_key as string
});

export default cloudinary;