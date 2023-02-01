//dom
const input = document.querySelector('.input')
const addBtn = document.getElementById('add')
const listArea = document.querySelector('.list')

//宣告
let todoKey ='todoItem' //localStorage-Key
let todoList = []       //for localStorage
let clickCount = 0           //計算點擊次數

//function
function renderData() {
    if (localStorage.getItem(todoKey) != null) {
        let list = ""
        todoList = JSON.parse(localStorage.getItem(todoKey))
        todoList.forEach( (item, idx) => {
            list += `<li>
                    <input type="checkbox" id="box">
                    <label for="box" class="line"></label>
                    <input type="text" for="box" id="todoItem" value="${item.item}" data-num=${idx} disabled>
                    <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-outline-warning ms-2" id="edit" data-num=${idx}>Edit</button>
                    <button type="button" class="btn btn-outline-danger ms-2" id="del" data-num=${idx}>Del</button>
                    </div>
                    </li>`;
        });

        //顯示在畫面上
        listArea.innerHTML = list;

        //編輯
        let editBtns = document.querySelectorAll('#edit')
        editBtns.forEach( editBtn => {
            editBtn.addEventListener('click', function(e){
                console.log(`editBtn : ${e.target}`)
                editTodoItem(e.target)

                //冒泡處理
                e.stopPropagation()
            })
        })

        //刪除
        let delBtns = document.querySelectorAll('#del')
        delBtns.forEach( delBtn => {
            delBtn.addEventListener('click', function(e){
                console.log(`delBtn : ${e.target}`)
                delTodoItem(e.target)

                //冒泡處理
                e.stopPropagation()
            })
        })

    } 
    input.value = "";

}

// 新增
function addTodoItem(){
    if (input.value == "") {
        alert("!還沒輸入待辦事項啦!");
    }
    else{
            
        let todoObj = {
            item: input.value
        }
        //localStorage
        if (localStorage.getItem(todoKey) == null) {
            todoList.push(todoObj)
        } 
        else {
            todoList = JSON.parse(localStorage.getItem(todoKey))
            todoList.push(todoObj)
        }
        localStorage.setItem(todoKey, JSON.stringify(todoList))
    }
    renderData()
}

//修改
function editTodoItem(btn){
    console.log("edit()")
    console.log(btn)
    clickCount++
    console.log(`次數: ${clickCount}`)

    let inputs = document.querySelectorAll('#todoItem')
        inputs.forEach( inputItem => {

            //按鈕變換,target跟input的data-num比對
            if( inputItem.dataset.num == btn.dataset.num && clickCount % 2 == 1){
                inputItem.disabled = false
                btn.innerText = "Save"
                btn.classList.remove("btn-outline-warning");
                btn.classList.add('btn-outline-success')
            }
            else if(inputItem.dataset.num == btn.dataset.num && clickCount % 2 == 0){
                if(inputItem.value == ""){
                    alert("要變更的待辦事項還沒輸入喔!");
                    return clickCount--
                }
                else{
                    //localStorage
                    todoList = JSON.parse(localStorage.getItem(todoKey))
                    todoList[btn.dataset.num] = {
                        item: inputItem.value
                    }
                    localStorage.setItem(todoKey, JSON.stringify(todoList))
                    renderData()
                }

                inputItem.disabled = true
                btn.innerText = "Edit"
                btn.classList.remove('btn-outline-success')
                btn.classList.add("btn-outline-warning");
            }
        })
    

}

//刪除
function delTodoItem(btn){
    console.log("del")
    console.log(btn)
    //localStorage
    todoList = JSON.parse(localStorage.getItem(todoKey))
    console.log(`todoList :${todoList}`)
    console.log(`btn.dataset.num :${btn.dataset.num}`)
    //第data-num筆
    todoList.splice(btn.dataset.num, 1)
    localStorage.setItem(todoKey, JSON.stringify(todoList))
    renderData()
}


window.onload = function(){
    renderData() 
    // 新增
    addBtn.addEventListener("click", function () {
        addTodoItem()
})
}