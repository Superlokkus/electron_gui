import {createAction} from 'redux-actions';

export default {
    updateAvailable: createAction('UPDATE_UPDATE_AVAILABLE'),
    startDownload: createAction('UPDATE_START_DOWNLOAD'),
    updateError: createAction('UPDATE_ERROR'),
    newProgress: createAction('UPDATE_NEW_PROGRESS'),
    updateDownloaded: createAction('UPDATE_DOWNLOADED'),
};