const start = document.querySelector(".start");
const reset = document.querySelector(".reset");
const answer = document.querySelector(".answer");
const show = document.querySelector('.show')  
const input = document.querySelector("input");
const guess = document.querySelector(".guess");
let password = ""; 


window.onload = function() {

    reset.disabled = true;
    answer.disabled = true;
    guess.disabled = true;

    start.addEventListener('click',getRandom)
    reset.addEventListener('click',function() {
        history.go(0);
        start.disabled = false;
    })
    answer.addEventListener('click',function(){
        alert(`答案是: ${password}`)
    })
    guess.addEventListener('click',function(){
        if(isNaN(input.value) || input.value.length != 4){
            alert('請輸入不重複的四位數字');
            input.value = "";
        }
        else {
            judge(input.value);
            input.value = "";
        }  
    })
}

//#region random
function getRandom() {
    start.disabled = true;
    while(password.length < 4){
        let num = Math.floor(Math.random() * 10);
        if(!password.includes(num)){
            password += num;
        }
    }
    reset.disabled = false;
    answer.disabled = false;
    guess.disabled = false;
}
//#endregion

//#region judge
function judge(){
    let psArr = [];
    let gsArr =[];
    let A = 0;
    let B = 0; 
    for(let i = 0; i < 4; i++){
        //密碼轉字元
        console.log(password)
        let pnum = password.charAt(i)
        psArr.push(pnum)
        console.log(psArr)
        
        //猜數字轉字元
        console.log('gsarr')
        let gnum = input.value.charAt(i)
        gsArr.push(gnum)
    }
    // console.log(psArr)
    // console.log(gsArr)

    for(let i = 0; i < psArr.length; i++){
        // console.log(` ${psArr[i] } : ${gsArr[i]}`)
        if(psArr[i] == gsArr[i]){
            A++;
            // console.log(`A : ${A}`)
        }
        else if(psArr.includes(gsArr[i])){
            B++;
            // console.log(`B : ${B}`)
        }
    }


    if( A == 4 ){
        let record = document.createElement('div');
        record.innerHTML = `<span class="color">${A} A ${B} B</span> <span>${input.value}</span>`;
        show.appendChild(record);
        let color = document.querySelector(".color")
        color.setAttribute('style','background-color: #ABFFAB;')
        console.log(color)
        alert(`過關!`)
    }
    else{
        let record = document.createElement('div');
        record.innerHTML = `<span>${A} A ${B} B</span> <span>${input.value}</span>`;
        show.appendChild(record);
    }
}
//#endregion
