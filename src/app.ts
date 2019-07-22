import * as express from "express";
import * as bodyParser from "body-parser"
import { UserController } from "./controllers/UserController";
import { CronJob } from "cron";
import { ScrapFunction } from "./scripts/scrap";

/**
 * Cron job
 */
new CronJob("* * * * * *", () => {
    ScrapFunction()
}, () => {}, true, 'Europe/Bucharest');

/**
 * Express server instance
 */
const app: express.Application = express();
const port: number = parseInt(process.env.PORT || "3000");

// Configuration
app.use(bodyParser.json()); // Body parser middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Content-Type", "application/json");
    next();
});

// Controllers
app.use("/api/user", UserController);

app.listen(port, () => {
    console.log(`Started the server on port ${port}`);
});

