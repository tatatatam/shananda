import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as cors from "cors";
import * as timeout from "connect-timeout"
class App {

  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    const corsOptions = { origin: true ,
      maxAge:1200}
    this.app.use(cors(corsOptions));
    this.app.use(timeout(1500000))
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;