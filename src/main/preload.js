const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },

  store: {
    get(val) {
      return ipcRenderer.sendSync('get-electron-store', val);
    },
    set(property, val) {
      ipcRenderer.send('set-electron-store', property, val);
    },
  },

  getAppVersion: () => {
    return ipcRenderer.sendSync('get-app-version');
  },

  popupContextMenu: (props) => {
    ipcRenderer.send('popup-context-menu', props);
  },

  openViaBrowser: (url) => {
    ipcRenderer.send('open-via-broswer', url);
  },

  net: {
    auth(quickConnectID) {
      ipcRenderer.send('axios-auth', quickConnectID);
      ipcRenderer.once('axios-auth-reply', (event, arg) => {
        console.log(arg);
        return arg;
      });
    },
  },
});
