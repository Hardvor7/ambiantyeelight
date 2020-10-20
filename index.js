//const electron = require('electron');

const { app, ipcMain, BrowserWindow } = require('electron');
const { Yeelight } = require('yeelight-node');
const YeelightGroup = require("./js/yeelight_group");
const screenshot = require('screenshot-desktop')

function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile('index.html');
  
  window.webContents.openDevTools();

  const yeelightGroup = new YeelightGroup([
    new Yeelight({ id: 1, name: 'Bed', ip: '192.168.1.95', port: 55443 }),
    new Yeelight({ id: 2, name: 'TV', ip: '192.168.1.78', port: 55443 })  
  ]);

  ipcMain.on('load-lights', (event) => {
    let lightsList = '';
    yeelightGroup.yeelights.forEach(yeelight => {
      lightsList += `
        <tr>
          <td>${yeelight.id}</td>
          <td class="mdl-data-table__cell--non-numeric">${yeelight.name}</td>
          <td class="mdl-data-table__cell--non-numeric">${yeelight.ip}</td>
          <td class="mdl-data-table__cell--non-numeric">${yeelight.connected ? 'Connected' : 'Disconnected'}</td>
        </tr>
      `;
    });
    event.returnValue = lightsList;
  });

  ipcMain.on('get-screen', (event) => {
    screenshot().then((img) => {
      event.returnValue = img;
    }).catch((err) => {
      console.error(err);
    });
  });

  ipcMain.handle('update_light', (event, args) => {
    yeelightGroup.set_rgb(args);
  });

}
/*
app.on('window-all-closed', () => {
  app.quit();
});
*/
app.whenReady().then(createWindow);



/*
const { Client } = require('yeelight-node')
 
const client = new Client()
 
client.bind(yeelight => {
    console.log("FOUND:", yeelight);
})

client.search();
*/
