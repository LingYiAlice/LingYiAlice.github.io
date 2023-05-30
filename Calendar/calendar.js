//宣告
//今天
const today = new Date() 
//年
let year = today.getFullYear() 
//月
let month = today.getMonth() 
let currentIndex

//DOM
const yearMonthText = document.querySelector('.year-month')
const dateArea = document.querySelector('tbody')

const addModal = document.querySelector('#add-modal')
const editModal = document.querySelector('#edit-modal')

const addDateInput = document.querySelector('#add-date')
const addValueInput = document.querySelector('#add-value')
const editDateInput = document.querySelector('#edit-date')
const editValueInput = document.querySelector('#edit-value')

//function
function renderDate() {
    dateArea.innerHTML = ''

    yearMonthText.innerText = `${year}年 - ${month + 1}月`

//這個月第一天星期
    let firstDay = new Date(year, month, 1).getDay()
//這個月幾天
    let dayOfMonth = new Date(year, month + 1, 0).getDate()

    let rows = Math.ceil((dayOfMonth + firstDay) / 7)
    let day = 1

//日期渲染
    for (let row = 0; row < rows; row++) {
        let tr = document.createElement('tr')
        for (let col = 0; col < 7; col++) {
            let td = document.createElement('td')
            //上個月
            if (row == 0 && col < firstDay) {
                td.innerText = ''
            }
            else {
                //本月
                if (day <= dayOfMonth) {
                    let d = day
                    td.innerText = day

                    if (localStorage.getItem(`${year}-${month + 1}-${d}`) != null) {
                        let p = document.createElement('p')
                        
                        let todoList = JSON.parse(localStorage.getItem(`${year}-${month + 1}-${d}`))
                        todoList.forEach((item, index) => {
                            
                            p.innerText = item.title

                            p.onclick = function(e) {
                                editDateInput.value = `${year}-${month + 1}-${d}`
                                editValueInput.value = item.title
                                currentIndex = index
                                bootstrap.Modal.getOrCreateInstance(editModal).show()
                                e.stopPropagation()
                            }
                            
                        })
                        td.appendChild(p)
                    }

                    td.onclick = function () {
                        addDateInput.value = `${year}-${month + 1}-${d}`
                        bootstrap.Modal.getOrCreateInstance(addModal).show()
                    }
                    
                }
                else {
                    //下個月
                    td.innerText = ''
                }
                day++
            }
            tr.appendChild(td)
        }
        dateArea.appendChild(tr)
    }
}

function nextMonth() {
    month++
    if (month == 12) {
        year++
        month = 0
    }
    renderDate()
}

function previousMonth() {
    month--
    if (month == -1) {
        year--
        month = 11
    }
    renderDate()
}

//新增
function addSchedule() {
    let date = addDateInput.value 
    let todoItem = addValueInput.value  

    let todoObj = {
        title: todoItem
    }

    let todoList = []
    
    if (localStorage.getItem(date) == null) {
        todoList.push(todoObj)
    } else {
        todoList = JSON.parse(localStorage.getItem(date))
        todoList.push(todoObj)
    }

    localStorage.setItem(date, JSON.stringify(todoList))

    bootstrap.Modal.getOrCreateInstance(addModal).hide()

    renderDate()

}

//編輯
function editSchedule() {
    let date = editDateInput.value
    let todoItem = editValueInput.value

    let todoList = JSON.parse(localStorage.getItem(date))
    
    todoList[currentIndex] = {
        title: todoItem
    }

    localStorage.setItem(date, JSON.stringify(todoList))

    bootstrap.Modal.getOrCreateInstance(editModal).hide()

    renderDate()
}

//刪除
function deleteSchedule() {
    let date = editDateInput.value

    let todoList = JSON.parse(localStorage.getItem(date))
    todoList.splice(currentIndex, 1)

    localStorage.setItem(date, JSON.stringify(todoList))

    bootstrap.Modal.getOrCreateInstance(editModal).hide()

    renderDate()
}

//window.onload
window.onload = function () {
    renderDate()
}


//eyes DOM
const eyes = document.getElementById('eyes')
$(window).mousemove(function (evt) {
    var x = evt.pageX;
    var y = evt.pageY;
// console.log(x + "," + y);
//中
    if (x == $(window).width() / 2 && y < $(window).height() / 2) {
    $("#eyes").attr("src", "./eyes/m.jpg");
    }
//上半
    if (x < $(window).width() / 2  && y < $(window).height() / 2) {
    $("#eyes").attr("src", "./eyes/左上.jpg");
    }

    if (x > $(window).width() / 2  && y < $(window).height() / 2) {
    $("#eyes").attr("src", "./eyes/右上.jpg");
    }
//下半
    if (x > $(window).width() / 2  && y > $(window).height() / 2) {
    $("#eyes").attr("src", "./eyes/右下.jpg");
    }

    if (x < $(window).width() / 2  && y > $(window).height() / 2) {
    $("#eyes").attr("src", "./eyes/左下.jpg");
    }
}); 

