const ipField = document.querySelector('[data-ip-field]')
const ipSubmit = document.querySelector('[data-ip-submit]')
const ipAddress = document.querySelector('[data-ip-address]')
const locationField = document.querySelector('[data-location]')
const timezoneField = document.querySelector('[data-timezone]')
const ispField = document.querySelector('[data-isp]')
const mapField = document.querySelector('[data-map]')
let mymap = undefined

ipSubmit.addEventListener('click', apiCatch)

async function apiCatch() {
    try {
      if (validURL(ipField.value)) {
        var response = await haveProtocol()
      } else {
        var response = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_T5EcEOnig7oNVrqjuCgBuk2qQagCl&ipAddres=${ipField.value}`)
      }
      let data = await response.json()
      ipAddress.innerText = data.ip
      locationField.innerText = `${data.location.city}, ${data.location.region}, ${data.location.country}`
      timezoneField.innerText = data.location.timezone
      ispField.innerText = data.isp
      if (mymap != undefined) { mymap.remove(); }
      mymap = L.map(mapField).setView([data.location.lat, data.location.lng], 14)
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiY29wcGVyb3ZzayIsImEiOiJja245ZGJ6MWIwYWRhMnZrOG8wYndlbXFoIn0.T-clOuESb-rpyEuld2WkXQ'
    }).addTo(mymap);
      let markerIcon = L.icon({
        iconUrl: 'images/icon-location.svg',
        iconSize: [30, 36.52],
      })
      let marker = L.marker([data.location.lat, data.location.lng], {icon:markerIcon}).addTo(mymap);
      
    } catch (error) {
      console.log(error)
    }
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function haveProtocol() {
  if(ipField.value.includes('https://')) {
    return fetch(`https://geo.ipify.org/api/v1?apiKey=at_T5EcEOnig7oNVrqjuCgBuk2qQagCl&domain=${ipField.value.replace('https://', '')}`)
  }
  else if(ipField.value.includes('http://')) {
    return fetch(`https://geo.ipify.org/api/v1?apiKey=at_T5EcEOnig7oNVrqjuCgBuk2qQagCl&domain=${ipField.value.replace('http://', '')}`)
  }
  else {
    return fetch(`https://geo.ipify.org/api/v1?apiKey=at_T5EcEOnig7oNVrqjuCgBuk2qQagCl&domain=${ipField.value}`)
  }
}