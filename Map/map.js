//DOM
const airportSelect = document.querySelector('#airport')
const airportName = document.querySelector('strong')
const deCheckBox = document.getElementById('departure')
const arCheckBox = document.getElementById('arrival')
const deTbody = document.querySelector('#departureTimetable tbody')
const arTbody = document.querySelector('#arrivalTimetable tbody')

//宣告
let map
let markers = L.markerClusterGroup() //圖釘集合
let weather
let info
let timeTable
let departure
let arrival

 //function
function initMap(){
    //初始地圖
    map = L.map('map', {
        center:[23.903833, 121.078319],
        zoom:7
    })

    //設定圖層
    let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    let osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 16 }) 
    map.addLayer(osm)

    
}

function setMap(){
//全臺機場天氣資料
    fetch('https://tdx.transportdata.tw/api/basic/v2/Air/METAR/Airport?%24top=30&%24format=JSON')
        .then( res => {
            if (res.status == 429) {
                throw new Error(res.status);
            }
            return res.json()
        })
        .then( jsonData => {
            weather = jsonData
            renderMarker()
            initSelect()
        })
        .catch(er => {
            console.dir(er)
            let container = document.querySelector('.container')
            let over = document.querySelector('.over')
            container.classList.add('d-none')
            over.classList.remove('d-none')
            over.classList.add('d-flex')
        })
}

function renderMarker() {
    if(markers)markers.clearLayers()
    weather.forEach( airport => {
        let marker = L.marker([airport.StationPosition.PositionLat, airport.StationPosition.PositionLon])//.addTo(map)
        marker.bindPopup(
            `
            <h4 class="text-center">${airport.AirportName.Zh_tw.includes('機場')? airport.AirportName.Zh_tw : airport.AirportName.Zh_tw + '機場'}</h4>
            <p class="text-secondary">${airport.AirportName.En.includes('Airport')? airport.AirportName.En :  airport.AirportName.En + ' Airport'}</p>
            <p><strong>風向</strong>：${airport.WindDirection}
            <br><strong>風速</strong>：${airport.WindSpeed}
            <br><strong>能見度</strong>：${airport.Visibility}
            <br><strong>氣溫</strong>：${airport.Temperature}
            <br><strong>天氣</strong>：${airport.WeatherDescription.Zh_tw}</p>
            `
        )

        marker.addEventListener('click', function(){
            airportApi(airport.AirportID)
        })

        markers.addLayer(marker)
    });
    map.addLayer(markers)

}

function initSelect() {
    //Set():集合格式,可去除重複
    ['請選擇', ...new Set(weather.map(x => x.AirportName.Zh_tw))].forEach( airport => {
        let option = document.createElement('option')
        option.innerText = airport.includes("機場") ? airport : airport + "機場"
        option.value = airport == '請選擇' ? '' : airport
        airportSelect.appendChild(option)
    })

    airportSelect.onchange = function() {
        if (this.value != '') {
            // 改變地圖的焦點
            let airport = weather.find(x => this.value.includes(x.AirportName.Zh_tw))
            airportApi(airport.AirportID)
            map.setView([airport.StationPosition.PositionLat, airport.StationPosition.PositionLon], 14)
        }
    }
}

function airportInfo(airport){
    airportName.innerHTML = `
        ${airport.AirportName.Zh_tw.includes("機場") ? airport.AirportName.Zh_tw : airport.AirportName.Zh_tw + "機場"}
        <i></i>`
    let icon = airportName.querySelector(`i`)
    icon.classList.add('fa-solid','fa-circle-info','text-primary','fs-6')
    icon.setAttribute('data-toggle','tooltip')
    // Tooltips
    const tooltip = document.querySelector('[data-toggle="tooltip"]')
    new bootstrap.Tooltip(tooltip, {
        placement: 'right',
        trigger: 'hover',
        title:  `地址 : ${airport.AirportAddress} <br> 電話 : ${airport.AirportPhone}`,
        html: true
    })
}

function airportTimeTable(airport){
    airport.forEach( flight => {
        departure = flight.FIDSDeparture
        arrival = flight.FIDSArrival
    })
    timeTableData()
}
function timeTableData(){
//departureTimetable
    deTbody.innerHTML = ''
    departure.forEach( de =>{
        let tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${de.AirlineID + de.FlightNumber}</td>
        <td>${moment(de.ScheduleDepartureTime).format('YYYY-MM-DD HH:mm')}</td>
        <td>${de.ActualDepartureTime != null? moment(de.ActualDepartureTime).format('YYYY-MM-DD HH:mm') : ''}</td>
        <td>${de.ArrivalAirportID}</td>
        <td>${de.Terminal != null? de.Terminal : ''}</td>
        <td>${de.Gate != null? de.Gate : ''}</td>
        <td>${de.DepartureRemark}</td>
        `
        deTbody.appendChild(tr)
    })

//arrivalTimetable
    arTbody.innerHTML = ''
    arrival.forEach( ar =>{
        let tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${ar.AirlineID + ar.FlightNumber}</td>
        <td>${moment(ar.ScheduleArrivalTime).format('YYYY-MM-DD HH:mm')}</td>
        <td>${ar.ActualArrivalTime != null? moment(ar.ActualArrivalTime).format('YYYY-MM-DD HH:mm') : ''}</td>
        <td>${ar.DepartureAirportID}</td>
        <td>${ar.Terminal != null? ar.Terminal : ''}</td>
        <td>${ar.ArrivalRemark}</td>
        `
        arTbody.appendChild(tr)
    })
}

//api
function airportApi(airportId){
    let tbody = document.querySelector('table tbody')
    tbody.innerHTML =`
    <div class="d-flex align-items-center loading">
        <strong>Loading...</strong>
        <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    </div>
    `
//特定機場資訊 https://tdx.transportdata.tw/api/basic/v2/Air/Airport/TPE/?%24format=JSON
//特定機場航班 https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/TPE?%24top=30&%24format=JSON
    const apiUrl_info = 'https://tdx.transportdata.tw/api/basic/v2/Air/Airport'
    const apiUrl_timetable = 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport'
    airportCode = airportId

    let url_info = fetch(`${apiUrl_info}/${airportCode}?%24format=JSON`)
    let url_timetable = fetch(`${apiUrl_timetable}/${airportCode}?%24top=30&%24format=JSON`)

    Promise.all([url_info, url_timetable])
        .then(res =>  Promise.all(res.map(x => x.json())))
        .then( jsonData => {
            [info, timeTable] = jsonData
            airportInfo(info)
            airportTimeTable(timeTable)
        })

}


//window.onload
window.onload = function(){
    initMap()
    setMap()
}