const mongoose = require('mongoose');
import * as path from 'path';
import { config } from 'dotenv';

const ENV_FILE = path.join(__dirname, '../../', '.env');
config({ path: ENV_FILE });

const dbUrl = process.env.mongo_db_connection_string;
class ConnectDb {
  public static connect(): Promise<void> {

    console.log("dburl from env ", dbUrl);

    return mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('Database connected', dbUrl))
      .catch((err) => console.error(err));
  }
}

export default ConnectDb;
