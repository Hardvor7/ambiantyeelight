'use strict'

module.exports = init;

const { Yeelight } = require('yeelight-node');

function init() {
    
  const yeelight1 = new Yeelight({ ip: '192.168.1.95', port: 55443 });
  const yeelight2 = new Yeelight({ ip: '192.168.1.78', port: 55443 });
  const yeeights = [yeelight1, yeelight2];

  yeeights.set_power('on');
  yeeights.set_rgb([250, 250, 0]);
  yeeights.get_prop('bright').then(data => {
    console.log(data)
    yeeights.set_bright(0);
  });
  yeeights.set_bright(1);
}
