//const electron = require('electron');

const { app, BrowserWindow } = require('electron');
const ambiantYeelight = require('./ambiant_yeelight');

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

  ambiantYeelight.init();
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
