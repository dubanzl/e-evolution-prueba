import isEmpty from 'lodash/isEmpty';
import { authConstants } from '../constants';

const initialState = {
	isAutenticated: false,
	user: {},
	message: {
		type: '',
		payload: '',
		description: '',
		color: '',
	},
};

const auth = (state : any = initialState, action: any) => {
	switch (action.type) {
		case authConstants.SET_CURRENT_USER:
			return {
				isAutenticated: !isEmpty(action.user),
				user: action.user,
				message: {
					type: '',
					payload: '',
					description: '',
					color: '',
				},
			};

		case authConstants.REMOVE_CURRENT_USER:
			return {
				isAutenticated: false,
				user: {},
				message: {
					type: '',
					payload: '',
					description: '',
					color: '',
				},
			};

		case authConstants.AUTH_FAILED:
			return {
				isAutenticated: false,
				user: {},
				message: action.message,
			};

		default:
			return state;
	}
};

export default auth;
