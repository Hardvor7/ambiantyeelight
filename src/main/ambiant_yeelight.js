'use strict'

const { ipcMain } = require('electron');
const { Yeelight } = require('yeelight-node');
const screenshot = require('screenshot-desktop');

const YeelightGroup = require('./yeelight_group');
const { ScreenArea, AmbiantArea } = require('./screen_area');

function init() {

  let ambiantLightInterval;

  const yeelightGroup = new YeelightGroup([
    new Yeelight({ id: 1, name: 'Bed', ip: '192.168.1.95', port: 55443 }),
    new Yeelight({ id: 2, name: 'TV', ip: '192.168.1.78', port: 55443 })  
  ]);
  
  const width = 1920;
  const height = 1080;
  const screenAreas = [
    new ScreenArea(0, 0, width / 2, height),
    new ScreenArea(width / 2, 0, width, height)
  ];

  const area1 = new AmbiantArea(
    new YeelightGroup([
      new Yeelight({ id: 1, name: 'TV', ip: '192.168.1.95', port: 55443 })]),
    new ScreenArea(0, 0, width / 2, height)
  )

  ipcMain.on('get-yeelights', (event) => {
    event.returnValue = yeelightGroup.get_yeelights_object();
  });

  ipcMain.on('get-screenshot', (event) => {
    
    screenshot({format: 'png'}).then((imgBuffer) => {
      event.sender.send('screenshot-recieved', imgBuffer);
    }).catch((err) => {
      console.error(err);
    });
  });

  ipcMain.on('update_light', (event, args) => {
    console.log(args)
    yeelightGroup.set_rgb(args);
  });

  ipcMain.on('toggle-ambiant-light', (event, active) => {
    if(active) {
      area1.startAmbiantLight();
    }
    else {
      area1.stopAmbiantLight();
    }
  });

}

module.exports.init = init;
