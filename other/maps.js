
    $("#btn").click(function() {
        let startPos;
        const geoOptions = {
            // Based off milliseconds
            timeout: 10 * 1000,
            maximumAge: 5 * 60 * 1000,
        }

        let geoSuccess = function(position) {
            startPos = position;
            let lat = startPos.coords.latitude;
            let lon = startPos.coords.longitude;
            // Radius parameter takes in meters. Radius will be half a mile which equates to about 804 meters
            const apiLink = "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
            "?location=" + lat + "," + lon + "&radius=804&type=restaurant&key=AIzaSyCyAwrkbjXJiTvhxuxMH_TBptVSr20YkHk"
            let data = "";
            $.ajax({
                type: 'GET',
                url: apiLink,
                data: data,
                async: true,
                dataType: 'json',
                success: function(data){
                    let node = document.getElementById('info');
                    let names = data.results.length;
                    for (var i = 0; i < names; ++i) {
                        //console.log(data.results[i].name);
                        node.innerHTML += "<p>" + data.results[i].name + "</p>";
                    }
                    /*
                    // Gets url to photo of place
                    let photoReference = data.results[0].photos[0].photo_reference;
                    // Photo api link
                    let photoUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoReference +"&key=AIzaSyCyAwrkbjXJiTvhxuxMH_TBptVSr20YkHk"
                    node.innerHTML = "<p>" + data.results[0].name + "</p>";
                    node.innerHTML += "<img src=" + photoUrl +" />"
                    console.log(data.results);
                    */
                }
            });
        };

        let geoError = function(error) {
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
        };

        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    });
