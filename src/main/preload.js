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
  appVersion: {
    get() {
      return ipcRenderer.sendSync('app-version-get');
    },
  },
  contextMenu: {
    popup(props) {
      ipcRenderer.send('context-menu-popup', props);
    },
  },
  userBrowser: {
    openUrl(url) {
      ipcRenderer.send('user-broswer-open-url', url);
    },
  },
});
