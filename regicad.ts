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
        return evaluate(this.exp);
    }
}

const evaluate = (str: string) => {
    let varsNames = vars.map(x => x.name);
    console.log('String to evaluate: ', str); //Here need to brake string into array and check for every array element
    let strArr = str.replace(/ /gi, '').split(/[\+\-\**\*\/]/gi);
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
    return eval(str);
}

const createVariable = (str: string) => {
    let name = str.replace(/ /gi, '').split('==')[0];
    let exp = str.replace(/ /gi, '').split('==')[1];
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
    let content = textElement.innerHTML.replace(/<\/div>|<br>/gi, '');
    console.log("Content: ", content);
    let contentArr = content.split('<div>');
    console.log(contentArr);
    let temp: string[] = [];
    let i = 0;
    for (let line in contentArr) {
        temp.push(processLine(contentArr[line]));
    }
    textElement.innerHTML = ''
    for (let line in temp) {
        textElement.innerHTML +=`<div>${temp[line]}</div>`
    }
}

const processLine = (line:string) => {
    if (line.indexOf('=') === -1) return line
    if (line.includes('==')) {
        console.log("This is vaariable declaration...");
        let v = createVariable(line);
        return `${line}` ;
    }
    else {
        let lineArr = line.split('=');
        console.log('lineArr[0]:', lineArr[0]);
        return `${lineArr[0]} = ${evaluate(lineArr[0])}`;
    }
}

let textElement = document.getElementById('content');
const calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate)
textElement.addEventListener('keypress', (e) => {
    if (e.keyCode == 10) calculate()
})
