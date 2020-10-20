
class ScreenArea {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
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
}

module.exports = ScreenArea;