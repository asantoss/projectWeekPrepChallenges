var map;
var cities = ['nashville', 'atlanta', 'charlotte', 'Tallahasee', 'new orleans', 'montgomery', 'Jackson, mississipi', 'columbia, south carolina'];

var mapContainer = document.getElementById('main_mapContainer');

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 33.753, lng: -84.386 },
        zoom: 5
    });


    var atl = new google.maps.Marker({
        position: { lat: 33.753746, lng: -84.386330 },
        title: 'Atl hoe'
    })

    document.getElementById('markers').addEventListener('click', e => {
        e.preventDefault();
        cities.forEach(city => {
            geocoder.geocode({ 'address': city }, (response, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    new google.maps.Marker({
                        map: map,
                        position: response[0].geometry.location,
                        title: city
                    })
                }
            })
        })
    })
}