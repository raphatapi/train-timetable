var count = 0;

$("#add-train").attr("disabled",true);
$(document).on("keyup", ".form-control", function(event) {
	if( $.trim($(this).val()).length > 0){
            $("#add-train").attr("disabled", false);            
        }
        
        else {
            $("#add-train").attr("disabled",true);
        }
})

$(document).ready(function(){
	$('#display').flapper().val("Travel Rail").change();

	var config = {
    apiKey: "AIzaSyAuqMuyX22Lgb3ApxZyfeKxv3Y9pAnhiKY",
    authDomain: "tapioca-c23ed.firebaseapp.com",
    databaseURL: "https://tapioca-c23ed.firebaseio.com",
    projectId: "tapioca-c23ed",
    storageBucket: "tapioca-c23ed.appspot.com",
    messagingSenderId: "781777189469"
	};
	firebase.initializeApp(config);
    // Create a variable to reference the database
    var database = firebase.database();

    $("#add-train").on("click", function() {
      
      event.preventDefault();

      var numberInput = $("#number-input").val().trim();
      var destinationInput = $("#destination-input").val().trim();
      var timeInput = $("#time-input").val().trim();
      var frequencyInput = $("#frequency-input").val().trim();
      numberInput
      $(".form-control").val("");
      
            
      database.ref().push({
        number: numberInput,
        destination: destinationInput,
        time: timeInput,
        frequency: frequencyInput
      });

    });

    $("#add-train").attr("disabled",true);
		$(document).on("keyup", ".form-control", function(event) {
			if( $.trim($(".form-control").val()).length > 0){
		            $("#add-train").attr("disabled", false);            
		        }
		        
		        else {
		            $("#add-train").attr("disabled",true);
		        }
		})

    database.ref().on("child_added", function(snapshot) {
      //MomentJS
	var data = snapshot.val();
	var frequency = data.frequency;
	var firstTime = data.time;
	var timeInputConverted = moment(firstTime, "HH:mm").subtract(1, "years");
	var diffTime = moment().diff(moment(timeInputConverted), "minutes");
	var tRemainder = diffTime % frequency;
	var tMinutes = frequency - tRemainder;
	var nextTrain = moment().add(tMinutes, "minutes");
	count++
		if (count > 6){
			count = 1;
		};

	var trainNumber = data.number;
	var formattedTrainNumber = ("000" + trainNumber).slice(-4);

	var trainDestination = data.destination.toUpperCase();
	var formattedTrainDestination = ("XXX" + trainDestination).slice(-3);
	console.log(formattedTrainDestination);

	var trainFrequency = data.frequency;
	var formattedTrainFrequency = ("0" + trainFrequency).slice(-2);

	var trainMinutes = tMinutes;
	var formattedTrainMinutes = ("0" + trainMinutes).slice(-2);

	$("#" + count).val(formattedTrainNumber + " / " + formattedTrainDestination + " / " + formattedTrainFrequency + " / " + formattedTrainMinutes + " /" + nextTrain.format("LT")).change();

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    //Canvas Clock
    var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var radius = canvas.height / 2;
	ctx.translate(radius, radius);
	radius = radius * 0.90
	setInterval(drawClock, 1000);

	function drawClock() {
	  drawFace(ctx, radius);
	  drawNumbers(ctx, radius);
	  drawTime(ctx, radius);
	}

	function drawFace(ctx, radius) {
	  var grad;
	  ctx.beginPath();
	  ctx.arc(0, 0, radius, 0, 2*Math.PI);
	  ctx.fillStyle = 'white';
	  ctx.fill();
	  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
	  grad.addColorStop(0, '#333');
	  grad.addColorStop(0.5, 'white');
	  grad.addColorStop(1, '#333');
	  ctx.strokeStyle = grad;
	  ctx.lineWidth = radius*0.1;
	  ctx.stroke();
	  ctx.beginPath();
	  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
	  ctx.fillStyle = '#333';
	  ctx.fill();
	}

	function drawNumbers(ctx, radius) {
	  var ang;
	  var num;
	  ctx.font = radius*0.15 + "px arial";
	  ctx.textBaseline="middle";
	  ctx.textAlign="center";
	  for(num = 1; num < 13; num++){
	    ang = num * Math.PI / 6;
	    ctx.rotate(ang);
	    ctx.translate(0, -radius*0.85);
	    ctx.rotate(-ang);
	    ctx.fillText(num.toString(), 0, 0);
	    ctx.rotate(ang);
	    ctx.translate(0, radius*0.85);
	    ctx.rotate(-ang);
	  }
	}

	function drawTime(ctx, radius){
	    var now = new Date();
	    var hour = now.getHours();
	    var minute = now.getMinutes();
	    var second = now.getSeconds();
	    //hour
	    hour=hour%12;
	    hour=(hour*Math.PI/6)+
	    (minute*Math.PI/(6*60))+
	    (second*Math.PI/(360*60));
	    drawHand(ctx, hour, radius*0.5, radius*0.07);
	    //minute
	    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
	    drawHand(ctx, minute, radius*0.8, radius*0.07);
	    // second
	    second=(second*Math.PI/30);
	    drawHand(ctx, second, radius*0.9, radius*0.02);
	}

	function drawHand(ctx, pos, length, width) {
	    ctx.beginPath();
	    ctx.lineWidth = width;
	    ctx.lineCap = "round";
	    ctx.moveTo(0,0);
	    ctx.rotate(pos);
	    ctx.lineTo(0, -length);
	    ctx.stroke();
	    ctx.rotate(-pos);
	}

});