//dom
const input = document.querySelector('.input')
const addBtn = document.getElementById('add')
const listArea = document.querySelector('.list')
// let checkBoxs = document.querySelectorAll('.check')

//宣告
let todoKey ='todoItem' //localStorage-Key
let todoList = []       //localStorage

//function
function renderData() {
    if (localStorage.getItem(todoKey) != null) {
        let list = ""
        todoList = JSON.parse(localStorage.getItem(todoKey))
        todoList.forEach( (item, idx) => {
            list += `<li class="todo">
                        <input class="check" type="checkbox" id="box_${idx}" data-state=${item.done}>
                        <label>
                        <span class="line"></span>
                        <input type="text" id="todoItem_${idx}" value="${item.item}" data-num=${idx} disabled></label>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-outline-warning ms-2" data-num=${idx}>Edit</button>
                            <button type="button" class="btn btn-outline-danger ms-2" data-bs-toggle="modal" data-bs-target="#del${idx}">Del</button>
                        </div>
                        <!-- Modal -->
                        <div class="modal fade" id="del${idx}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="delTitle${idx}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h2 class="modal-title fs-5" id="delTitle${idx}">確定刪除?</h2>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        確定刪除此代辦事項：${item.item} 
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" data-num=${idx}>Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>`
            });
        //顯示在畫面上
        listArea.innerHTML = list;

        let todo = listArea.querySelectorAll('.todo')
        console.dir(todo)
        todo.forEach( item => {
            let isCheck = item.querySelector('.check').getAttribute('data-state')
            if(isCheck == 'yes') 
            {
                item.children[1].children[0].classList.add('d-block')
                item.children[0].checked = true
            }
            item.addEventListener('click',function(e){
                let target = e.target
                let inputItem = item.children[1].children[1]
                let checkbox = item.children[0]
                if(target.textContent == 'Edit'){
                    checkbox.disabled = true
                    inputItem.disabled = false
                    target.innerText = "Save"
                    target.classList.remove("btn-outline-warning")
                    target.classList.add('btn-outline-success')
                }
                else if(target.textContent == 'Save'){
                    editTodoItem(inputItem)
                    inputItem.disabled = true
                    target.innerText = "Edit"
                    target.classList.remove('btn-outline-success')
                    target.classList.add("btn-outline-warning")
                    checkbox.disabled = false
                }
                else if(target.textContent == 'Yes'){
                    delTodoItem(target)
                }
                else if(target.type == 'checkbox'){
                    let line =  item.children[1].children[0]
                    done(line,inputItem,checkbox)
                }
            })
        })
    } 
    input.value = "";

}

// 新增
function addTodoItem(){
    if (input.value == "" || input.value.trim() == "") {
        alert("!還沒輸入待辦事項啦!");
    }
    else{
            
        let todoObj = {
            item: input.value,
            done:'no'
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
function editTodoItem(inputItem){

    if(inputItem.value.trim() == ""){
        alert("要變更的待辦事項還沒輸入喔!");
    }
    else{
    //console.log(inputItem.dataset.num)
    //localStorage
    todoList = JSON.parse(localStorage.getItem(todoKey))
    todoList[inputItem.dataset.num] = {
        item: inputItem.value,
        done:'no'
    }
    localStorage.setItem(todoKey, JSON.stringify(todoList))
    }
}

//刪除
function delTodoItem(item){
    //localStorage
    todoList = JSON.parse(localStorage.getItem(todoKey))
    //console.log(`todoList :${todoList}`)
    //console.log(`btn.dataset.num :${btn.dataset.num}`)
    //第data-num筆
    todoList.splice(item.dataset.num, 1)
    localStorage.setItem(todoKey, JSON.stringify(todoList))
    renderData()
}

//完成
function done(line,inputItem,checkbox){
    if(checkbox.dataset.state == 'no'){
        todoList = JSON.parse(localStorage.getItem(todoKey))
        todoList[inputItem.dataset.num] = {
            item:inputItem.value,
            done:'yes'
        }
    }
    else if(checkbox.dataset.state == 'yes'){
        todoList = JSON.parse(localStorage.getItem(todoKey))
        todoList[inputItem.dataset.num] = {
            item:inputItem.value,
            done:'no'
        }
    }
    localStorage.setItem(todoKey, JSON.stringify(todoList))
    renderData() 
}

window.onload = function(){
    renderData() 
    //新增
    addBtn.addEventListener("click", function () {
        addTodoItem()
    })
    //按enter
    input.addEventListener('keypress',function(e){
        if(e.which === 13)
        {
            addTodoItem()
        }
    })
}