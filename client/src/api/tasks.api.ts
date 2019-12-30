import request from '../utils/request.util';

export async function addTask(task): Promise<any> {
	return request({
		url: 'index/registerTask',
		method: 'POST',
		body: { task },
	});
}

export async function getTasksByUserId(userId): Promise<any> {
	return request({
		url: `index/getTasks/${userId}`,
		method: 'GET',
	});
}

export async function removeTask(taskId): Promise<any> {
	return request({
		url: 'index/removeTask',
		method: 'DELETE',
		body: { _id: taskId },
	});
}


export async function updateTask(task): Promise<any> {
	return request({
		url: 'index/updateTask',
		method: 'POST',
		body: { ...task },
	});
}

export async function updateTaskStatus(taskId: string, status: string): Promise<any> {
	return request({
		url: 'index/updateStatusTask',
		method: 'POST',
		body: { _id: taskId, status },
	});
}
