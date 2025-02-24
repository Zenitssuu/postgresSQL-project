import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import router from "./routes/api.routes.js";
import cors from "cors";
import helmet from "helmet";
import { limiter } from "./config/ratelimit.js";
import "./jobs/index.js"

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin:"*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);


// app.use("/", (req, res) => {
//   res.send("hola this is working");
// });
app.use("/api", router);

app.listen(PORT, () => console.log(`we are here with prisma on port ${PORT}`));
