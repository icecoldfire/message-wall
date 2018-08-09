var message_count = 0;
var polling = false;

function render(response){
	var newMessages = JSON.parse(response);
	
	var root = document.getElementById("messages");
	for(var i = 0; i < newMessages.length; i++){
		var message = newMessages[i];
		var text = message.message;
		var number = message.number;
		
		var d = new Date(0);
		d.setUTCSeconds(+message.sent_timestamp);
		
		var card = document.createElement('div');
		card.className = "card";
		
		var cardBody = document.createElement('div');
		cardBody.className = "card-body";
		
		var cardText = document.createElement('p');
		cardText.className = "card-text";
		cardText.innerText = text;
		
		var cardTextSub = document.createElement('p');
		cardTextSub.className = "card-text";

		var small = document.createElement('small');
		small.className = "text-muted";
		var datestring = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
		small.innerText = "From: " + number + " at: " + d.toLocaleTimeString() + " " + datestring + " id: " + message_count;
		
		cardTextSub.append(small);
		
		cardBody.append(cardText);
		cardBody.append(cardTextSub);
		card.append(cardBody);
		root.insertBefore(card, root.firstChild);
		message_count++;
	}
}

function update(){
	
	if(polling){
		return;
	}
	var http = new XMLHttpRequest();
	var url = '/update?latest=' + message_count;
	http.open('GET', url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4) {
			if(http.status == 200){
				render(http.response);
			}
			polling = false;
		}
	}
	http.send();
	polling = true;
}

if( document.readyState === 'complete' ) {
    startUpdater();
} else {
    document.addEventListener('DOMContentLoaded', startUpdater, false);
}

function startUpdater() {
	var http = new XMLHttpRequest();
	var url = '/update?all';
	http.open('GET', url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4) {
			if(http.status == 200){
				render(http.response);
			}
			polling = false;
		}
	}
	http.send();
	polling = true;
	setInterval(update, 1000);
}