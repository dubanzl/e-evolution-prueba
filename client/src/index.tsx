import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

import App from './components/app.component';

const store = createStore(reducers, {}, applyMiddleware(thunk));

render(
	<Provider store={store}>
		<Router>
			<App auth={{ isAutenticated: false, user: { role: '' } }} />
		</Router>
	</Provider>,
	document.getElementById('app'),
);
