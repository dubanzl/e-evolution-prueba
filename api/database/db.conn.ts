import { MongoClient, Db } from 'mongodb'; // eslint-disable-line no-unused-vars
import { isEmpty } from 'lodash';
import config from 'config';

class Database {
	private host : string;
	private port : number;
	public dbname : string;
	public connection ?: MongoClient;

	constructor() {
		this.host = config.get('mongo.host');
		this.port = config.get('mongo.port');
		this.dbname = config.get('mongo.dbname');
	}

	public async getInstance() {
		try {
			if (isEmpty(this.connection)) {
				await this.connect();
			}
			if (this.connection !== undefined) {
				return this.connection.db(this.dbname);
			}
			throw Error;
		} catch (error) {
			throw error;
		}
	}

	public async connect() {
		try {
			this.connection = await MongoClient.connect(`mongodb://${this.host}:${this.port}/${this.dbname}`, { useUnifiedTopology: true, useNewUrlParser: true });
		} catch (error) {
			throw error;
		}
	}

	public disconnect() {
		try {
			if (this.connection !== undefined) {
				this.connection.close();
			}
		} catch (error) {
			throw error;
		}
	}
}

export default new Database().getInstance() as Promise<Db>;
