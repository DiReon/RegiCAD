class Variable {
    name: string;
    exp: string;
    constructor(name: string, exp: string) {
        this.name = name;
        this.exp = exp;
    }
    get result() {
        return regiRound(evaluate(this.exp), precision);
    }
}

const evaluate = (str: string) => {
    let varsNames = vars.map(x => x.name);
    str = replaceByStars(str);
    let strArr = str.replace(/ |;/gi, '').split(/[\+\-\**\*\/\(\)]/gi);
    
    for (let i = 0; i <strArr.length+1; i++) {
        let index = varsNames.indexOf(strArr[i]);
        if (index != -1) {
            str = str.replace(strArr[i], `(${vars[index].exp})`).replace(/ /gi, '');
            strArr = str.replace(/[\(\)]/gi, '').split(/[\+\-\**\*\/)\(\)]/gi);
            i = -1;
        }
    }
    return regiRound(eval(str), precision);
}

const createVariable = (str: string) => {
    str = replaceByStars(str);
    let name = str.replace(/ |;|&nbsp/gi, '').split('<b>=</b>')[0].replace(/|(<*>)/gi, '');
    let exp = str.replace(/ |;|&nbsp/gi, '').split('<b>=</b>')[1].replace(/|(<*>)/gi, '');
    let varsNames = vars.map(x => x.name)
    if (varsNames.includes(name)) {
        let index = varsNames.indexOf(name);
        vars.splice(index, 1);
    } 
    let v = new Variable(name, exp);
    vars.push(v);
    return v;

}

const calculate = () => {
    vars = [];
    let content = textElement.innerHTML.replace(/<\/div>/gi, '');
    let contentArr = content.split('<div>');
    let temp: string[] = [];
    for (let line in contentArr) {
        temp.push(processLine(contentArr[line]));
    }
    textElement.innerHTML = '';
    for (let line in temp) {
        textElement.innerHTML +=`<div>${temp[line]}</div>`;
    }
    save()
}

