const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const {autoUpdater} = require("electron-updater");

let mainWindow;

let storedUpdateResult;
let downloadPromise;
let updateDownloaded = false;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        minWidth: 160,
        minHeight: 90,
        webPreferences: {
            nodeIntegration: true
        },
        title: "Electron GUI - " + app.getVersion(),
    });
    mainWindow.webContents.session.clearStorageData();

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null;
    })
}

autoUpdater.on('update-available', (checkResult) => {
    if (app.isReady()) {
        notifiyUpdate(checkResult);
    } else {
        storedUpdateResult = checkResult;
    }
});

autoUpdater.on('error', (error) => {
    if (app.isReady()) {
        mainWindow.webContents.send('update-error', error);
    } else {
        console.log(error);
    }
});

autoUpdater.on('update-downloaded', (updateInfo) => {
    updateDownloaded = true;
    mainWindow.webContents.send('update-downloaded', updateInfo);
});

autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('update-download-progress', progress);
});

function notifiyUpdate(info) {
    mainWindow.webContents.send('update-available', info);
};

app.on('ready', () => {
    ipcMain.on('update-start-download', () => {
        if (downloadPromise !== null) {
            downloadPromise = autoUpdater.downloadUpdate().error(() => {
                downloadPromise = null;
            });
        }
    });
    ipcMain.on('update-install', () => {
        if (updateDownloaded) {
            autoUpdater.quitAndInstall();
        }
    });

    createMainWindow();
    if (storedUpdateResult !== null) {
        notifiyUpdate(storedUpdateResult);
        storedUpdateResult = null;
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

app.on('will-finish-launching', function () {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    if (app.isPackaged) {
        autoUpdater.checkForUpdates();
    }
});

app.on('activate', function () {
    if (mainWindow === null) createMainWindow()
});
