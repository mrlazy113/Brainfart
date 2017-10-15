'use strict';
var predictions = require('./predictions.json');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

module.exports = function () {
	return predictions[randomInt(0, predictions.length)];
};

module.exports.predictions = predictions;