// IIFE - Immediately Invoked Function Expression
(function(executor) {

    // The global jQuery object is passed as a parameter
  	executor(window.jQuery, window, document);

	}(function($, window, document) {

    // The $ is now locally scoped
    $("#users-tab").hover(function() {
        $("#users-tooltip").css("display", "inline-block");
    }, function() {
        $("#users-tooltip").css("display", "none");
    });

    $("#sessions-tab").hover(function() {
        $("#sessions-tooltip").css("display", "inline-block");
    }, function() {
        $("#sessions-tooltip").css("display", "none");
    });

	// Listen for the jQuery ready event on the document
	$(function() {
		var summaryContainer = $('#summaryContainer');
		var featuresContainer = $('#featuresContainer');
		$('#features').on('click', function(){
				var projectContainerId = $(this).attr('data-project-id');
				$.post('cms/ajax/analytics_ajax/getProjectNames', { projectContainerId: projectContainerId})
				.done(function(data){
					projectListingObj = JSON.parse(data);
					//Check if the projectContainer only has one or more projects in it.
					var count = 0;
					var i;
					for (i in a) {
						if (projectListingObj.hasOwnProperty(i)) {
							count++;
						}
					}
					if(count > 1){
                        /*
						//List out all the projects of the projectContainer
						$.each(data, function(index, value){
							$('#projectListing').
						}); */
					}else{
						//Get the feature listing of the project to display.
					}


				});
		});
	});

	// The rest of the code goes here!

}
));
