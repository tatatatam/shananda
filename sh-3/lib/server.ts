import app from "./app";
import * as dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
})
