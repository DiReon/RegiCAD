// import { evaluate } from "./regicad";

const createLine = () => {
    let elem = document.createElement('span');
    elem.innerHTML = "Hello"
    document.body.appendChild(elem);
    console.log("Element created");
    return null;
}
const calculate =() =>{
    console.log(content.innerHTML);
    console.log(evaluate(content.innerHTML));
    
}
//document.body.onclick = createLine();
// document.body.contentEditable = "true";
let content = document.getElementById('content');
const calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', calculate)