const processLine = (line:string) => {
    if (line.indexOf('=') === -1) return line
    if (line.replace(/;|&nbsp/gi, '').includes('<b>=</b>')) {
        let v = createVariable(line);
        return `${v.name} <b>=</b> ${replaceStars(v.exp)}` ;
    }
    else {
        let lineArr = line.split('=');
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

const save = () => {
    localStorage.setItem(newFilename.value, textElement.innerHTML);
    if (filelist.indexOf(newFilename.value) ===-1) {
        filelist.unshift(newFilename.value);
        localStorage.setItem('RegiCADfiles', filelist.join());
    }
    updateFileList();
}

const deleteFile = () => {
    let filename = selectFile.value;
    localStorage.removeItem(filename);
    let index = filelist.indexOf(filename);
    filelist.splice(index, 1);
    localStorage.removeItem('RegiCADfiles');
    localStorage.setItem('RegiCADfiles', filelist.join());
    updateFileList();
}

const updateFileList = () => {
    while (selectFile.children.length>0) selectFile.removeChild(selectFile.children[0]);
    filelist.forEach(file => {
        let option = document.createElement('option');
        option.innerHTML = file;
        selectFile.appendChild(option);
    });
}

const loadFile = () => {
    textElement.innerHTML = localStorage.getItem(selectFile.value);
    newFilename.value = selectFile.value;
}

const textElement = document.getElementById('content');
const precisionEl: HTMLInputElement = document.getElementById('precision');
const saveBtn = document.getElementById('saveBtn');
const calcBtn = document.getElementById('calcBtn');
const deleteBtn = document.getElementById('deleteBtn');
let selectFile = document.getElementById('selectFile');
let newFilename = document.getElementById('filename');

let vars: Variable[] = [];

let filelist = [];
let regiFiles = localStorage.getItem('RegiCADfiles');
if (regiFiles) filelist = regiFiles.split(',');
let lastFile = filelist[0];
if (lastFile) {
   textElement.innerHTML = localStorage.getItem(lastFile);
   newFilename.value = lastFile;
   
}
updateFileList();

let precision = +precisionEl.value;
calcBtn.addEventListener('click', calculate)
textElement.addEventListener('keypress', (e) => {
    if (e.keyCode == 10) calculate()
})
precisionEl.addEventListener('change', calculate)
saveBtn.addEventListener('click', save)
deleteBtn.addEventListener('click', deleteFile)
selectFile.addEventListener('click', loadFile)

//Testing.....
const testArr = [
    "<div>1+2=</div>",
    "<div>2*3=</div>",
    "<div>(1+2)^3-(4*5)/6=</div>",
    "<div>abc<b>=</b>12.3</div><div>def<b>=</b>45.6</div><div>abc+def=</div>",
    "<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет депрессии при открытии скважины Хазри-2 объект 4</div><div>ρ&nbsp;<b>=</b>&nbsp;1.2</div><div>Глубина верха интервала перфорации:</div><div>Интервал_верх&nbsp;<b>=</b>&nbsp;4407</div><div><br></div><div>Давление гидростатики на глубине верха интервала:</div><div>Ph&nbsp;<b>=</b>&nbsp;ρ*Интервал_верх*1.423</div><div>Ph = 7525</div><div><br></div><div>Пластовое давление:</div><div>Pf&nbsp;<b>=</b>&nbsp;47.24*145</div><div>Pf = 6850</div><div><br></div><div>После замещения необходимо стравить давление на устье для депрессии 10 МПа:</div><div>Ph - Pf + 10*145 = 2126</div><div>В МПа:</div><div>(Ph - Pf)/145 + 10 = 14.7</div><div><br></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет объема замещения</div><div>Внутренний объем НКТ на 1 м:</div><div>0.063**2*0.785 = 0</div><div>Объем вытеснения при замещении на 300 м выше IRDV:</div><div>4177-300 = 3877</div><div>3877*0.003115 = 12.1</div><div>0.5*0.55 = 0.28</div>",
    "<div></div><div></div><div></div><div></div><div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Volume calculations Khazri-2 zone 4</div><div>Liner_ID <b>=</b> 0.1524</div><div>Casing1_ID <b>=</b> 0.2262</div><div>Casing2_ID <b>=</b> 0.2168</div><div>Casing3_ID <b>=</b> 0.219</div><div>Packer_depth <b>=</b> 4778</div><div>Tubing_OD <b>=</b> 0.0889</div><div>Tubing_ID <b>=</b> 0.063</div><div>Well_volume <b>=</b> 0.785∙(Casing1_ID^2∙1098.19+Casing2_ID^2∙(3143.26-1098.19)+Casing3_ID^2∙(4221.24-3143.26)+Liner_ID^2∙(Packer_depth-4221.24))</div><div>Well_volume     = 170.3</div><div>Annulus_volume <b>=</b> Well_volume-0.785∙Tubing_OD^2∙Packer_depth</div><div>Annulus_volume    = 140.7</div><div>Tubing_volume <b>=</b> 0.785∙Tubing_ID^2∙Packer_depth</div><div>Tubing_volume    = 14.89</div><div><br></div>"


]
const resultsArr = [
    "<div></div><div>1+2 = 3</div>",
    "<div></div><div>2∙3 = 6</div>",
    "<div></div><div>(1+2)^3-(4∙5)/6 = 23.67</div>",
    "<div></div><div>abc <b>=</b> 12.3</div><div>def <b>=</b> 45.6</div><div>abc+def = 57.9</div>",
    "<div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет депрессии при открытии скважины Хазри-2 объект 4</div><div>ρ <b>=</b> 1.2</div><div>Глубина верха интервала перфорации:</div><div>Интервал_верх <b>=</b> 4407</div><div><br></div><div>Давление гидростатики на глубине верха интервала:</div><div>Ph <b>=</b> ρ∙Интервал_верх∙1.423</div><div>Ph  = 7525</div><div><br></div><div>Пластовое давление:</div><div>Pf <b>=</b> 47.24∙145</div><div>Pf  = 6850</div><div><br></div><div>После замещения необходимо стравить давление на устье для депрессии 10 МПа:</div><div>Ph - Pf + 10∙145  = 2126</div><div>В МПа:</div><div>(Ph - Pf)/145 + 10  = 14.66</div><div><br></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Расчет объема замещения</div><div>Внутренний объем НКТ на 1 м:</div><div>0.063^2∙0.785  = 0.003116</div><div>Объем вытеснения при замещении на 300 м выше IRDV:</div><div>4177-300  = 3877</div><div>3877∙0.003115  = 12.08</div><div>0.5∙0.55  = 0.275</div>",
    "<div></div><div></div><div></div><div></div><div></div><div></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Volume calculations Khazri-2 zone 4</div><div>Liner_ID <b>=</b> 0.1524</div><div>Casing1_ID <b>=</b> 0.2262</div><div>Casing2_ID <b>=</b> 0.2168</div><div>Casing3_ID <b>=</b> 0.219</div><div>Packer_depth <b>=</b> 4778</div><div>Tubing_OD <b>=</b> 0.0889</div><div>Tubing_ID <b>=</b> 0.063</div><div>Well_volume <b>=</b> 0.785∙(Casing1_ID^2∙1098.19+Casing2_ID^2∙(3143.26-1098.19)+Casing3_ID^2∙(4221.24-3143.26)+Liner_ID^2∙(Packer_depth-4221.24))</div><div>Well_volume      = 170.3</div><div>Annulus_volume <b>=</b> Well_volume-0.785∙Tubing_OD^2∙Packer_depth</div><div>Annulus_volume     = 140.7</div><div>Tubing_volume <b>=</b> 0.785∙Tubing_ID^2∙Packer_depth</div><div>Tubing_volume     = 14.89</div><div><br></div>"

]
for (let key in testArr) {
    textElement.innerHTML = testArr[key];
    calculate()
    textElement.innerHTML === resultsArr[key] ? console.log("Passed"): console.log("Failed");
}

// add automatic testing
// add option for comments on the same line
// add function for cleaning tags through regExp pattern
// add bootstrap
// 