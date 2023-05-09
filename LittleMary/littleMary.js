        //宣告
        let steps = 0 //剩餘要走幾步
        let allSteps = 0 //全部的步數
        let current = 0//目前走到哪一格
        let speed //速率(數值越大走越慢)
        let btn

        //DOM
        let bricks = document.querySelectorAll('[box-id]')
        const startBtn = document.querySelector('button:first-child') 
        const resetBtn = document.querySelector('button:last-child') 
        const extraBtnArea = document.querySelector('.btnArea') 
        let msgBox = document.querySelector('#msg')
        let extraBricks = document.querySelector('#extra')

        //function
        function renderBrick(){
            // NodeList -> array -> 排序
            bricks = Array.from(bricks).sort((a,b) => {
                return a.getAttributeNode('box-id').value - b.getAttributeNode('box-id').value
            })

            bricks.forEach( (x) => {
                //選到的box-id 之 value
                let id = x.getAttributeNode('box-id').value
                //brickData
                let data = brickData.find( x => x.id == id)

                // city
                let city = document.createElement('p')
                city.innerText = data.Region
                x.appendChild(city)
            })
        }

        //遊戲開始
        function getStart(){
            startBtn.disabled = true
            //轉圈速率
            speed = 50
            let random = Math.floor(Math.random() * (brickData.length -3 )) + 1
            // 三圈
            steps = random + ( 3 * (brickData.length -3 ))
            allSteps = steps

            //開始走
            console.log(current)
            if(current == 19){
                current = 0
                extraBricks.children[current].classList.add('active')
                extraTurn()
            }
            else{
                turnAround()
            }
        }

        function turnAround(){                      
            //每走一步前, 目前格class="active" css設定移除
            bricks[current].classList.remove('active') 
            current++

            if(current >= bricks.length - 3 ) current = 0 //走的數量 大於等於 格子數->從頭
            
            //每走一步後, 目前格class="active" css設定加進
            bricks[current].classList.add('active')
            steps--
            if( steps > 0){
                setTimeout(turnAround, speed)
                //當剩餘步數剩下1/3, 速率變慢(數值變大)
                if( steps < Math.floor((allSteps / 3))) speed += 7
            }
            else{
                if(current == 19) extra()
                //走完,顯示brickData的target()
                msgBox.innerText = brickData[current].target()
                resetBtn.disabled = false
            }
        }

        function extra(){
            extraBricks.classList.remove('d-none')
            extraBricks.classList.add('d-flex')
            btn = document.createElement('button')
            btn.innerText = '離島請選得'
            extraBtnArea.appendChild(btn)
            extraBtnArea.classList.add('d-flex','justify-content-center')
            btn.classList.add('btn','btn-outline-primary')
            btn.addEventListener('click',getStart)
        }
        
        function extraTurn(){
            extraBricks.children[current].classList.remove('active') 
            current++
            
            if(current >= extraBricks.children.length ) current = 0 
            extraBricks.children[current].classList.add('active')
            steps--
            if( steps > 0){
                setTimeout(extraTurn, speed += 7) 
            }
            else{
                msgBox.innerText = extraBricks.children[current].innerText
                btn.disabled = true
                resetBtn.disabled = false
            }
        }

        //window.onload
        window.onload = function(){
            resetBtn.disabled = true
            renderBrick()
        }