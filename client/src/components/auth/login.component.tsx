import React, { Component } from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import actions from '../../actions';
import '../../stylesheet/auth/login.less';

interface Props {
	history: any;
	login: Function;
	auth: {
		message: {
			type: string,
			payload: string,
			description: string,
			color: string,
		}
	};
	authFailed: Function;
}

interface State {
	email: string;
	password: string;
}

class Login extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
	}


	async login() {
		const { email, password } = this.state;
		const { login, history } = this.props;
		const credentials = { email, password };
		login(credentials, history);
	}

	render(): JSX.Element {
		const { history } = this.props;
		const { email, password } = this.state;

		let disable = true;

		if (isEmpty(email) || isEmpty(password)) {
			disable = true;
		} else {
			disable = false;
		}

		return (
			<div className="login">
				<p className="login-brand">Task Manager <Icon inverted color="blue" name="tasks" circular /></p>
				<div className="login-box">
					<Form size="large">
						<Form.Input
							fluid
							icon="mail"
							iconPosition="left"
							placeholder="Correo Electronico"
							name="email"
							type="text"
							onChange={(event) => this.setState({ email: event.target.value })}
						/>

						<Form.Input
							icon
							type="password"
							placeholder="Contraseña"
							onChange={(event) => this.setState({ password: event.target.value })}
						>
							<input />
							<Icon className="password-lock-icon" name="lock" />
						</Form.Input>
						<Button color="blue" disabled={disable} fluid size="large" onClick={() => this.login()}>
							INCIAR SESIÓN
						</Button>
						<label className="link" onClick={() => { history.push('/registro'); }}> ¿No tienes cuenta? registrate aquí </label>
						<Button color="black" fluid size="large" onClick={() => { history.push('/registro'); }}>
							REGISTRARSE
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

const { login, authFailed } = actions.authActions;

function mapStateToProps(state: { loginForm: object, auth: object }): object {
	return {
		auth: state.auth,
	};
}

export default withRouter(connect(mapStateToProps, { login, authFailed })(Login) as any);
