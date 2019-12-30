import axios from 'axios';

async function request(configuration: any): Promise<any> {
	const port = '3001';
	const host = `http://localhost:${port}`;
	const base = `${host}/api/` || configuration.base;
	const path = base + configuration.url;

	const fetch = {
		url: path,
		headers: configuration.headers || {},
		method: configuration.method || 'GET',
		data: configuration.body || {},
	};

	return axios(fetch)
		.then((res) => res.data)
		.catch((err: Error) => {
			throw err;
		});
}

export default request;
