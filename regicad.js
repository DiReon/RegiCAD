"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern_1 = / |;|&nbsp|<([^>]+)>/gi;
exports.pattern_2 = /[\+\-\**\*\/)\(\)]/gi;
var Variable = /** @class */ (function () {
    function Variable(name, exp) {
        this.name = name;
        this.exp = exp;
    }
    Object.defineProperty(Variable.prototype, "result", {
        get: function () {
            return evaluate(this.exp);
        },
        enumerable: true,
        configurable: true
    });
    return Variable;
}());
var evaluate = function (str) {
    precision = +precisionEl['value'];
    console.log("precision:  " + precision);
    var varsNames = vars.map(function (x) { return x.name; });
    str = replaceByStars(str);
    var strArr = str.split(exports.pattern_2);
    for (var i = 0; i < strArr.length + 1; i++) {
        var index = varsNames.indexOf(strArr[i]);
        if (index != -1) {
            str = str.replace(strArr[i], "(" + vars[index].exp + ")").replace(/ /gi, '');
            strArr = str.replace(/[\(\)]/gi, '').split(exports.pattern_2);
            i = -1;
        }
    }
    console.log(str);
    // return regiRound(eval(str), precision);
    return (eval(str)).toFixed(precision);
};
var createVariable = function (str) {
    str = replaceByStars(str).replace(exports.pattern_1, '');
    var _a = str.split('='), name = _a[0], exp = _a[1];
    var varsNames = vars.map(function (x) { return x.name; });
    if (varsNames.includes(name)) {
        var index = varsNames.indexOf(name);
        vars.splice(index, 1);
    }
    var v = new Variable(name, exp);
    vars.push(v);
    return v;
};
var calculate = function () {
    vars = [];
    var content = textElement.innerHTML.replace(/<\/div>/gi, '');
    var contentArr = content.split('<div>');
    var temp = [];
    for (var line in contentArr) {
        temp.push(processLine(contentArr[line]));
    }
    textElement.innerHTML = '';
    console.log("Temp: ", temp);
    for (var line in temp) {
        if (temp[line] != '')
            textElement.innerHTML += "<div>" + temp[line] + "</div>";
    }
    save();
};
var processLine = function (line) {
    var _a;
    if (line.indexOf('=') === -1)
        return line;
    var result = '';
    var comment = '';
    if (line.indexOf('|') != -1)
        _a = line.split('|'), line = _a[0], comment = _a[1];
    if (comment)
        comment = ' |' + comment;
    if (line.match(/<b>.*<\/b>/) && line.includes('=')) {
        var v = createVariable(line);
        result = "<b><i>" + v.name + " = " + replaceStars(v.exp) + "</i></b>";
    }
    else {
        var lineArr = line.replace(exports.pattern_1, '').split('=');
        result = "<i>" + replaceStars(lineArr[0]) + " = " + evaluate(lineArr[0]) + "</i>";
    }
    return result + comment;
};
function regiRound(num, k) {
    var numArr = num.toString().split('.');
    if (numArr[1] == undefined)
        return num;
    var i = numArr[0].length;
    var j = numArr[1].length - (+numArr[1]).toString().length;
    if (i > 1 || undefined)
        return Math.round(num * (Math.pow(10, (k - i)))) / (Math.pow(10, (k - i)));
    else
        return Math.round(num * (Math.pow(10, (k + j)))) / (Math.pow(10, (k + j)));
}
var replaceByStars = function (str) {
    return str.replace(/\^/gi, '**').replace(/∙/gi, '*');
};
var replaceStars = function (str) {
    return str.replace(/\*\*/gi, '^').replace(/\*/gi, '∙');
};
var makeBold = function () {
    document.execCommand('bold', false);
    //below code does not remove <b> tags, and I have to use execCommand above.
    // let targetText = window.getSelection().toString();
    // let newText: string;
    // console.log("Selected text:", targetText);
    // let isBold = targetText.match(/<b>.*<\/b>/);
    // isBold ? newText = targetText.replace(/<b>|<\/b>/gi, '') : newText = `<b>${targetText}</b>`;
    // textElement.innerHTML = textElement.innerHTML.replace(targetText, `<b>${newText}</b>`);
};
var save = function () {
    if (!currentFile)
        currentFile = { versions: [], thisRev: 0 };
    if (currentFile.versions[0] == textElement.innerHTML)
        return;
    currentFile.versions.unshift(textElement.innerHTML);
    if (currentFile.versions.length > 20)
        currentFile.versions.pop();
    localStorage.setItem(newFilename['value'], JSON.stringify(currentFile));
    if (filelist.indexOf(newFilename['value']) === -1) {
        filelist.unshift(newFilename['value']);
        localStorage.setItem(regiList, filelist.join());
    }
    updateFileList();
    checkBtnStatus();
    textElement.focus();
    setEndOfContenteditable(textElement);
};
var deleteFile = function () {
    var filename = newFilename['value'];
    localStorage.removeItem(filename);
    var index = filelist.indexOf(filename);
    filelist.splice(index, 1);
    localStorage.removeItem(regiList);
    localStorage.setItem(regiList, filelist.join());
    updateFileList();
    if (filelist.length)
        loadFile();
};
var updateFileList = function () {
    while (selectFile.children.length > 0)
        selectFile.removeChild(selectFile.children[0]);
    filelist.forEach(function (file) {
        var option = document.createElement('option');
        option.innerHTML = file;
        option.classList.add("dropdown-item");
        selectFile.appendChild(option);
    });
};
var loadFile = function () {
    newFilename['value'] = selectFile['value'];
    var fileName = localStorage.getItem(selectFile['value']);
    if (fileName)
        currentFile = JSON.parse(fileName);
    textElement.innerHTML = currentFile.versions[0];
};
var checkBtnStatus = function () {
    if (currentFile.thisRev >= currentFile.versions.length - 1)
        undoBtn.classList.add('disabled');
    else
        undoBtn.classList.remove('disabled');
    if (currentFile.thisRev <= 0)
        redoBtn.classList.add('disabled');
    else
        redoBtn.classList.remove('disabled');
    textElement.focus();
    setEndOfContenteditable(textElement);
};
var changeVersion = function (x) {
    if (x == 1 && undoBtn.classList.contains("disabled"))
        return;
    if (x == -1 && redoBtn.classList.contains("disabled"))
        return;
    currentFile.thisRev += x;
    console.log("CurrentFile: ", currentFile.versions[currentFile.thisRev]);
    textElement.innerHTML = currentFile.versions[currentFile.thisRev];
    checkBtnStatus();
    textElement.focus();
    setEndOfContenteditable(textElement);
};
var createFile = function () {
    textElement.innerHTML = '';
    newFilename['value'] = '';
    currentFile = { versions: [], thisRev: 0 };
};
function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
     {
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
    }
}
var textElement = document.getElementById('content');
var precisionEl = document.getElementById('precision');
var undoBtn = document.getElementById('undoBtn');
var redoBtn = document.getElementById('redoBtn');
var newBtn = document.getElementById('new');
var saveBtn = document.getElementById('saveBtn');
var boldBtn = document.getElementById('boldBtn');
var calcBtn = document.getElementById('calcBtn');
var deleteBtn = document.getElementById('deleteBtn');
var selectFile = document.getElementById('selectFile');
var newFilename = document.getElementById('filename');
var vars = [];
var filelist = [];
var currentFile;
var regiList = 'RegiCADfiles'; //set to RegiTestFiles for testing
var help_demo = '{"versions":["<div>This is help file with demo calculation, showing the principle of RegiCAD usage.</div><div>RegiCAD divides data in 3 types:</div><div> - plain text. If there is no equal sign - that is a plain text.</div><div> - variables. If the line has equal and <b>the line is bold</b>, it is a variable, which can be used for calculation anywhere below that line.</div><div> - equations. Everything else is treated as equations. Whatever is after equal is replaced by the result of the equation before equal</div><div>To run the calculation press Ctrl+Enter or Calculator icon on the toolbar.</div><div>To set variable, highlight the whole line and press Ctrl+B to make it <b>bold</b></div><div>You can write comments on any line after the |. This might be useful for units in the calculations.</div><div><br></div><div>Change some value in below demo of the Mifflin St. Jeor Equation:</div><div><b><i>m = 75</i></b> | body mass, kg</div><div><b><i>h = 184</i></b> | height, cm</div><div><b><i>a = 31</i></b> |&nbsp;&nbsp;age, years</div><div><b><i>s = 5</i></b> | sex coefficient, 5 for male and -161 for female</div><div>Total heat production at complete rest:</div><div><b><i>P = (10∙m+6.25∙h-5∙a+s)</i></b></div><div><i>P = 1750</i></div><div><i><br></i></div><div>...or in loan calculation:</div><div><b><i>PV = 10000</i></b> | Present Value in USD</div><div><b><i>r = 0.05/12</i></b> | with rate of 5% per year, recalculated to rate per month</div><div><b><i>n = 5∙12</i></b> | for 5 years, 60 month</div><div><b><i>P = r∙PV/(1-(1+r)^(-n))</i></b></div><div><i>P = 188.7</i> | USD</div><div><br></div>"]}';
//Execution
var regiFiles = localStorage.getItem(regiList);
if (!regiFiles || regiFiles == null) {
    console.log('No RegiCADfiles found in localStorage. Creating Help and Demo...');
    regiFiles = 'Help and Demo,';
    localStorage.setItem(regiList, regiFiles);
    localStorage.setItem('Help and Demo', help_demo);
}
filelist = regiFiles.split(',');
//Initial file loading
if (filelist[0]) {
    currentFile = JSON.parse(localStorage.getItem(filelist[0]));
    textElement.innerHTML = currentFile.versions[0];
    currentFile.thisRev = 0;
    newFilename['value'] = filelist[0];
    textElement.focus();
    setEndOfContenteditable(textElement);
    checkBtnStatus();
}
updateFileList();
if (filelist.length)
    loadFile();
var precision = +precisionEl['value'];
calcBtn.addEventListener('click', calculate);
textElement.addEventListener('keypress', function (e) {
    if (e.keyCode == 10)
        calculate();
});
precisionEl.addEventListener('change', calculate);
undoBtn.addEventListener('click', function () { return changeVersion(1); });
redoBtn.addEventListener('click', function () { return changeVersion(-1); });
newBtn.addEventListener('click', createFile);
saveBtn.addEventListener('click', save);
boldBtn.addEventListener('click', makeBold);
deleteBtn.addEventListener('click', deleteFile);
selectFile.addEventListener('change', loadFile);
