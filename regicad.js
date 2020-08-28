var vars = [];
var Variable = /** @class */ (function () {
    function Variable(name, exp) {
        this.name = name;
        this.exp = exp;
    }
    Object.defineProperty(Variable.prototype, "result", {
        get: function () {
            console.log("this.exp: ", this.exp);
            return evaluate(this.exp);
        },
        enumerable: true,
        configurable: true
    });
    return Variable;
}());
var evaluate = function (str) {
    var varsNames = vars.map(function (x) { return x.name; });
    console.log('String to evaluate: ', str); //Here need to brake string into array and check for every array element
    var strArr = str.replace(/ |;/gi, '').split(/[\+\-\**\*\/]/gi);
    console.log("Array to evaluate: ", strArr);
    for (var i = 0; i < strArr.length + 1; i++) {
        var index = varsNames.indexOf(strArr[i]);
        console.log("Index: ", index, "i: ", i, "srtArr.length: ", strArr.length);
        if (index != -1) {
            str = str.replace(strArr[i], "(" + vars[index].exp + ")").replace(/ /gi, '');
            strArr = str.replace(/[\(\)]/gi, '').split(/[\+\-\**\*\/)\(\)]/gi);
            console.log("Expression: " + str + ", strArr: " + strArr);
            i = -1;
        }
    }
    return eval(str);
};
var createVariable = function (str) {
    var name = str.replace(/ |;|&nbsp/gi, '').split('<b>=</b>')[0];
    var exp = str.replace(/ |;|&nbsp/gi, '').split('<b>=</b>')[1];
    var varsNames = vars.map(function (x) { return x.name; });
    if (varsNames.includes(name)) {
        var index = varsNames.indexOf(name);
        vars.splice(index, 1);
    }
    var v = new Variable(name, exp);
    vars.push(v);
    console.log("Vars: " + vars.map(function (v) { return v.name + '=' + v.exp + '=' + v.result; }));
    return v;
};
var calculate = function () {
    vars = [];
    var content = textElement.innerHTML.replace(/<\/div>/gi, '');
    var contentArr = content.split('<div>');
    console.log(contentArr);
    var temp = [];
    for (var line in contentArr) {
        temp.push(processLine(contentArr[line]));
    }
    textElement.innerHTML = '';
    for (var line in temp) {
        textElement.innerHTML += "<div>" + temp[line] + "</div>";
    }
};
var processLine = function (line) {
    if (line.indexOf('=') === -1)
        return line;
    if (line.replace(/;|&nbsp/gi, '').includes('<b>=</b>')) {
        console.log("This is variable declaration...");
        var v = createVariable(line);
        return v.name + " <b>=</b> " + v.exp;
    }
    else {
        var lineArr = line.split('=');
        console.log('This is equation, lineArr[0]:', lineArr[0]);
        return lineArr[0] + " = " + evaluate(lineArr[0]);
    }
};
var textElement = document.getElementById('content');
var calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate);
textElement.addEventListener('keypress', function (e) {
    if (e.keyCode == 10)
        calculate();
});
