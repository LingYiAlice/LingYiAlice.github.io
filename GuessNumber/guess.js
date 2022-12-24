const input = document.querySelector('.num-input');
const btnAll = document.querySelectorAll('.btn-num');
const btnEnter = document.querySelector('.enter');
const btnReset = document.querySelector('.reset');
const span = document.querySelector('span');
const p = document.querySelector('p');


let min = 1;
let max = 100;
p.innerText = `${min} ~ ${max}`;
let password = GetRandom(min,max);

//#region GetBtnNum
btnAll.forEach((btnNum)=> {
    btnNum.addEventListener('click',(btn) => {
        input.value += btn.target.innerText;
        console.log(input.value)
    })
})
//#endregion

//#region GuessBtn
btnEnter.addEventListener('click',function(){    
    if(input.value == ""){
        span.innerText =  '請輸入數字';
    }
    else {
        Check(input.value);
        input.value = "";
    }   
    
})
//#endregion

//#region ResetBtn
btnReset.addEventListener('click',function(){
    history.go(0);
})
//#endregion

//#region Function
function Check(input){
    let guess = parseInt(input, 10);
    console.log("password:"+password);
    console.log("guess:"+guess);
    if(guess <= min || guess >= max){
        span.innerText = '!超過範圍!重新輸入!';
    }
    else if( guess < password){
        span.innerText = "";
        min = guess;
        p.innerText = `${min} ~ ${max}` ;
    }
    else if( guess > password){
        span.innerText = "";
        max = guess;
        p.innerText = `${min} ~ ${max}` ;
    }
    else{
        p.innerText = "";
        span.innerText = `BOOM! 終極密碼是 ${password}`;
        btnAll.forEach((btn) => {
            btn.disabled = true;
        })
        btnEnter.disabled = true;
        BlockPic()
    }
}

function BlockPic(){
    let picFull = document.querySelector('.pic-full')
    let exit = document.querySelector('.exit')
    picFull.style.display="block";
    exit.addEventListener('click',function(){
        picFull.style.display="none";
    })
}

function GetRandom(min, max) {
    let ran = Math.floor(Math.random() * (max - min) ) + min;
    if(ran <= 1){
        return ran + 1;
    }
    return ran;
}
//#endregion