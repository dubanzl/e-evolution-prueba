import { matchRoutes } from './match.routes';
import { authRoutes } from './auth.routes';
import { dashboardRoutes } from './dashboard.routes';

const routes: any = [].concat(
	dashboardRoutes,
	authRoutes,
	matchRoutes,
);

export default routes;
