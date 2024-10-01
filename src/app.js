import "express-async-errors";
import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/error-handler.js";
import notFound from "./middlewares/not-found.middleware.js";
import connectDB from "./config/db.config.js";
import authenticateUser from "./middlewares/auth.middleware.js";
import mongooseSanitize from "express-mongo-sanitize";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger.yaml");

connectDB();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
);
app.use(mongooseSanitize());
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/", (req, res) => {
  res
    .status(StatusCodes.OK)
    .send("<h1>API JOBS</h1><a href='/api-docs'>Documentation</a>");
});

import { auth } from "./features/auth/index.js";
import { jobs } from "./features/jobs/index.js";
import { StatusCodes } from "http-status-codes";

app.use("/api/v1/auth", auth);
app.use("/api/v1/jobs", authenticateUser, jobs);

app.use(notFound);
app.use(errorHandler);

export default app;
