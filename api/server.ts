import express, { Application } from 'express';	// eslint-disable-line no-unused-vars
import config from 'config';
import morgan from 'morgan';
import cors from 'cors';
import cons from 'consolidate';
import indexRoutes from './routes/index.route';
import authRoutes from './routes/auth.route';
import * as uni from './app';

class Server {
	public app: Application;
	public port: number;

	constructor() {
		this.port = config.get('express.port');
		this.app = express();
		this.config();
		this.routes();
	}

	config(): void {
		this.app.set('port', this.port || 3210);
		this.app.use(express.static(config.get('public')));
		this.app.set('views', config.get('public'));
		this.app.engine('html', cons.swig);
		this.app.set('view engine', 'html');
		this.app.use(morgan('dev'));
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
	}

	routes(): void {
		this.app.use('/api/index', indexRoutes);
		this.app.use('/api/auth', authRoutes);
		this.app.get('*', (uni.handleRender));
	}

	start(): void {
		this.app.listen(this.app.get('port'), (): void => {
			console.log(`🚀 Server ready at http://localhost:${this.app.get('port')}`);
		});
	}
}

new Server().start();
