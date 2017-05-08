/********************
   Places API Call
********************/
let slicePrizes = [];
let startPos;
let lat;
let lon;
let apiLink = "";
const geoOptions = {
    // Based off milliseconds
    timeout: 10 * 1000,
    maximumAge: 5 * 60 * 1000,
}
let msgs = [
    "Hold On, Getting Your location...",
    "We Need Your Location To Find Places!",
    "Here You Go!",
    "Sorry, a glitch happened. Please refresh browser."
];

let geoSuccess = function(position) {
    let data = "";
    startPos = position;
    lat = startPos.coords.latitude;
    lon = startPos.coords.longitude;
    // Displays 'Here You Go!'
    $("#status").html(msgs[2]);
    // Radius parameter takes in meters. Radius will be half a mile which equates to about 804 meters
    apiLink = "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
    "?location=" + lat + "," + lon + "&radius=804&type=restaurant&key=AIzaSyCyAwrkbjXJiTvhxuxMH_TBptVSr20YkHk";
    $.ajax({
        type: 'GET',
        url: apiLink,
        timeout: 10 * 1000,
        error: function(nunya,errStatus,errThrown){
            if(errStatus== "error" || "abort" || "timeout" || "parsererror"){
                $("#status").html(msgs[3]);
            }
        },
        data: data,
        dataType: 'json',
        success: function(data) {
            let names = data.results.length;
            let colors = [
                '#eae56f', '#89f26e', '#7de6ef', '#e7706f',
                '#eae56f', '#89f26e', '#7de6ef', '#e7706f',
                '#eae56f', '#89f26e', '#7de6ef', '#e7706f',
                '#eae56f', '#89f26e', '#7de6ef', '#e7706f',
                '#eae56f', '#89f26e', '#7de6ef', '#e7706f',
            ];

            for (var i = 0; i < names; ++i) {
                slicePrizes.push({
                    fillStyle: colors[i],
                    text: data.results[i].name,
                });
            }
            /*
            // Gets url to photo of place
            let photoReference = data.results[0].photos[0].photo_reference;
            // Photo api link
            let photoUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoReference +"&key=AIzaSyCyAwrkbjXJiTvhxuxMH_TBptVSr20YkHk"
            node.innerHTML += "<img src=" + photoUrl +" />"
            */
            // Create new wheel object specifying the parameters at creation time.
            var theWheel = new Winwheel({
                'numSegments': null, // Specify number of segments.
                'outerRadius': 212, // Set outer radius so wheel fits inside the background.
                'textFontSize': 12, // Set font size as desired.
                'animation': // Specify the animation to use.
                {
                    'type': 'spinToStop',
                    'duration': 5, // Duration in seconds.
                    'spins': 8 // Number of complete spins.
                }
            });

            for (var i = 0; i < slicePrizes.length; ++i) {
                // Adds name of places to wheel
                theWheel.addSegment(slicePrizes[i]); // Define segments including colour and text.
            }
            // Loads places and segments to wheel
            theWheel.draw();
            // Vars used by the code in this page to do power controls.
            var wheelPower = 0;
            var wheelSpinning = false;
            // -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function startSpin() {
                // Ensure that spinning can't be clicked again while already running.
                if (wheelSpinning == false) {
                    // Begin the spin animation by calling startAnimation on the wheel object.
                    theWheel.startAnimation();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    wheelSpinning = true;
                }
            }

            // -------------------------------------------------------
            // Function for reset button.
            // -------------------------------------------------------
            function resetWheel() {
                theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
                theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
                theWheel.draw(); // Call draw to render changes to the wheel.
                wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
            }

            $("#spin_button").click(function() {
                startSpin();
            });

            $("#reset").click(function() {
                resetWheel();
            });
        }
    });
};

let geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
    // Displays 'We Need Your Location To Find Places!'
    $("#status").html(msgs[1]);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
};

$("#status").html(msgs[0]);

navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
