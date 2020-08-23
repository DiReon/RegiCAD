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
    console.log('String to evaluate: ', str);
    for (var i = 0; i < str.length; i++) {
        var index = varsNames.indexOf(str[i]);
        if (index != -1) {
            str = str.replace(str[i], "(" + vars[index].exp + ")");
            // console.log(`Expression: ${str}`);
            i = -1;
        }
    }
    return eval(str);
};
var createVariable = function (str) {
    var name = str.replace(/ /gi, '').split('=')[0];
    var exp = str.replace(/ /gi, '').split('=')[1];
    var varsNames = vars.map(function (x) { return x.name; });
    if (varsNames.includes(name)) {
        var index = varsNames.indexOf(name);
        vars[index].exp = exp;
    }
    else {
        var v = new Variable(name, exp);
        vars.push(v);
    }
};
var calculate = function () {
    vars = [];
    var content = textElement.innerHTML.replace(/<\/div>|<br>/gi, '');
    console.log("Content: ", content);
    var contentArr = content.split('<div>');
    console.log(contentArr);
    var temp = [];
    var i = 0;
    for (var line in contentArr) {
        temp.push(processLine(contentArr[line]));
    }
    textElement.innerHTML = '';
    for (var line in temp) {
        textElement.innerHTML += "<div>" + temp[line] + "</div>";
    }
    console.log("Vars: " + vars.map(function (v) { return v.name + '=' + v.exp + '=' + v.result; }));
};
var processLine = function (line) {
    if (line.indexOf('=') === -1)
        return line;
    var lineArr = line.split('=');
    if (lineArr[0].search(/[\+\-\*]/) === -1) {
        console.log("не встречается плюс!");
        createVariable(line);
        return line;
    }
    else {
        console.log('lineArr[0]:', lineArr[0]);
        return lineArr[0] + " = " + evaluate(lineArr[0]);
    }
};
var textElement = document.getElementById('content');
var calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate);
textElement.addEventListener('keypress', function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 10)
        calculate();
});
