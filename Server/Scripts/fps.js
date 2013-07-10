var fps = new function() {
	var currentCount = 0;	

	this.Setup = function() {
		var counterElement = document.createElement('div');
		counterElement.id = 'counter';
		counterElement.innerHTML = "N/A";
		document.body.appendChild(counterElement);
		
		setInterval(function() {
			counterElement.innerHTML = currentCount + " f/s";				
			currentCount = 0;
		}, 1000);
	};
	
	this.Count = function() {
		currentCount += 1;
	};	
};

window.onload = function() {
	fps.Setup();
};