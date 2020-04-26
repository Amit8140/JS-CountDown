$(document).ready(function(){
	$('input[name="event_date"]').attr('min',new Date().toISOString().slice(0, 10));
	setInterval(function(){
		getEvents();	
	} ,3000);
});
	$(document).ready(function () {
		$('form').submit(function(e){
				e.preventDefault();
			});
	});
	function getTimer(future_date,future_time,timer_id){
		// Set the dynamic date we're counting down to
		date = future_time != '' ? future_date+' '+future_time : future_date+ ' 23:59:59';
		//var countDownDate = new Date(`'`+date+`'`).getTime();
		var countDownDate = new Date(date).getTime();
		// Update the count down every 1 second
		var x = setInterval(function() {
		  // Get today's date and time
		  var now = new Date().getTime();
		  // Find the distance between now and the count down date
		  var distance = countDownDate - now;
		  // Time calculations for days, hours, minutes and seconds
		  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		  day_tense = (days == 1 || days == 0) ? 'Day ' : 'Days ';
		  hours_tense = (hours == 1) ? 'Hr ' : 'Hrs ';
		  min_tense = (minutes == 1) ? 'Min ' : 'Mins ';
		  // Display the result in the element with id="demo"
		  timer_span = document.getElementById("timer_"+timer_id);
		  if (timer_span != null && timer_span != undefined && timer_span != '') {
		  	document.getElementById("timer_"+timer_id).innerHTML = days + day_tense + hours + hours_tense + minutes + min_tense + seconds + "s ";
		  }
		  // If the count down is finished, write some text
		  if (distance < 0) {
		    clearInterval(x);
		    if (timer_span != null && timer_span != undefined && timer_span != '') {
		    	timer_span.innerHTML = "EXPIRED";
		    }
		  }
		}, 1000);
	}

	function getEvents(){
		$('#eventDetails').empty();
		localFormData = JSON.parse(localStorage.getItem('formDataArray'));
		if (localFormData == null || localFormData == undefined || localFormData == '') {
				$('#eventDetails').text('No Events Found');
		}else{
			if (localFormData.length > 0) {
				localFormData.forEach(function(item,index){
					data = JSON.parse(item);
					if (data != null && data != undefined && data !='') {
						appendData = `
						<div class='event'>
						<h2>`+data.event_name+`<span onclick = "deleteEvent(`+data.id+`)">Delete</span></h2>
						<h5>Ends in :<span id = timer_`+data.id+`>`+data.event_date+`</span></h5>
						</div><div class = clr></div>`;
						$('#eventDetails').append(appendData);
						$('#timer_'+data.id).closest('.event').css('border',' 2px solid '+getRandomColor());
						getTimer(data.event_date,data.event_time,data.id);
					}
				});
			}else{
				$('#eventDetails').text('No Events Found');
			}
		}
	}
	function deleteEvent(id){
		var r = confirm('Are you sure you want to delete this event reminder?');
		if (r){
			localFormData = JSON.parse(localStorage.getItem('formDataArray'));
			updatedArray = [];
			localFormData.forEach(function(item,index){
				data = JSON.parse(item);
				if (data.id == id) {
					let deleted = delete localFormData[index];
					if(deleted)
						$('#timer_'+data.id).closest('.event').remove();
				}
			});
			localFormData.forEach(function(item,index){
				data = JSON.parse(item);
				if (data != undefined && data != null) {
					updatedArray.push(JSON.stringify(data));
				}
			});
			localStorage.setItem('formDataArray',JSON.stringify(updatedArray));
		}
	}
	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	function submitForm(){
		form = $('form')[0];
		var invalid = 0;
		$('.required').each(function() {
			if ($(this).val() == '') {
				$(this).addClass('invalid');
				invalid = 1;
			}else{
				$(this).removeClass('invalid');
			}
		});
		if (invalid) {
			return false;
		}else{
			saveInLocalStorage(form);
			form.reset();
		}
	}
	function saveInLocalStorage(form){
		var save = true;
		localFormData = JSON.parse(localStorage.getItem('formDataArray'));
		console.log(localFormData);
		if ( localFormData != null ) {
			if (localFormData.length != 0) {
				localFormData.forEach(function(item,index){
					let data = JSON.parse(item);
					if (data != null && data != undefined && data !='') {
						if (data.event_name == form.event_name.value && data.event_date == form.event_date.value) {
							alert('A similar event is already created.');
							save = false;
						}
					}
				});
			}
		}
		if (save) {
			if(localFormData == '' || localFormData == undefined){
				var localFormData = [];
				formData = {};
				formData.id = 1;
				formData.event_name = form.event_name.value;
				formData.event_date = form.event_date.value;
				formData.event_time = form.event_time.value;
				localFormData.push(JSON.stringify(formData));
				localStorage.setItem('formDataArray',JSON.stringify(localFormData));
				alert('Event Added successfully!!!');
			}else{
				formData = {};
				formData.id = localFormData.length + 1;
				formData.event_name = form.event_name.value;
				formData.event_date = form.event_date.value;
				formData.event_time = form.event_time.value;
				localFormData.push(JSON.stringify(formData));
				localStorage.setItem('formDataArray',JSON.stringify(localFormData));
				alert('Event Added successfully!!!');
			}
		}
	}
	function removeAllEvents(){
		let isEventAvailable = localStorage.getItem('formDataArray');
		if (isEventAvailable) {
			if (isEventAvailable.length > 0) {
				let r = confirm('Do you want to remove all Events ?');
				if (r) {
					localStorage.removeItem('formDataArray');
					getEvents();
				}
			}
		}else{
			alert('No events found to remove.');
		}
	}