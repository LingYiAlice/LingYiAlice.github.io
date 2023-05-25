let appleProducts = [
    {
        name: "iphone-se",
        price:14900,
        kv_img: "./image/iphone-se-kv.jpg",
        colorList:[
                { text:"midnight", img:"./image/finish-midnight.jpg"},
                { text:"starlight", img:"./image/finish-starlight.jpg"},
                { text:"red", img:"./image/finish-red.jpg"}
            ],
        formatList:[
            { storage:"64GB",  price:14900},
            { storage:"128GB", price:16500},
            { storage:"256GB", price:20000}
        ]
    },
    {
        name:"ipad-pro",
        price:27900,
        kv_img: "./image/ipad-pro-kv.jpg",
        colorList:[
            { text:"space-gray", img:"./image/finish-space_gray.jpg"},
            { text:"silver", img:"./image/finish-silver.jpg"}
        ],
        formatList:[
            { storage:"128GB", price:27900},
            { storage:"256GB", price:31400},
            { storage:"512GB", price:38400},
            { storage:"1TB", price:52400},
            { storage:"2TB", price:66400}
        ],
        networkList:[
            { network:"Wi-Fi", fit:0},
            { network:"5G", fit:5000}
        ]
    },
    {
        name:"imac",
        price:39900,
        kv_img: "./image/imac-kv.jpg",
        colorList:[
            { text:"blue", img:"./image/finish-blue.jpg"},
            { text:"green", img:"./image/finish-green.jpg"},
            { text:"pink", img:"./image/finish-pink.jpg"},
            { text:"sliver", img:"./image/finish-silver.jpg"}
        ],  
        formatList:[
            { storage:"8GB", price:39900},
            { storage:"16GB", price:45900}
        ],
        networkList:[
            { network:"無", fit:0},
            { network:"Gigabit 乙太網路", fit:1000}
        ]
    }
]

//DOM
const changeBtns = document.querySelectorAll('.changeBtn')
const title = document.querySelector('.title')
const kv = document.querySelector('.kv img')
const show = document.querySelector('#show') 

const scrollArea = document.querySelector('.scroll') 
const colorArea = document.querySelector('.color') 
const formatArea = document.querySelector('.format') 
const networkArea = document.querySelector('.network') 

//宣告
let page, price


//function
function changeProduct(btn){
    page = appleProducts.find( x => x.name == btn.dataset.page)
    //title
    title.innerHTML = `<h1>購買 ${btn.innerText}</h1><p">NT$${page['price']}起</p>`

    //圖片
    kv.src = page['kv_img']

    //#region  colorArea: text
    colorArea.innerHTML = ''
    let color_h2 = createElement('h2', '外觀。<span>挑選你喜愛的外觀。</span>')
    let color_p = createElement('p', `顏色`)
    color_p.setAttribute('class', 'color-text')

    colorArea.appendChild(color_h2)
    colorArea.appendChild(color_p)
    //#endregion

    //#region   format: text
    formatArea.innerHTML = ''
    let format_h2 = createElement('h2', '儲存裝置。<span>你需要多少儲存空間？</span>')
    formatArea.appendChild(format_h2)
    //#endregion

    createButton()
}


function createButton(){
    //colorArea:Btn
    page.colorList.forEach( el => {
        let btn = createElement('button', '')
        btn.setAttribute('data-color', el.text)
        let btnImg = createElement('img')
        btnImg.style = 'width: 100%;'
        btnImg.src = el.img
        btn.appendChild(btnImg)
        colorArea.appendChild(btn)
    })
    let colorBtns = colorArea.querySelectorAll('button')
    colorBtns.forEach( btn => {
        btn.addEventListener('click', function(){
            console.log(btn.dataset.color)
            let text = scrollArea.querySelector('.color-text')
            text.innerHTML = `顏色 - ${btn.dataset.color}`
            kv.src = `./image/${page.name}-${btn.dataset.color}.jpg`
        })
    })

    //formatArea: btn
    page.formatList.forEach( el => {
        let btn = createElement('button', '')
        btn.setAttribute('class','col-11' )
        
        let storageP = createElement('p',el['storage'])
        let priceP = createElement('p',` NT$ ${el.price}`)
        priceP.setAttribute('id', 'price')

        btn.appendChild(storageP)
        btn.appendChild(priceP)
        formatArea.appendChild(btn)
    })

    //networkArea: text btn
    if(page.networkList != undefined){
        networkArea.innerHTML = '<h2>連線能力。 <span> 選擇連線方式。</span></h2>'
        page.networkList.forEach( el => {
            let btn = createElement('button', '')
            btn.setAttribute('class','col-11' )
            
            let networkP = createElement('p',el['network'])
            let priceP = createElement('p',` +NT$ ${el.fit}`)
            priceP.setAttribute('id', 'fit')
            
            btn.appendChild(networkP)
            btn.appendChild(priceP)
            networkArea.appendChild(btn)
        })
    }
    show.innerText = ''
    getPrice()
}


function getPrice(){
    let formatBtns = formatArea.querySelectorAll('button')
    let networkBtns = networkArea.querySelectorAll('button')
    let price ,fit
    // console.log(page)

    formatBtns.forEach( btn => {
        btn.addEventListener('click', function(){
            console.log(btn)
            price = btn.querySelector('#price').innerText
            show.innerText = price
            let priceStr = price.replace("NT$","")
            price = parseInt(priceStr)
        })
    })
    networkBtns.forEach( btn => {
        btn.addEventListener('click', function(){
            let fitStr = btn.querySelector('#fit').innerText.replace("+NT$","")
            fit = parseInt(fitStr)
            let totlePrice = price + fit
            show.innerText = 'NT$' + totlePrice
        })
    })
}

//create element & innerText
function createElement(element, tag) {
    let el = document.createElement(element);
    el.innerHTML = tag
    return el;
}

// window.onload
window.onload = function(){
    changeBtns.forEach( (Btn) => {
        Btn.addEventListener('click',changeProduct.bind(null,Btn))
    })         
}