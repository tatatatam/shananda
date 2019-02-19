import app from "./app";
import * as dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
})
server.setTimeout(1200000)