// IIFE - Immediately Invoked Function Expression
(function(executor) {
	
    // The global jQuery object is passed as a parameter
  	executor(window.jQuery, window, document);
	
	}(function($, window, document) {
	
    // The $ is now locally scoped
	
	// Listen for the jQuery ready event on the document
	$(function() {
		var projectFeatures = $('#projectFeatures');
		
		projectFeatures.on('change', function(){
			if ($(this).children().length > 0) {
				$(this).addClass('dd-empty');
			}
		});
		
		var previewButton = $('.previewButton'); 
		previewButton.on('click', function(event){
			event.stopPropagation();
			alert("The span element was clicked.");
		});

	});
	
	// The rest of the code goes here!
	
}
));
