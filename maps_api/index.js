var citymap = {
    southEnd: {
        center: { lat: 35.2086932, lng: -80.8627681 },
        population: 2714856
    },
    cic: {
        center: { lat: 35.3123464, lng: -80.7747997 },
        population: 8405837
    }
};

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { lat: 35.2046605, lng: -80.8369965 }, // charlotte
        // center: { lat: 25.774, lng: -70.190 }, // bermuda triangle
        // mapTypeId: 'terrain'
    });

    // for (var city in citymap) {
    //     var cityCircle = new google.maps.Circle({
    //         strokeColor: '#FF0000',
    //         strokeOpacity: 0.8,
    //         strokeWeight: 2,
    //         fillColor: '#FF0000',
    //         fillOpacity: 0.35,
    //         map: map,
    //         center: citymap[city].center,
    //         // radius: Math.sqrt(citymap[city].population) * 100
    //         radius: 12874.8
    //         // editable: true
    //     });
    // }


    const charlotteBlock = new google.maps.Polygon({
        paths: [
            { lat: 35.2086932, lng: -80.8627681 },
            { lat: 35.3123464, lng: -80.7747997 },
            { lat: 35.4186932, lng: -80.6627681 },
        ],
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        editable: true,
        draggable: false
    });
    charlotteBlock.setMap(map);
    const twentyMinSycaJsonString = '[{"lat":35.07449666116017,"lng":-80.96954147646483},{"lat":35.141885602683914,"lng":-81.01046327111811},{"lat":35.21202387627814,"lng":-80.98478045151364},{"lat":35.23634942869517,"lng":-80.99981741873165},{"lat":35.242724279465044,"lng":-81.02858729610591},{"lat":35.28742638376493,"lng":-80.99960971687011},{"lat":35.32342064349987,"lng":-80.978871883728},{"lat":35.3327295916442,"lng":-80.94035050133664},{"lat":35.34763833302241,"lng":-80.90869557402345},{"lat":35.39492896597434,"lng":-80.84014849350586},{"lat":35.36510676410254,"lng":-80.79420197961429},{"lat":35.343115300335064,"lng":-80.7455088836914},{"lat":35.31518263214659,"lng":-80.73865406343992},{"lat":35.28836127672986,"lng":-80.72493278811032},{"lat":35.255363499266764,"lng":-80.72700435946047},{"lat":35.23773792225455,"lng":-80.71945707628782},{"lat":35.220108514218765,"lng":-80.70092346499024},{"lat":35.18884369729464,"lng":-80.71982948610844},{"lat":35.14296960844109,"lng":-80.70440323183595},{"lat":35.121644652102226,"lng":-80.7591864807373},{"lat":35.11154178101107,"lng":-80.77490513155516},{"lat":35.09020150458081,"lng":-80.7899371368652}]'
    charlotteBlock.setPath(JSON.parse(twentyMinSycaJsonString))


    const bermudaTriangle = new google.maps.Polygon({
        paths: [
            { lat: 25.774, lng: -80.190 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
        ],
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        editable: true,
        draggable: false
    });
    bermudaTriangle.setMap(map);

    charlotteBlock.getPaths().forEach(function (path, index) {
        google.maps.event.addListener(path, 'insert_at', function () {
            var data = getPathArray(charlotteBlock)
            console.log(JSON.stringify(data))
        })

        google.maps.event.addListener(path, 'remove_at', function () {
            var data = getPathArray(charlotteBlock)
            console.log(JSON.stringify(data))
        })

        google.maps.event.addListener(path, 'set_at', function () {
            var data = getPathArray(charlotteBlock)
            console.log(JSON.stringify(data))
        })
    })

    google.maps.event.addListener(charlotteBlock, 'dragend', function () {
        console.log("dragged")
    })


    //   rectangle
    // var bounds = {
    //     north: 35.4086932,
    //     south: 35.1086932,
    //     east: -80.7,
    //     west: -81.9,
    //   };

    //   var rectangle = new google.maps.Rectangle({
    //     bounds: bounds,
    //     editable: true,
    //     draggable: true,
    //   });
    //   rectangle.setMap(map);
}

function getPathArray(polygon) {
    return polygon.getPath().getArray().map(p => {
        return { lat: p.lat(), lng: p.lng() }
    })
}