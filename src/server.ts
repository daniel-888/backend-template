import express, { Express } from "express";

import swaggerUi from "swagger-ui-express";

import fs from "fs";

import cors from "cors";
import bodyParser from "body-parser";

import initDB from "./db";
import initRoute from "./routes";
import setEnvironment from "./env";

// Swagger OpenAPI definition file
const swaggerDocument = require("./swagger/swagger.json");
const customCss = fs.readFileSync(
  process.cwd() + "/src/swagger/swagger.css",
  "utf8"
);

setEnvironment();
initDB();

const app: Express = express();
// swagger - ui client
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss })
);
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

initRoute(app);

app.listen(process.env.PORT || 3000, () => {
  // tslint:disable-next-line:no-console
  console.log("Server is Runing On port 3000");
});
