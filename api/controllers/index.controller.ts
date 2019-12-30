import { Request, Response } from 'express'; // eslint-disable-line no-unused-vars
import { ObjectId } from 'mongodb';
import TaskModel from '../models/task.model';

class IndexController {
	public async getTasks(req: Request, res: Response) {
		const task: any = await TaskModel.getTasks(req.params.userId);
		res.json(task);
	}

	public async registerTask(req: Request, res: Response) {
		const { task } = req.body;
		const data = {
			name: task.name,
			priority: task.priority,
			description: task.description,
			expirationDate: new Date(task.expirationDate),
			status: 'Pendiente',
			userId: new ObjectId(task.userId),
		};
		const result = await TaskModel.registerTask(data);
		res.json(result);
	}

	public async updateTask(req: Request, res: Response) {
		const {	_id, name, priority, expirationDate, description } = req.body;
		const result = await TaskModel.updateTask(
			_id, name, priority, new Date(expirationDate), description,
		);
		res.json(result);
	}


	public async updateStatusTask(req: Request, res: Response) {
		const {	_id, status } = req.body;
		const result = await TaskModel.updateStatusTask(_id, status);
		res.json(result);
	}


	public async removeTask(req: Request, res: Response) {
		const {	_id } = req.body;
		const result = await TaskModel.removeTask(_id);
		res.json(result);
	}
}

export default IndexController;
