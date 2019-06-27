var map;
var cities = ['nashville', 'atlanta', 'charlotte', 'Tallahasee', 'new orleans', 'montgomery', 'Jackson, mississipi', 'columbia, south carolina'];
var cityMarkers = []
var mapContainer = document.getElementById('main_mapContainer');

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 33.753, lng: -84.386 },
        zoom: 5
    });

    cities.forEach(city => {
        geocoder.geocode({ 'address': city }, (response, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                cityMarker = new google.maps.Marker({
                    // map: map,
                    position: response[0].geometry.location,
                    title: city
                })
                cityMarkers.push(cityMarker)
            }
        })
    })

    markersOn = false
    document.getElementById('markers').addEventListener('click', e => {
        e.preventDefault();
        if (!markersOn) {
            cityMarkers.forEach(marker => {
                marker.setMap(map)
            })
            return markersOn = true
        } else {
            cityMarkers.forEach(marker => {
                marker.setMap(null)
            })
            return markersOn = false
        }
    })
}