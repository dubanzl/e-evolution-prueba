import NotFound from '../components/notFound.component';

export const matchRoutes : any = [
	{
		path: '*',
		component: NotFound,
		exact: true,
		status: 404,
	},
];
