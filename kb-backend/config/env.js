import dotenv from "dotenv";

dotenv.config(); // load .env early

// optional: debug all env values
// console.log("ENV loaded:", process.env.NODE_ENV);

export default process.env;
