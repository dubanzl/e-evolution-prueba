import React, { Component } from 'react';
import { Icon, Button, Modal, Header, Form, Label, Dropdown, Responsive, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import _, { isEmpty } from 'lodash';
import api from '../api';
import actions from '../actions';
import '../stylesheet/dashboard.less';

interface Props {
	logout: Function;
	auth: {
		isAutenticated: true,
		user: {
			iat: number,
			id: string,
			name: string,
		};
	};
}

interface State {
	name: string;
	description: string;
	priority: string;
	expirationDate: string;
	open: boolean;
	tasks: {
		_id: string;
		name: string;
		status: string;
		priority: string;
		description: string;
		expirationDate: string;
		userId: string;
	}[];
	selectedTask: {
		_id: string;
		name: string;
		status: string;
		priority: string;
		description: string;
		expirationDate: string;
		userId: string;
	};
	showEditForm: boolean;
}

class Dashboard extends Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			priority: '',
			expirationDate: '',
			open: false,
			tasks: [],
			selectedTask: {
				_id: '',
				name: '',
				status: '',
				priority: '',
				description: '',
				expirationDate: '',
				userId: '',
			},
			showEditForm: false,
		};
	}

	async componentDidMount() {
		const { auth } = this.props;
		const tasks = await api.tasksApi.getTasksByUserId(auth.user.id);
		this.setState({ tasks });
	}

	async addTask() {
		const { tasks } = this.state;
		const { auth } = this.props;
		this.setState({ open: false });
		const { name, description, priority, expirationDate } = this.state;
		const response = await api.tasksApi.addTask({
			name, description, priority, expirationDate, userId: auth.user.id,
		});
		tasks.push(response);
		this.setState({ tasks });
	}

	resetEditForm() {
		this.setState({
			selectedTask: {
				_id: '',
				name: '',
				status: '',
				priority: '',
				description: '',
				expirationDate: '',
				userId: '',
			},
			showEditForm: false,
		});
	}

	editForm(task) {
		this.setState({
			selectedTask: { ...task, expirationDate: task.expirationDate.replace(/:[^:]*$/, '') }, showEditForm: true,
		});
	}

	async removeTask(task) {
		const { tasks } = this.state;

		api.tasksApi.removeTask(task._id);

		_.remove(tasks, (t) => {
			return t._id === task._id;
		});

		this.setState({ tasks });
	}


	async updateTask() {
		const { selectedTask, tasks } = this.state;
		await api.tasksApi.updateTask(selectedTask);

		const index = _.findIndex(tasks, (t) => {
			return t._id === selectedTask._id;
		});

		tasks[index] = selectedTask;
		this.setState({ tasks });
		this.resetEditForm();
	}

	async updateTaskStatus(task: { _id: string }, status: string) {
		const { tasks } = this.state;
		await api.tasksApi.updateTaskStatus(task._id, status);

		const index = _.findIndex(tasks, (t) => {
			return t._id === task._id;
		});

		tasks[index].status = status;
		this.setState({ tasks });
	}

	logout(): any {
		const { logout }	= this.props;
		logout();
	}

	render() {
		const { open, tasks, selectedTask, showEditForm, name,
			description, priority, expirationDate } = this.state;

		let disabledUpdate = true;

		let disableCreate = true;

		// eslint-disable-next-line max-len
		if (isEmpty(selectedTask.description) || isEmpty(selectedTask.expirationDate) || isEmpty(selectedTask.name) || isEmpty(selectedTask.priority) || isEmpty(selectedTask.status)) {
			disabledUpdate = true;
		} else {
			disabledUpdate = false;
		}

		if (isEmpty(name) || isEmpty(description) || isEmpty(priority) || isEmpty(expirationDate)) {
			disableCreate = true;
		} else {
			disableCreate = false;
		}

		const colors = ['blue', 'red', 'black', 'brown', 'green', 'grey', 'olive', 'orange', 'pink', 'purple', 'teal', 'violet', 'yellow'];

		let background = '#88858517';

		let pendings = 0;
		let completeds = 0;
		let expireds = 0;

		tasks.map((t) => {
			if (t.status === 'Finalizada') {
				completeds++;
			} else if (t.status === 'Pendiente') {
				pendings++;
			}

			if (new Date(t.expirationDate) < new Date()) {
				expireds++;
			}
		});

		return (
			<div className="dashboard">
				<Modal
					open={showEditForm}
					centered={false}
					size="small"
				>
					<Header icon="list" content="Editar tarea" />
					<Modal.Content>
						<Form size="large">
							<Form.Input
								label="Nombre"
								fluid
								placeholder="Nombre"
								name="email"
								type="text"
								onChange={
									(event) => this.setState(
										{ selectedTask: { ...selectedTask, name: event.target.value } },
									)
								}
								value={selectedTask.name}
							/>

							<Form.TextArea
								rows={4}
								placeholder="Descripción"
								label="Descripción"
								onChange={
									(_event, { value }: any) => this.setState(
										{ selectedTask: { ...selectedTask, description: value } },
									)
								}
								value={selectedTask.description}
							/>


							<Form.Group widths="equal">
								<Form.Select
									label="Prioridad"
									fluid
									placeholder="Seleccione prioridad"
									onChange={
										(_event, { value }: any) => this.setState(
											{ selectedTask: { ...selectedTask, priority: value } },
										)
									}
									defaultValue={selectedTask.priority}
									options={[
										{ key: 'Muy alta', text: 'Muy alta', value: 'Muy alta' },
										{ key: 'Alta', text: 'Alta', value: 'Alta' },
										{ key: 'Media', text: 'Media', value: 'Media' },
										{ key: 'Baja', text: 'Baja', value: 'Baja' },
										{ key: 'Muy Baja', text: 'Muy Baja', value: 'Muy Baja' },
									]}
								/>

								<Form.Input
									label="Fecha de vencimiento"
									fluid
									type="datetime-local"
									onChange={
										(event) => this.setState(
											{ selectedTask: { ...selectedTask, expirationDate: event.target.value } },
										)
									}
									value={selectedTask.expirationDate}
								/>
							</Form.Group>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button color="red" onClick={() => this.resetEditForm()}>
							<Icon name="remove" /> Cancelar
						</Button>
						<Button disabled={disabledUpdate} color="green" onClick={() => this.updateTask()}>
							<Icon name="checkmark" /> Aceptar
						</Button>
					</Modal.Actions>
				</Modal>
				<div className="dashboard-box">
					<p className="dashboard-brand">Task Manager <Icon inverted color="blue" name="tasks" circular /></p>
					<div className="dashboard-action-bar">
						<Button onClick={() => this.setState({ open: true })} primary>Añadir tarea</Button>
					</div>
					<Responsive maxWidth={767}>
						<Button className="btn-add-task-mobile" onClick={() => this.setState({ open: true })} primary>Añadir tarea</Button>
					</Responsive>
					<div className="dashboard-header">
						<p className="task-title">Mis tareas</p>
						<Popup basic content="Cerrar Sesion" trigger={<p onClick={() => this.logout()} className="task-counters-info link"><b><Icon name="log out" inverted color="black" /></b></p>} />
						<Popup basic content="Tareas vencidas" trigger={<p className="task-counters-info"><b><Icon name="calendar times" inverted color="red" /></b> { expireds } </p>} />
						<Popup basic content="Tareas pendientes" trigger={<p className="task-counters-info"><b><Icon name="braille" inverted color="grey" /></b> { pendings } </p>} />
						<Popup basic content="Tareas completadas" trigger={<p className="task-counters-info"><b><Icon name="check" inverted color="green" /></b> { completeds }</p>} />
					</div>
					<div className="dashboard-content">
						{
							tasks.map((task) => {
								let days: any = null;
								if (new Date(task.expirationDate) > new Date()) {
									const expiredAt = new Date(task.expirationDate);
									const start = moment(new Date());
									const end = moment(expiredAt);
									days = moment.duration(start.diff(end)).asDays();
									days = Math.abs(Math.round(days));
								}

								const options: any = [];
								if (task.status === 'Finalizada') {
									if (new Date(task.expirationDate) > new Date()) {
										options.push({ key: 'descomplete', text: 'Descompletar', icon: 'redo', onClick: () => this.updateTaskStatus(task, 'Pendiente') });
									}
								} else if (task.status === 'Pendiente') {
									if (new Date(task.expirationDate) > new Date()) {
										options.push({ key: 'edit', text: 'Editar', icon: 'pencil', onClick: () => this.editForm(task) });
										options.push({ key: 'complete', text: 'Finalizar', icon: 'check', onClick: () => this.updateTaskStatus(task, 'Finalizada') });
									}
								}

								options.push({ key: 'delete', text: 'Eliminar', icon: 'close', onClick: () => this.removeTask(task) });

								if (background === '#88858517') {
									background = 'white';
								} else {
									background = '#88858517';
								}

								return (
									<div style={{ backgroundColor: background }} className="task" key={task._id}>
										<div>
											<Dropdown
												className="task-action-bar"
												trigger={<Icon name="ellipsis vertical" size="large" color="grey" inverted />}
												options={options}
												pointing="top right"
												icon={null}
											/>
											<div className="task-header">
												<Icon name="circle" size="tiny" color={_.sample(colors) as any} inverted />
												<p><b>{ task.name }: </b> { task.description }</p>
											</div>
											<div className="task-content">
												<div className="tasks-tags">
													<Label color={task.status === 'Pendiente' ? 'grey' : task.status === 'Finalizada' ? 'green' : 'red'}>
														{ task.status }
													</Label>
													<Label color="blue">
														Prioridad { task.priority }
													</Label>
													{
														(new Date(task.expirationDate) < new Date())
															? (
																<Label color="red">
																	Tarea Vencida
																</Label>
															)
															: null
													}
													{
														(
															days != null && new Date() < new Date(task.expirationDate)
															&& days <= 12
														)
															? (
																<Label color="orange">
																	¡Esta tarea esta por vencer! Faltan { days } Día(s)
																</Label>
															)
															: null
													}
												</div>
												<p className="task-date">Fecha de vencimiento: { moment(task.expirationDate).format('YYYY-MM-DD HH:mm') } </p>
											</div>
										</div>
									</div>
								);
							})
						}
					</div>
				</div>
				<Modal
					open={open}
					centered={false}
					size="small"
				>
					<Header icon="list" content="Añadir nueva tarea" />
					<Modal.Content>
						<Form size="large">
							<Form.Input
								label="Nombre"
								fluid
								placeholder="Nombre"
								name="email"
								type="text"
								onChange={(event) => this.setState({ name: event.target.value })}
							/>
							<Form.TextArea
								rows={4}
								placeholder="Descripción"
								label="Descripción"
								onChange={
									(_event, { value }: any) => {
										this.setState({ description: value });
									}
								}
							/>

							<Form.Group widths="equal">
								<Form.Select
									label="Prioridad"
									fluid
									placeholder="Seleccione prioridad"
									onChange={
										(_event, { value }: any) => {
											this.setState({ priority: value });
										}
									}
									options={[
										{ key: 'Muy alta', text: 'Muy alta', value: 'Muy alta' },
										{ key: 'Alta', text: 'Alta', value: 'Alta' },
										{ key: 'Media', text: 'Media', value: 'Media' },
										{ key: 'Baja', text: 'Baja', value: 'Baja' },
										{ key: 'Muy Baja', text: 'Muy Baja', value: 'Muy Baja' },
									]}
								/>
								<Form.Input
									label="Fecha de vencimiento"
									fluid
									type="datetime-local"
									onChange={(event) => this.setState({ expirationDate: event.target.value })}
								/>
							</Form.Group>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button color="red" onClick={() => this.setState({ open: false })}>
							<Icon name="remove" /> Cancelar
						</Button>
						<Button color="green" disabled={disableCreate} onClick={() => this.addTask()}>
							<Icon name="checkmark" /> Aceptar
						</Button>
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}


function mapStateToProps(state: { auth: object }) {
	return {
		auth: state.auth,
	};
}

const { logout } = actions.authActions;

export default connect(mapStateToProps, { logout })(Dashboard);
