import mongoose from 'mongoose';
import * as path from 'path';
import { config } from 'dotenv';

export class ConnectDb {
    private static instance: ConnectDb;
    private readonly dbUrl: string;

    private constructor() {
        const ENV_FILE = path.join(__dirname, '../../', '.env');
        config({ path: ENV_FILE });
        this.dbUrl = process.env.mongo_db_connection_string || '';
    }

    public static getInstance(): ConnectDb {
        if (!ConnectDb.instance) {
            ConnectDb.instance = new ConnectDb();
        }
        return ConnectDb.instance;
    }

    public async connect(): Promise<void> {
        console.log("dburl from env ", this.dbUrl);
        try {
            await mongoose.connect(this.dbUrl);
            console.log('Database connected', this.dbUrl);
        } catch (error) {
            console.error('Error connecting to database:', error);
            throw error;
        }
    }
}
