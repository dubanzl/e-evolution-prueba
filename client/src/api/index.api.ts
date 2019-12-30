import request from '../utils/request.util';


export async function query(): Promise<number[]> {
	return request({
		url: 'index/query',
		method: 'GET',
	});
}
