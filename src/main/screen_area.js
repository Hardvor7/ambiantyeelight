
const screenshot = require('screenshot-desktop');
const getPixels = require('get-pixels');

class AmbiantArea {
  constructor(yeelightGroup, screenArea) {
    this.yeelightGroup = yeelightGroup;
    this.screenArea = screenArea;
    this.isAmbiantLightActive = false;
    this.interval = -1;
  }

  startAmbiantLight() {
    this.isAmbiantLightActive = true
    this.ambiantLight();
  }

  async ambiantLight() {
    if(!this.isAmbiantLightActive) {
      return;
    }
    console.log("IN");
    await this.applyAmbiantLight();
    this.interval = setTimeout(() => this.ambiantLight(), 5000);
  }

  stopAmbiantLight() {
    console.log("IN2");
    this.isAmbiantLightActive = false;

    if(this.interval == -1) {
      return;
    }

    clearTimeout(this.interval);
  }

  async applyAmbiantLight() {
    
    try {
      const imgBuffer = await screenshot({format: 'png'});
    
      getPixels(imgBuffer, 'image/png', (error, pixels) => {
        if(error) {
          console.error("Bad image path or buffer");
          return;
        }

        const pixelsGrid = this.mapPixelsArray(pixels);
        const average = this.screenArea.getAvgColor(pixelsGrid);
        const hsv = rgb2hsv(...average);
        this.yeelightGroup.set_hsv(hsv.h, hsv.s);
        this.yeelightGroup.set_bright(hsv.v);
      });
    } catch (error) {
      console.error("An error occured during screenshot", error);
    }
  }
  
  mapPixelsArray({data: pixels, shape: [width, height, channelCount]}) {
    let i;

    const channelPixels = [];
    for(i = 0; i < pixels.length; i += channelCount) {
      channelPixels.push(pixels.slice(i, i + channelCount));
    }

    const pixelsGrid = [];
    for(i = 0; i < channelPixels.length; i += width) {
      pixelsGrid.push(channelPixels.slice(i, i + width));
    }

    return {
      pixels: pixelsGrid,
      width: width,
      height: height,
      channelCount: channelCount
    }
  }
}

class ScreenArea {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  pixelCount() {
    return (this.maxX - this.minX) * (this.maxY - this.minY);
  }

  isPixelInside(pixelIndex, screenWidth) {
    const x = pixelIndex % screenWidth;
    const y = Math.floor(pixelIndex / screenWidth);

    return this.isInside(x, y);
  }

  isInside(x, y) {
    return x >= this.minX
      && x < this.maxX
      && y >= this.minY
      && y < this.maxY;
  }
  
  getAvgColor({pixels, channelCount}, ignoredChannel = [false, false, false, true]) {

    const pixelCount = this.pixelCount();

    let x, y;
    let averageColor = []

    for(x = 0; x < channelCount; x++) {
      averageColor.push(0);
    }

    for(y = this.minY; y < this.maxY; y++) {
      for(x = this.minX; x < this.maxX; x++) {
        averageColor = averageColor.map((channel, index) => channel + pixels[y][x][index]);
      }
    }

    averageColor = averageColor.map((channel) => Math.round(channel / pixelCount));
    return averageColor.slice(0, 3);
  }
}


function rgb2hsv (r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
          h = bb - gg;
      } else if (gabs === v) {
          h = (1 / 3) + rr - bb;
      } else if (babs === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }
  return {
      h: Math.round(h * 360),
      s: percentRoundFn(s * 100),
      v: percentRoundFn(v * 100)
  };
}

module.exports = {
  ScreenArea: ScreenArea,
  AmbiantArea: AmbiantArea
};