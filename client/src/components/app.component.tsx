import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import routes from '../routes';
import actions from '../actions';
import api from '../api';

interface Props {
	auth: { isAutenticated: boolean, user: { role: string; } };
	setCurrentUser: Function;
}

interface State {
	show: boolean;
	verify: boolean;
}
class App extends Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			show: false,
			verify: false,
		};
	}

	componentWillMount() {
		this.setState({ show: true });
	}

	componentDidMount() {
		this.verify();
	}

	async verify(): Promise<void> {
		if (localStorage.token) {
			await api.authApi.verify(localStorage.token).then((response): void => {
				if (response) {
					const { setCurrentUser } = this.props;
					setCurrentUser(jwt.decode(localStorage.token));
				}
			});
		}
		this.setState({ verify: true });
	}

	render() {
		const { verify } = this.state;
		const { auth } = this.props;
		const { show } = this.state;

		return (
			<div>
				{
					show ? (
						<Switch>
							{
								routes.map((
									route: {path: string; exact: boolean; component: any, routes: any[]},
								): JSX.Element => {
									return (
										<Route
											key={route.path}
											path={route.path}
											render={(props: any) => {
												if (verify) {
													switch (route.path) {
														case '/(inicio|iniciar-sesion|home||)':
															return !auth.isAutenticated ? (
																<route.component {...props} routes={route.routes} />
															) : (
																<Redirect
																	to={{
																		pathname: '/panel',
																	}}
																/>
															);

														case '/registro':
															return !auth.isAutenticated ? (
																<route.component {...props} routes={route.routes} />
															) : (
																<Redirect
																	to={{
																		pathname: '/panel',
																	}}
																/>
															);

														case '/panel':
															return auth.isAutenticated ? (
																<route.component {...props} routes={route.routes} />
															) : (
																<Redirect
																	to={{
																		pathname: '/iniciar-sesion',
																	}}
																/>
															);

														default:
															return <route.component {...props} routes={route.routes} />;
													}
												}
												return null;
											}}
										/>
									);
								})
							}
						</Switch>
					) : (<p>Loading...</p>)
				}
			</div>
		);
	}
}


function mapStateToProps(state: {auth: object}): object {
	return {
		auth: state.auth,
	};
}

const { setCurrentUser } = actions.authActions;

export default connect(mapStateToProps, { setCurrentUser })(App);
