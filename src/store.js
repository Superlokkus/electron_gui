import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {connectRouter, routerMiddleware, push} from 'connected-react-router';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import logger from 'redux-logger'


import update from './reducers/update';
import updateActions from './actions/update';



export default function configureStore(initialState, routerHistory) {
    const router = routerMiddleware(routerHistory);

    const actionCreators = {
        ...updateActions,
        push,
    };

    const reducers = {
        router: connectRouter(routerHistory),
        update,
    };
    const middlewares = [thunk, router, logger];

    const composeEnhancers = (() => {
        const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (process.env.NODE_ENV === 'development' && compose_) {
            return compose_({actionCreators});
        }
        return compose;
    })();

    const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState());
    const rootReducer = combineReducers(reducers);

    return createStore(rootReducer, initialState, enhancer);
}