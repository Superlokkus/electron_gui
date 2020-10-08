import React from 'react';
import {ConnectedRouter} from 'connected-react-router';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-roboto';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';

import routes from './routes';
import configureStore from './store';


import update from './actions/update';

const {ipcRenderer} = window.require('electron');

const theme = createMuiTheme({
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state.initialState = {};
        this.state.routerHistory = createMemoryHistory();
        this.state.store = configureStore(this.state.initialState, this.state.routerHistory);

        ipcRenderer.on('update-available', (event, arg) => {
            this.updateAvailable(arg);
        });
        ipcRenderer.on('update-error', (event, arg) => {
            this.updateError(arg);
        });
        ipcRenderer.on('update-downloaded', (event, arg) => {
            this.updateDownloaded(arg);
        });
        ipcRenderer.on('update-download-progress', (event, arg) => {
            this.updateProgress(arg);
        });
    }

    state = {};

    updateAvailable(info) {
        this.state.store.dispatch(update.updateAvailable(info));
    };

    updateError(error) {
        this.state.store.dispatch(update.updateError(error));
    };

    updateDownloaded(info) {
        this.state.store.dispatch(update.updateDownloaded(info));
    };

    updateProgress(progress) {
        this.state.store.dispatch(update.newProgress(progress));
    };

    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <ThemeProvider theme={theme}>
                    <Provider store={this.state.store}>
                        <ConnectedRouter history={this.state.routerHistory}>
                            <h1>Hello</h1>
                        </ConnectedRouter>
                    </Provider>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default App;
