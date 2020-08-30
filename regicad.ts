let vars: Variable[] = [];

class Variable {
    name: string;
    exp: string;
    constructor(name: string, exp: string) {
        this.name = name;
        this.exp = exp;
    }
    get result() {
        console.log("this.exp: ", this.exp)
        return regiRound(evaluate(this.exp), precision);
    }
}

const evaluate = (str: string) => {
    let varsNames = vars.map(x => x.name);
    str = replaceByStars(str);
    console.log('String to evaluate: ', str); //Here need to brake string into array and check for every array element
    let strArr = str.replace(/ |;/gi, '').split(/[\+\-\**\*\/\(\)]/gi);
    console.log("Array to evaluate: ", strArr);
    
    for (let i = 0; i <strArr.length+1; i++) {
        
        let index = varsNames.indexOf(strArr[i]);
        console.log("Index: ", index, "i: ", i, "srtArr.length: ", strArr.length);
        
        if (index != -1) {
            str = str.replace(strArr[i], `(${vars[index].exp})`).replace(/ /gi, '');
            strArr = str.replace(/[\(\)]/gi, '').split(/[\+\-\**\*\/)\(\)]/gi);
            console.log(`Expression: ${str}, strArr: ${strArr}`);
            i = -1;
        }
    }
    console.log("String before eval: ", str, " precision: ", precision, "result: ", eval(str));
    
    return regiRound(eval(str), precision);
}

const createVariable = (str: string) => {
    str = replaceByStars(str);
    let name = str.replace(/ |;|&nbsp/gi, '').split('<b>=</b>')[0];
    let exp = str.replace(/ |;|&nbsp/gi, '').split('<b>=</b>')[1];
    let varsNames = vars.map(x => x.name)
    if (varsNames.includes(name)) {
        let index = varsNames.indexOf(name);
        vars.splice(index, 1);
    } 
    let v = new Variable(name, exp);
    vars.push(v);
    console.log(`Vars: ${vars.map(v => v.name +'=' + v.exp + '=' + v.result)}`);
    return v;

}

const calculate = () => {
    vars = [];
    let content = textElement.innerHTML.replace(/<\/div>/gi, '');
    let contentArr = content.split('<div>');
    console.log(contentArr);
    let temp: string[] = [];
    for (let line in contentArr) {
        temp.push(processLine(contentArr[line]));
    }
    textElement.innerHTML = '';
    for (let line in temp) {
        textElement.innerHTML +=`<div>${temp[line]}</div>`;
    }
}

const processLine = (line:string) => {
    if (line.indexOf('=') === -1) return line
    if (line.replace(/;|&nbsp/gi, '').includes('<b>=</b>')) {
        console.log("This is variable declaration...:", line);
        let v = createVariable(line);
        return `${v.name} <b>=</b> ${replaceStars(v.exp)}` ;
    }
    else {
        let lineArr = line.split('=');
        console.log('This is equation, lineArr[0]:', lineArr[0]);
        return `${replaceStars(lineArr[0])} = ${evaluate(lineArr[0])}`;
    }
}

function regiRound (num: number, k: number) {
    if (num > 1000) return Math.round(num);
    let numArr = num.toString().split('.');
    if (numArr[1] == undefined) return num;
    let i = numArr[0].length;
    let j = numArr[1].length - (+numArr[1]).toString().length;
    if (i > 1||undefined) return Math.round(num*(10**(k-i)))/(10**(k-i));
    else return Math.round(num*(10**(k+j)))/(10**(k+j));
}

const replaceByStars = (str: string) => {
    return str.replace(/\^/gi, '**').replace(/∙/gi, '*');
}

const replaceStars = (str:string) => {
    return str.replace(/\*\*/gi, '^').replace(/\*/gi, '∙');
}

let textElement = document.getElementById('content');
let precisionEl = document.getElementById('precision');
let precision = +precisionEl.value;
console.log(precision);

const calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate)
textElement.addEventListener('keypress', (e) => {
    if (e.keyCode == 10) calculate()
})
precisionEl.addEventListener('change', calculate)
//•

