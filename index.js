'use strict';

require('isomorphic-fetch');
const LedMatrix = require("node-rpi-rgb-led-matrix-adafruit");
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

const query = `
{
  displayBoard(stopName: "Hoboken") {
    items {
      name
      minutesAway
    }
  }
}
`;

const body = JSON.stringify({query});
const colors = [
    [255, 255, 255],
    [0, 255, 255],
    [255, 0, 255],
    [255, 255, 0]
];


setInterval(async () => {
    try {
        const res = await fetch('http://192.168.1.155:4567/graphql', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body
        })

        const {data} = await res.json();
        data.displayBoard.items
            .filter(i => !!i.name && i.minutesAway[0] < 100)
            .forEach(({name, minutesAway}, i) => {
            const text = `${name.padEnd(4)} ${minutesAway.map(m => m.toString().padStart(2)).join(' ')}`;
            console.log('text', text);
            writeText(text, 0, (i * 8) + 1, ...colors[i]);
        });
    } catch (e) {
        console.error(e);
        matrix.clear();
    }
}, 10000);




// while(true) {}
