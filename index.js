var LedMatrix = require("node-rpi-rgb-led-matrix-adafruit");
const BDF = require('bdf');
const path = require('path');
const matrix = new LedMatrix(32, 2);


const font = new BDF;
font.loadSync(path.resolve(__dirname, './5x7.bdf'));

function toArray(obj) {
    const array = [];
    for (const key of Object.keys(obj)) {
        const number = Number(key);
        if (!Number.isNaN(number)) {
            array[number] = obj[key];
        }
    }
    return array;
}

console.log(font.writeText('3'));

function writeText(text, left, top, r, g, b) {
    // matrix.clear();
    const buffer = font.writeText(text);
    toArray(buffer).forEach((row, yIndex) => {
        row.forEach((pixel, xIndex) => {
            if (pixel === 1) {
                matrix.setPixel(xIndex + left, yIndex + top, r, g, b);
            } else {
                matrix.setPixel(xIndex + left, yIndex + top, 0, 0, 0);
            }
        });
    });
}


setInterval(() => {
    writeText('33rd 10 16 28', 0, 1, 255, 255, 255);
    writeText('WTC   7 27 47', 0, 9, 0, 255, 255);
    writeText('JSQ   6 18 30', 0, 17, 255, 0, 255);
    writeText('NWK  14 34 54', 0, 25, 255, 255, 0);
}, 1000);

// while(true) {}
