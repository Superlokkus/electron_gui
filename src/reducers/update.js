import {handleActions} from 'redux-actions';
import actions from '../actions/update';

export default handleActions(
    {
        [actions.updateAvailable]: (state, action) => {
            return {
                ...state, updateAvailable: true, updateInfo: action.payload,
            };
        },
        [actions.startDownload]: (state, action) => {
            return {
                ...state, downloadStarted: true,
            };
        },
        [actions.updateError]: (state, action) => {
            return {
                ...state, updateError: action.payload,
            };
        },
        [actions.newProgress]: (state, action) => {
            return {
                ...state, downloadProgress: action.payload,
            };
        },
        [actions.updateDownloaded]: (state, action) => {
            return {
                ...state, downloadFinished: true,
            };
        },
    },
    {
        updateAvailable: null,
        updateError: null,
        updateInfo: {files: [{size: 0}]},
        downloadStarted: false,
        downloadProgress: {percent: 0, transferred: 0, bytesPerSecond: 0},
        downloadFinished: false,
    },
);