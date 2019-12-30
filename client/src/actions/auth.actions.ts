import jwt from 'jsonwebtoken';
import api from '../api';
import { authConstants } from '../constants';

export function setCurrentUser(user: object): {type: string; user: object} {
	return {
		type: authConstants.SET_CURRENT_USER,
		user,
	};
}

export function removeCurrentUser() {
	return {
		type: authConstants.REMOVE_CURRENT_USER,
	};
}

export function authFailed(message) {
	return {
		type: authConstants.AUTH_FAILED,
		message,
	};
}

export function login(credentials: {email: string; password: string}, history: any): Function {
	return async (dispatch: Function): Promise<void> => {
		try {
			const data = await api.authApi.login(credentials);

			localStorage.setItem('token', data.token);
			const user: { role: string } = jwt.decode(data.token) as any;
			dispatch(setCurrentUser(user));
			history.push('/panel');
		} catch (err) {
			dispatch(authFailed(err.response.data.message));
		}
	};
}


export function logout(): Function {
	return (dispatch: (arg0: { type: string; }) => void): void => {
		localStorage.removeItem('token');
		dispatch(removeCurrentUser());
	};
}
