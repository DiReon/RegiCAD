"use strict";
exports.__esModule = true;
var regicad_1 = require("./regicad");
var createLine = function () {
    var elem = document.createElement('span');
    elem.innerHTML = "Hello";
    document.body.appendChild(elem);
    console.log("Element created");
    return null;
};
var calculate = function () {
    console.log(content.innerHTML);
    console.log(regicad_1.evaluate(content.innerHTML));
};
//document.body.onclick = createLine();
// document.body.contentEditable = "true";
var content = document.getElementById('content');
var calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate);
