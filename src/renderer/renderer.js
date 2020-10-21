
const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", function() {
  
  document.getElementById('get-screenshot-button').addEventListener('click', () => {
    ipcRenderer.send('get-screenshot');
  });
  
  document.getElementById('apply-screenshot-button').addEventListener('click', () => {
    updateLightsColorFromScreenshot();
  });
  
  document.getElementById('ambiant-light-switch').addEventListener('click', (event) => { 
    const isChecked = event.currentTarget.checked;
    ipcRenderer.send('toggle-ambiant-light', isChecked);
  });

  // Get Ligths
  updateLightsList();

  ipcRenderer.on('screenshot-recieved', (event, img) => {
    updateImg(img);
 })
});

function updateImg(imgBuffer) {
  const blob = new Blob( [ imgBuffer ], { type: "image/jpeg" } );
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL( blob );
  const img = document.getElementById('screen');
  img.src = imageUrl;
}

function updateLightsList() {
  const yeelights = ipcRenderer.sendSync('get-yeelights');
  const yeelightsList = [];
  for (const yeelight of Object.values(yeelights)) {
    yeelightsList.push(`
      <tr>
        <td>${yeelight.id}</td>
        <td class="mdl-data-table__cell--non-numeric">${yeelight.name}</td>
        <td class="mdl-data-table__cell--non-numeric">${yeelight.ip}</td>
        <td class="mdl-data-table__cell--non-numeric">${yeelight.connected ? 'Connected' : 'Disconnected'}</td>
      </tr>
    `);
  }

  document.getElementById('yeelights-list-tbody').innerHTML = yeelightsList.join('');
}

function updateLightsColorFromScreenshot() {
  
  const img = document.getElementById('screen');
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

  const width = 100;
  const height = 100;
  const offsetX = (img.width - width) / 2;
  const offsetY = (img.height - width) / 2;
  const pixelCount = width * height;

  var pixelData = canvas.getContext('2d').getImageData(offsetX, offsetY, width, height).data;
  let avgRGB = [0, 0, 0]

  pixelData.forEach((pixel, index) => {
    if(index % 4 == 3) {
      return;
    }

    avgRGB[index % 4] += pixel;
  });
  avgRGB = avgRGB.map(v => ~~(v / pixelCount));

  console.log('COLOR avg:', avgRGB)

  ipcRenderer.send('update_light', avgRGB);
}