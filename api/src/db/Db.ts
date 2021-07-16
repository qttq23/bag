
import { Schema, model, connect, Connection } from 'mongoose';
import { Repo } from './repo/Repo';

export class Db {

	private _connection: Connection;

	open = async (connectionString: string): Promise<Connection> => {
		let moong = await connect(connectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('connected to database');

		this._connection = moong.connection;
		return moong.connection;

	};


	close = async (): Promise<void> => {
		if (!this._connection) return;
		await this._connection.close();
		console.log('closed database');
	};

	getRepo<Type>(c: new () => Type): Type {
		console.log('getting repo');
		return new c();
	}

}

