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
    console.log('String to evaluate: ', str);
    for (let i = 0; i <str.length; i++) {
        let index = varsNames.indexOf(str[i]);
        
        if (index != -1) {
            str = str.replace(str[i], `(${vars[index].exp})`);
            // console.log(`Expression: ${str}`);
            i = -1;
        }
    }
    return eval(str);
}

const createVariable = (str: string) => {
    let name = str.replace(/ /gi, '').split('=')[0];
    let exp = str.replace(/ /gi, '').split('=')[1];
    let varsNames = vars.map(x => x.name)
    if (varsNames.includes(name)) {
        let index = varsNames.indexOf(name);
        vars[index].exp = exp;
    } 
    else {
        let v = new Variable(name, exp);
        vars.push(v);
    }
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
    console.log(`Vars: ${vars.map(v => v.name +'=' + v.exp + '=' + v.result)}`);
}

const processLine = (line:string) => {
    if (line.indexOf('=') === -1) return line
    let lineArr = line.split('=');
    if (lineArr[0].search(/[\+\-\*]/) === -1) {
        console.log("не встречается плюс!");
        
        createVariable(line);
        return line;
    }
    else {
        console.log('lineArr[0]:', lineArr[0]);
        
        return `${lineArr[0]} = ${evaluate(lineArr[0])}`;
    }
}

let textElement = document.getElementById('content');
const calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate)
textElement.addEventListener('keypress', (e) => {
    console.log(e.keyCode);
    
    if (e.keyCode == 10) calculate()
})
