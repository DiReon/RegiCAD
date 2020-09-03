var pattern_1 = / |;|&nbsp|<([^>]+)>/gi;
var pattern_2 = /[\+\-\**\*\/)\(\)]/gi;
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
    var varsNames = vars.map(function (x) { return x.name; });
    str = replaceByStars(str);
    var strArr = str.split(pattern_2);
    for (var i = 0; i < strArr.length + 1; i++) {
        var index = varsNames.indexOf(strArr[i]);
        if (index != -1) {
            str = str.replace(strArr[i], "(" + vars[index].exp + ")").replace(/ /gi, '');
            strArr = str.replace(/[\(\)]/gi, '').split(pattern_2);
            i = -1;
        }
    }
    return regiRound(eval(str), precision);
};
var createVariable = function (str) {
    str = replaceByStars(str).replace(pattern_1, '');
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
    for (var line in temp) {
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
        var lineArr = line.replace(pattern_1, '').split('=');
        result = "<i>" + replaceStars(lineArr[0]) + " = " + evaluate(lineArr[0]) + "</i>";
    }
    return result + comment;
};
function regiRound(num, k) {
    if (num > 1000)
        return Math.round(num);
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
var save = function () {
    //    let fileName = localStorage.getItem(newFilename['value']);
    //    let file: RegiFile = {versions: [], thisRev: 0};
    //    if (fileName) file = JSON.parse(fileName);
    //    console.log("File: ", file);
    console.log("Save() called");
    if (!currentFile)
        currentFile = { versions: [], thisRev: 0 };
    currentFile.versions.unshift(textElement.innerHTML);
    console.log("File: ", currentFile);
    localStorage.setItem(newFilename['value'], JSON.stringify(currentFile));
    if (filelist.indexOf(newFilename['value']) === -1) {
        filelist.unshift(newFilename['value']);
        localStorage.setItem('RegiTestFiles', filelist.join());
    }
    updateFileList();
    checkBtnStatus();
};
var deleteFile = function () {
    var filename = newFilename['value'];
    localStorage.removeItem(filename);
    var index = filelist.indexOf(filename);
    filelist.splice(index, 1);
    localStorage.removeItem('RegiTestFiles');
    localStorage.setItem('RegiTestFiles', filelist.join());
    updateFileList();
};
var updateFileList = function () {
    while (selectFile.children.length > 0)
        selectFile.removeChild(selectFile.children[0]);
    filelist.forEach(function (file) {
        var option = document.createElement('option');
        option.innerHTML = file;
        selectFile.appendChild(option);
    });
};
var loadFile = function () {
    var file;
    var fileName = localStorage.getItem(selectFile['value']);
    if (fileName)
        file = JSON.parse(fileName);
    textElement.innerHTML = file.versions[0];
    newFilename['value'] = selectFile['value'];
};
var checkBtnStatus = function () {
    if (currentFile.thisRev >= currentFile.versions.length - 1)
        undoBtn['disabled'] = true;
    else
        undoBtn['disabled'] = false;
    if (currentFile.thisRev <= 0)
        redoBtn['disabled'] = true;
    else
        redoBtn['disabled'] = false;
    console.log("Revision: ", currentFile.thisRev);
    console.log("Versions length: ", currentFile.versions.length);
};
var changeVersion = function (x) {
    currentFile.thisRev += x;
    textElement.innerHTML = currentFile.versions[currentFile.thisRev];
    checkBtnStatus();
};
var textElement = document.getElementById('content');
var precisionEl = document.getElementById('precision');
var undoBtn = document.getElementById('undoBtn');
var redoBtn = document.getElementById('redoBtn');
var saveBtn = document.getElementById('saveBtn');
var calcBtn = document.getElementById('calcBtn');
var deleteBtn = document.getElementById('deleteBtn');
var selectFile = document.getElementById('selectFile');
var newFilename = document.getElementById('filename');
var vars = [];
var filelist = [];
var currentFile;
//Execution
var regiFiles = localStorage.getItem('RegiTestFiles');
if (!regiFiles)
    localStorage.setItem('RegiTestFiles', '');
else
    filelist = regiFiles.split(',');
//Initial file loading
if (filelist[0]) {
    currentFile = JSON.parse(localStorage.getItem(filelist[0]));
    textElement.innerHTML = currentFile.versions[0];
    currentFile.thisRev = 0;
    newFilename['value'] = filelist[0];
    checkBtnStatus();
    console.log("Current file: ", currentFile);
}
updateFileList();
var precision = +precisionEl['value'];
calcBtn.addEventListener('click', calculate);
textElement.addEventListener('keypress', function (e) {
    if (e.keyCode == 10)
        calculate();
});
precisionEl.addEventListener('change', calculate);
undoBtn.addEventListener('click', function () { return changeVersion(1); });
redoBtn.addEventListener('click', function () { return changeVersion(-1); });
saveBtn.addEventListener('click', save);
deleteBtn.addEventListener('click', deleteFile);
selectFile.addEventListener('click', loadFile);
var testdata = {
    "Test 1": [
        "<div>1+2=</div>",
        "<div>1+2+3=</div>",
        "<div>1+2+3+4=</div>",
        "<div>1+2+3+4+5=</div>",
    ],
    "Test 2": [
        "<div>2*3=</div>",
        "<div>2*3*4=</div>",
        "<div>2*3*4*5=</div>",
        "<div>2*3*4*5*6=</div>",
    ]
};
var testResult = {
    "Test 1": [
        "<div></div><div><i>1+2 = 3</i></div>",
        "<div></div><div><i>1+2+3 = 6</i></div>",
        "<div></div><div><i>1+2+3+4 = 10</i></div>",
        "<div></div><div><i>1+2+3+4+5 = 15</i></div>",
    ],
    "Test 2": [
        "<div></div><div><i>2∙3 = 6</i></div>",
        "<div></div><div><i>2∙3∙4 = 24</i></div>",
        "<div></div><div><i>2∙3∙4∙5 = 120</i></div>",
        "<div></div><div><i>2∙3∙4∙5∙6 = 720</i></div>",
    ]
};
// for (let key in testdata) {
//     let i = 0;
//     testdata[key].forEach(x => {
//         textElement.innerHTML = x;
//         calculate()
//         textElement.innerHTML === testResult[key][i] ? console.log("Passed"): console.log(`Test #${1+(+i)} Failed. Result: ${textElement.innerHTML}`);
//         i++;
//     });
// }
// const testArr = [
//     "<div>1+2=</div>",
//     "<div>2*3=</div>",
//     "<div>(1+2)^3-(4*5)/6=</div>",
//     "<div>abc<b>=</b>12.3</div><div>def<b>=</b>45.6</div><div>abc+def=</div>",
//     "<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет депрессии при открытии скважины Хазри-2 объект 4</div><div>ρ&nbsp;<b>=</b>&nbsp;1.2</div><div>Глубина верха интервала перфорации:</div><div>Интервал_верх&nbsp;<b>=</b>&nbsp;4407</div><div><br></div><div>Давление гидростатики на глубине верха интервала:</div><div>Ph&nbsp;<b>=</b>&nbsp;ρ*Интервал_верх*1.423</div><div>Ph = 7525</div><div><br></div><div>Пластовое давление:</div><div>Pf&nbsp;<b>=</b>&nbsp;47.24*145</div><div>Pf = 6850</div><div><br></div><div>После замещения необходимо стравить давление на устье для депрессии 10 МПа:</div><div>Ph - Pf + 10*145 = 2126</div><div>В МПа:</div><div>(Ph - Pf)/145 + 10 = 14.7</div><div><br></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет объема замещения</div><div>Внутренний объем НКТ на 1 м:</div><div>0.063**2*0.785 = 0</div><div>Объем вытеснения при замещении на 300 м выше IRDV:</div><div>4177-300 = 3877</div><div>3877*0.003115 = 12.1</div><div>0.5*0.55 = 0.28</div>",
//     "<div></div><div></div><div></div><div></div><div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Volume calculations Khazri-2 zone 4</div><div>Liner_ID <b>=</b> 0.1524</div><div>Casing1_ID <b>=</b> 0.2262</div><div>Casing2_ID <b>=</b> 0.2168</div><div>Casing3_ID <b>=</b> 0.219</div><div>Packer_depth <b>=</b> 4778</div><div>Tubing_OD <b>=</b> 0.0889</div><div>Tubing_ID <b>=</b> 0.063</div><div>Well_volume <b>=</b> 0.785∙(Casing1_ID^2∙1098.19+Casing2_ID^2∙(3143.26-1098.19)+Casing3_ID^2∙(4221.24-3143.26)+Liner_ID^2∙(Packer_depth-4221.24))</div><div>Well_volume     = 170.3</div><div>Annulus_volume <b>=</b> Well_volume-0.785∙Tubing_OD^2∙Packer_depth</div><div>Annulus_volume    = 140.7</div><div>Tubing_volume <b>=</b> 0.785∙Tubing_ID^2∙Packer_depth</div><div>Tubing_volume    = 14.89</div><div><br></div>",
//     "<div>a<b>=</b><i>6+9</i></div>",
//     "<div></scalsmdlc>2+<ia>3+4</ia><ia>=</ia><iasd></iasd></div>",
//     "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Volume calculations Khazri-2 zone 4</div><div><b><i>Liner_ID = 0.154</i></b> | mm</div><div><b><i>Liner_ID*2 = 0.308</i></b> | mm</div><div><i>My simple text</i></div><div>sjdcksdnknk</div><div><b><i>Casing1_ID = 0.2262</i></b> | mm</div><div><b><i>Casing2_ID = 0.2168</i></b> | mm</div><div><b><i>Casing3_ID = 0.219</i></b> | mm</div><div><b><i>Packer_depth = 4778</i></b> | m</div><div><b><i>Tubing_OD = 0.0889</i></b> |&nbsp; mm</div><div><b><i>Tubing_ID = 0.063</i></b> |&nbsp; &nbsp; mm</div><div><br></div><div><b><i>Well_volume = 0.785∙(Casing1_ID^2∙1098.19+Casing2_ID^2∙(3143.26-1098.19)+Casing3_ID^2∙(4221.24-3143.26)+Liner_ID^2∙(Packer_depth-4221.24))</i></b> |&nbsp; &nbsp; some comments here</div><div><br></div><div><i>Well_volume = 170.5</i> | m3</div><div><br></div><div><b><i>Annulus_volume = Well_volume-0.785∙Tubing_OD^2∙Packer_depth</i></b></div><div><br></div><div><i>Annulus_volume = 140.9</i> | any comments here</div><div><b><i>Tubing_volume = 0.785∙Tubing_ID^2∙Packer_depth</i></b></div><div><i>Tubing_volume = 14.89</i></div><div><br></div>",
// ]
// const resultsArr = [
//     "<div></div><div><i>1+2 = 3</i></div>",
//     "<div></div><div><i>2∙3 = 6</i></div>",
//     "<div></div><div><i>(1+2)^3-(4∙5)/6 = 23.67</i></div>",
//     "<div></div><div><b><i>abc = 12.3</i></b></div><div><b><i>def = 45.6</i></b></div><div><i>abc+def = 57.9</i></div>",
//     "<div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет депрессии при открытии скважины Хазри-2 объект 4</div><div><b><i>ρ = 1.2</i></b></div><div>Глубина верха интервала перфорации:</div><div><b><i>Интервал_верх = 4407</i></b></div><div><br></div><div>Давление гидростатики на глубине верха интервала:</div><div><b><i>Ph = ρ∙Интервал_верх∙1.423</i></b></div><div><i>Ph = 7525</i></div><div><br></div><div>Пластовое давление:</div><div><b><i>Pf = 47.24∙145</i></b></div><div><i>Pf = 6850</i></div><div><br></div><div>После замещения необходимо стравить давление на устье для депрессии 10 МПа:</div><div><i>Ph-Pf+10∙145 = 2126</i></div><div>В МПа:</div><div><i>(Ph-Pf)/145+10 = 14.66</i></div><div><br></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет объема замещения</div><div>Внутренний объем НКТ на 1 м:</div><div><i>0.063^2∙0.785 = 0.003116</i></div><div>Объем вытеснения при замещении на 300 м выше IRDV:</div><div><i>4177-300 = 3877</i></div><div><i>3877∙0.003115 = 12.08</i></div><div><i>0.5∙0.55 = 0.275</i></div>",
//     "<div></div><div></div><div></div><div></div><div></div><div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Volume calculations Khazri-2 zone 4</div><div><b><i>Liner_ID = 0.1524</i></b></div><div><b><i>Casing1_ID = 0.2262</i></b></div><div><b><i>Casing2_ID = 0.2168</i></b></div><div><b><i>Casing3_ID = 0.219</i></b></div><div><b><i>Packer_depth = 4778</i></b></div><div><b><i>Tubing_OD = 0.0889</i></b></div><div><b><i>Tubing_ID = 0.063</i></b></div><div><b><i>Well_volume = 0.785∙(Casing1_ID^2∙1098.19+Casing2_ID^2∙(3143.26-1098.19)+Casing3_ID^2∙(4221.24-3143.26)+Liner_ID^2∙(Packer_depth-4221.24))</i></b></div><div><i>Well_volume = 170.3</i></div><div><b><i>Annulus_volume = Well_volume-0.785∙Tubing_OD^2∙Packer_depth</i></b></div><div><i>Annulus_volume = 140.7</i></div><div><b><i>Tubing_volume = 0.785∙Tubing_ID^2∙Packer_depth</i></b></div><div><i>Tubing_volume = 14.89</i></div><div><br></div>",
//     "<div></div><div><b><i>a = 6+9</i></b></div>",
//     "<div></div><div><i>2+3+4 = 9</i></div>",
//     "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Volume calculations Khazri-2 zone 4</div><div><b><i>Liner_ID = 0.154</i></b> | mm</div><div><b><i>Liner_ID*2 = 0.308</i></b> | mm</div><div><i>My simple text</i></div><div>sjdcksdnknk</div><div><b><i>Casing1_ID = 0.2262</i></b> | mm</div><div><b><i>Casing2_ID = 0.2168</i></b> | mm</div><div><b><i>Casing3_ID = 0.219</i></b> | mm</div><div><b><i>Packer_depth = 4778</i></b> | m</div><div><b><i>Tubing_OD = 0.0889</i></b> |&nbsp; mm</div><div><b><i>Tubing_ID = 0.063</i></b> |&nbsp; &nbsp; mm</div><div><br></div><div><b><i>Well_volume = 0.785∙(Casing1_ID^2∙1098.19+Casing2_ID^2∙(3143.26-1098.19)+Casing3_ID^2∙(4221.24-3143.26)+Liner_ID^2∙(Packer_depth-4221.24))</i></b> |&nbsp; &nbsp; some comments here</div><div><br></div><div><i>Well_volume = 170.5</i> | m3</div><div><br></div><div><b><i>Annulus_volume = Well_volume-0.785∙Tubing_OD^2∙Packer_depth</i></b></div><div><br></div><div><i>Annulus_volume = 140.9</i> | any comments here</div><div><b><i>Tubing_volume = 0.785∙Tubing_ID^2∙Packer_depth</i></b></div><div><i>Tubing_volume = 14.89</i></div><div><br></div>"
// ]
// for (let key in testArr) {
//     textElement.innerHTML = testArr[key];
//     calculate()
//     textElement.innerHTML === resultsArr[key] ? console.log("Passed"): console.log(`Test #${1+(+key)} Failed. Result: ${textElement.innerHTML}`);
// }
// add automatic testing+
// add option for comments on the same line +
// add function for cleaning tags through regExp pattern+
// add bootstrap
// add undo and redo features +
// make saving to localstorage through JSON format. +
//improve security by removing all <>
// add menu with greek and special symbols
// add html Math representation
