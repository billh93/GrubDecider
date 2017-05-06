/********************
   Places API Call
********************/
let slicePrizes = [];
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
        success: function(data) {
            let node = document.getElementById('info');
            let names = data.results.length;
            //let namesArray = [];
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
                //console.log(data.results[i].name);
                //slicePrizes.push(data.results[i].name);
                //node.innerHTML += "<p>" + data.results[i].name + "</p>";
            }
            //console.log(slicePrizes);
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

setTimeout(
    function() {
        /********************
         Creating The Wheel
        ********************/
        // Create new wheel object specifying the parameters at creation time.
        var theWheel = new Winwheel({
            'numSegments': 20, // Specify number of segments.
            'outerRadius': 212, // Set outer radius so wheel fits inside the background.
            'textFontSize': 28, // Set font size as desired.
            /*'segments'     :        // Define segments including colour and text.
            [
               {'fillStyle' : '#eae56f', 'text' : 'Prize 1'},
               {'fillStyle' : '#89f26e', 'text' : 'Prize 2'},
               {'fillStyle' : '#7de6ef', 'text' : 'Prize 3'},
               {'fillStyle' : '#e7706f', 'text' : 'Prize 4'},
               {'fillStyle' : '#eae56f', 'text' : 'Prize 5'},
               {'fillStyle' : '#89f26e', 'text' : 'Prize 6'},
               {'fillStyle' : '#7de6ef', 'text' : 'Prize 7'},
               {'fillStyle' : '#e7706f', 'text' : 'Prize 8'}
           ], */
            'animation': // Specify the animation to use.
            {
                'type': 'spinToStop',
                'duration': 5, // Duration in seconds.
                'spins': 20, // Number of complete spins.
                'callbackFinished': 'alertPrize()'
            }
        });

        let segments = [];
        for (var i = 0; i < slicePrizes.length; ++i) {
            segments.push(slicePrizes[i]);
            //segments.push(slicePrizes[i]);
            //console.log(slicePrizes[i]);
        }
        console.log(segments);

        theWheel['segments'] = segments;
        // Vars used by the code in this page to do power controls.
        var wheelPower = 0;
        var wheelSpinning = false;

        // -------------------------------------------------------
        // Function to handle the onClick on the power buttons.
        // -------------------------------------------------------
        function powerSelected(powerLevel) {
            // Ensure that power can't be changed while wheel is spinning.
            if (wheelSpinning == false) {
                // Reset all to grey incase this is not the first time the user has selected the power.
                document.getElementById('pw1').className = "";
                document.getElementById('pw2').className = "";
                document.getElementById('pw3').className = "";

                // Now light up all cells below-and-including the one selected by changing the class.
                if (powerLevel >= 1) {
                    document.getElementById('pw1').className = "pw1";
                }

                if (powerLevel >= 2) {
                    document.getElementById('pw2').className = "pw2";
                }

                if (powerLevel >= 3) {
                    document.getElementById('pw3').className = "pw3";
                }

                // Set wheelPower var used when spin button is clicked.
                wheelPower = powerLevel;

                // Light up the spin button by changing it's source image and adding a clickable class to it.
                document.getElementById('spin_button').src = "spin_on.png";
                document.getElementById('spin_button').className = "clickable";
            }
        }

        // -------------------------------------------------------
        // Click handler for spin button.
        // -------------------------------------------------------
        function startSpin() {
            // Ensure that spinning can't be clicked again while already running.
            if (wheelSpinning == false) {
                // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                // to rotate with the duration of the animation the quicker the wheel spins.
                if (wheelPower == 1) {
                    theWheel.animation.spins = 3;
                } else if (wheelPower == 2) {
                    theWheel.animation.spins = 8;
                } else if (wheelPower == 3) {
                    theWheel.animation.spins = 15;
                }

                // Disable the spin button so can't click again while wheel is spinning.
                document.getElementById('spin_button').src = "spin_off.png";
                document.getElementById('spin_button').className = "";

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

            document.getElementById('pw1').className = ""; // Remove all colours from the power level indicators.
            document.getElementById('pw2').className = "";
            document.getElementById('pw3').className = "";

            wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
        }

        // -------------------------------------------------------
        // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
        // -------------------------------------------------------
        function alertPrize() {
            // Get the segment indicated by the pointer on the wheel background which is at 0 degrees.
            var winningSegment = theWheel.getIndicatedSegment();

            // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
            alert("You have won " + winningSegment.text);
        }

        $("#pw3").click(function() {
            powerSelected(3);
        });

        $("#pw2").click(function() {
            powerSelected(2);
        });

        $("#pw1").click(function() {
            powerSelected(1);
        });

        $("#spin_button").click(function() {
            startSpin();
        });

        $("#reset").click(function() {
            resetWheel();
        });
    }, 10000);
