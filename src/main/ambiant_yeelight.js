'use strict'

const { ipcMain } = require('electron');
const { Yeelight } = require('yeelight-node');
const screenshot = require('screenshot-desktop');
const getPixels = require("get-pixels");

const YeelightGroup = require("./yeelight_group");
const ScreenArea = require('./screen_area');

function init() {

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

  ipcMain.on('get-yeelights', (event) => {
    event.returnValue = yeelightGroup.get_yeelights_object();
  });

  ipcMain.on('get-screenshot', (event) => {
    screenshot({format: 'png'}).then((imgBuffer) => {
      
      getPixels(imgBuffer, 'image/png', (err, pixels) => {
        if(err) {
          console.log("Bad image path or buffer");
          return;
        }

        const averages = getColorAverages(pixels, screenAreas);
        console.log("got pixels", averages);
        averages.forEach((average, i) => {
          yeelightGroup.yeelights[i].set_rgb(average);
        });
      });

      event.sender.send('screenshot-recieved', imgBuffer);
    }).catch((err) => {
      console.error(err);
    });
  });

  ipcMain.on('update_light', (event, args) => {
    console.log(args)
    yeelightGroup.set_rgb(args);
  });

}

function getColorAverages(pixels, screenAreas = [], channelCount = 4, ignoredChannel = [false, false, false, true])
{
  const averages = [];
  const averagesCount = new Array(screenAreas.length).fill(0);
  screenAreas.forEach(() => {
    const average = new Array(channelCount).fill(0);
    averages.push(average);
  });

  pixels.data.forEach((pixel, index) => {
    if(ignoredChannel[index % channelCount]) {
      return;
    }

    // Get index of pixel in screen grid
    const width = pixels.shape[0];
    const pixelIndex = Math.floor(index / channelCount);
    const pixelX = pixelIndex % width;
    const pixelY = Math.floor(pixelIndex / width);

    screenAreas.forEach((screenArea, i) => {
      if(screenArea.isInside(pixelX, pixelY, width)) {
        averages[i][index % channelCount] += pixel;
        averagesCount[i]++;
      }
    });
  });

  averages.forEach((average, i) => {
    averages[i] = average.map(v => ~~(v * channelCount / averagesCount[i]));
  });

  return averages;
}

module.exports.init = init;
