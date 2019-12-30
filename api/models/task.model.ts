import { ObjectId } from 'mongodb'; // eslint-disable-line no-unused-vars
import db from '../database/db.conn';

class TaskModel {
	public static async getTasks(userId: string) {
		try {
			return await db.then((conn) => conn.collection('tasks').find({ userId: new ObjectId(userId) }).toArray());
		} catch (err) {
			throw err;
		}
	}

	public static async registerTask(task: {
		name: string, priority: string, description: string, expirationDate: Date, userId: ObjectId,
	}) {
		try {
			return new Promise((resolve : Function) => {
				db.then((conn) => conn.collection('tasks').insertOne(task, (err, doc): void => {
					if (err) {
						throw err;
					}
					resolve(doc.ops[0]);
				}));
			});
		} catch (error) {
			throw error;
		}
	}

	public static async updateTask(
		_id: ObjectId, name: string, priority: string, expirationDate: Date, description: string,
	) {
		try {
			return await db.then((conn) => conn.collection('tasks').updateOne({ _id: new ObjectId(_id) }, { $set: { name, priority, expirationDate, description } }));
		} catch (err) {
			throw err;
		}
	}

	public static async updateStatusTask(_id: ObjectId, status: string) {
		try {
			return await db.then((conn) => conn.collection('tasks').updateOne({ _id: new ObjectId(_id) }, { $set: { status } }));
		} catch (err) {
			throw err;
		}
	}

	public static async removeTask(_id: ObjectId) {
		try {
			return await db.then((conn) => conn.collection('tasks').remove({ _id: new ObjectId(_id) }));
		} catch (err) {
			throw err;
		}
	}
}

export default TaskModel;
