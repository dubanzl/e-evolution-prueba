import db from '../database/db.conn';

class UserModel {
	public static async findUserByEmail(email: string) {
		try {
			return await db.then((conn) => conn.collection('users').find({ email }).toArray());
		} catch (err) {
			throw err;
		}
	}

	public static async register(user: { email: string, password: string}) {
		try {
			return new Promise((resolve: Function): void => {
				db.then((conn) => conn.collection('users').insertOne(user, (err, doc): void => {
					if (err) {
						throw err;
					}
					resolve(doc.ops[0]);
				}));
			});
		} catch (err) {
			throw err;
		}
	}
}

export default UserModel;
