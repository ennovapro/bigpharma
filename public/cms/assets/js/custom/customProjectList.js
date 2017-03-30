// IIFE - Immediately Invoked Function Expression
(function(executor) {
	
    // The global jQuery object is passed as a parameter
  	executor(window.jQuery, window, document);
	
	}(function($, window, document) {
	
    // The $ is now locally scoped
	
	// Listen for the jQuery ready event on the document
	$(function() {
		//Base url variable to be used for url strings. 
		var base_url = '';
		//Set the correct base_url based off of the actual url
		if(window.location.href.indexOf("dev")  > -1){
			base_url = 'http://dev.eventus.io/';
		}else{
			base_url = 'http://eventus.io/';
		}
		
		// =========================================================================
		// CREATE AN APP
		// =========================================================================
		var createAppBtn = $('#createAppBtn');
		
		createAppBtn.on('click', function(){
			var appName=$('#appName').val();
			if(appName===''){
				$('#appNameStatus').html('Please provide a name');
				}else{
				$.post("/cms/ajax/main_ajax/insertApp", {name:appName})
				.done(function(data) {
					var insertionArray=JSON.parse(data);
					if(insertionArray['insertionStatus'] === true){
						window.location.replace(base_url + 'cms/' + insertionArray['containerId']  + '/config');
						return;
					}
					
				});
			}
		});
		
		// =========================================================================
		// DELETE APP
		// =========================================================================
		var deleteInput = $('#deletionForm');
		var deletionStatus = $('#deletionStatus');
		var deletionFooter = $('#deleteFooter');
		var pc_id = '';
		
		$('body').on('click', 'li.deleteApp' , function(){
			deletionFooter.show();
			deleteInput.val('');
			deletionStatus.css("font-weight","Bold").html("*By deleting the app, you will irreversibly lose all previous data. If you are sure of this, please type 'Delete' and press delete.");
			pc_id = $(this).attr('id'); 
		});
		
		var deleteAppBtn = $('#deleteAppBtn');
		
		deleteAppBtn.on('click', function(){
			if(deleteInput.val() != 'Delete'){
				deletionStatus.html('Please type Delete into the text field.');
				}else{
				$.post("/cms/ajax/main_ajax/deleteApp", {pc_id:pc_id})
				.done(function(data) {
					var deletionArray=JSON.parse(data);
					if(deletionArray['deletionStatus']===true){
						deletionFooter.hide();
						deletionStatus.html('Deletion Successful');
						$('#container'+pc_id).slideUp();
					}	
				});
				
			}
			
		});
		
		// =========================================================================
		// PAGINATION
		// =========================================================================
		$('.pageIndex').on('click', function(){
			var currentIndex = $(this);
			var oldIndex = $('.pagination').find('.active');
			var next = $('#next');
			var previous = $('#previous');
			
			var indexLength = $('.pageIndex').length;
			var finalIndexInt = indexLength - 2;
			var firstIndexInt = 1; 
			var oldIndexId = oldIndex.attr('id');
			var oldIndexInt = parseInt(oldIndexId.substring(5, 6), 10); 
			
			
			if(currentIndex.hasClass('active') || currentIndex.hasClass('disabled')){
				return;
				}else if(currentIndex.attr('id') === 'next'){
				var nextIndex = oldIndex.next();
				var nextIndexInt = oldIndexInt + 1;
				
				editActiveClass(nextIndexInt, 'next');
				paginate(nextIndexInt);
				}else if(currentIndex.attr('id') === 'previous'){
				var previousIndex = oldIndex.prev();
				var previousIndexInt = oldIndexInt - 1;
				
				editActiveClass(previousIndexInt, 'previous');
				paginate(previousIndexInt);
				}else{
				var indexId = currentIndex.attr('id');
				var currentIndexInt = parseInt(indexId.substring(5, 6), 10); 
				
				editActiveClass(currentIndexInt, 'current');
				paginate(currentIndexInt);
			}
			
			
			/*
				*This function closure takes care of adding and removing the active classes from the relevant pagination elements. 
				*@author PF
			*/
			function editActiveClass(newIndexInt, paginationType){
				if(paginationType === 'next'){
					oldIndex.removeClass('active');
					nextIndex.addClass('active');
					}else if(paginationType === 'previous'){
					oldIndex.removeClass('active');
					previousIndex.addClass('active');
					}else{
					oldIndex.removeClass('active');
					currentIndex.addClass('active');
				}
				
				if(newIndexInt === finalIndexInt){
					next.addClass('disabled');
					previous.removeClass('disabled');
					}else if(newIndexInt === firstIndexInt){
					previous.addClass('disabled');
					next.removeClass('disabled');
					}else{
					previous.removeClass('disabled');
					next.removeClass('disabled');
				}
			}
			
			
		});
		
		
		
		/*
			*This functions takes the page index and places the appropriate html and data onto the project's page
			*@author PF
		*/
		function paginate(pageIndex){
			
			$.post("/cms/ajax/main_ajax/pagination", {pageIndex:pageIndex})
			.done(function(data) {
				var containerList = $('#containerList');
				var containerListData = JSON.parse(data);
				
				var containerElements = {
					element1: '<div id="container', 
					element2: '" class="col-xs-12"> <div class="row"> <div class="col-xs-8"> <img class="pull-left width-3" src="',
					element3: 'public/core/projects/',
					element4: '.png" alt="" /> <p> <span class="text-medium text-lg text-primary">',
					element5: '</span><br/> 	<a class="opacity-75 pointer">Preview Code: ',
					element6: '</a>  </p> </div> <div class="col-xs-4"> <div class="btn-group pull-right"> <button type="button" class="btn ink-reaction btn-primary"><a href="',
					element7: 'cms/',
					element8: '/config">Edit</a></button> <button type="button" class="btn ink-reaction btn-primary dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-down"></i></button> <ul class="dropdown-menu" role="menu"> <li id="',
					element9: '" class="deleteApp" data-toggle="modal" data-target="#deleteModal" ><a href="#"><i class="fa fa-fw fa-times text-danger"></i> Delete App</a></li> </ul> </div><!--end .btn-group --> </div> </div> <div class="row"> <div class="col-sm-12"> <div class="contain-xs pull-left"> <!-- Add class rootwizard 1 for extra progress bar color--> <div  class="form-wizard form-wizard-horizontal"> <div class="form floating-label"> <div class="form-wizard-nav"> <div class="progress"><div class="progress-bar progress-bar-primary"></div></div> <ul class="nav nav-justified">',
					element10: '	</ul> </div><!--end .form-wizard-nav --> </div> 	</div><!--end #rootwizard --> 	</div> </div><!--end .col --> </div> </div>',
					element11: '" class="deleteApp" data-toggle="modal" data-target="#deleteModal" ><a href="#"><i class="fa fa-fw fa-times text-danger"></i> Delete App</a></li> </ul> </div><!--end .btn-group --> </div> </div> <div class="row"> <div class="col-sm-12"> <div class="contain-xs pull-left"> <!-- Add class rootwizard 1 for extra progress bar color--> <div  class="form-wizard form-wizard-horizontal"> <div class="form floating-label"> <div class="form-wizard-nav">',
					autoMultiContainer: '<h1> This is a multi-project Container </h1>',
					forwardSlash: '/'
				};
				
				var progress = []; 
				progress[1] = '<li class="active"><a data-toggle="tab"><span class="step">1</span> <span class="title">CONFIG</span></a></li> <li><a data-toggle="tab"><span class="step">2</span> <span class="title">MODULES</span></a></li> <li><a data-toggle="tab"><span class="step">3</span> <span class="title">CONTENT</span></a></li> <li><a data-toggle="tab"><span class="step">4</span> <span class="title">APPSTORE</span></a></li> <li><a data-toggle="tab"><span class="step">5</span> <span class="title">REVIEW</span></a></li> <li><a data-toggle="tab"><span class="step">6</span> <span class="title">SUBMIT</span></a></li>';
				progress[2] ='<li><a data-toggle="tab"><span class="step">1</span> <span class="title">CONFIG</span></a></li> <li class="active"><a data-toggle="tab"><span class="step">2</span> <span class="title">MODULES</span></a></li> <li><a data-toggle="tab"><span class="step">3</span> <span class="title">CONTENT</span></a></li> <li><a data-toggle="tab"><span class="step">4</span> <span class="title">APPSTORE</span></a></li> <li><a data-toggle="tab"><span class="step">5</span> <span class="title">REVIEW</span></a></li> <li><a data-toggle="tab"><span class="step">6</span> <span class="title">SUBMIT</span></a></li>';
				progress[3] = '<li><a data-toggle="tab"><span class="step">1</span> <span class="title">CONFIG</span></a></li> <li><a data-toggle="tab"><span class="step">2</span> <span class="title">MODULES</span></a></li> <li class="active"><a data-toggle="tab"><span class="step">3</span> <span class="title">CONTENT</span></a></li> <li ><a data-toggle="tab"><span class="step">4</span> <span class="title">APPSTORE</span></a></li> <li><a data-toggle="tab"><span class="step">5</span> <span class="title">REVIEW</span></a></li> <li><a data-toggle="tab"><span class="step">6</span> <span class="title">SUBMIT</span></a></li>';
				progress[4] = '<li><a data-toggle="tab"><span class="step">1</span> <span class="title">CONFIG</span></a></li> <li><a data-toggle="tab"><span class="step">2</span> <span class="title">MODULES</span></a></li> <li><a data-toggle="tab"><span class="step">3</span> <span class="title">CONTENT</span></a></li> <li class="active"><a data-toggle="tab"><span class="step">4</span> <span class="title">APPSTORE</span></a></li> <li><a data-toggle="tab"><span class="step">5</span> <span class="title">REVIEW</span></a></li> <li><a data-toggle="tab"><span class="step">6</span> <span class="title">SUBMIT</span></a></li>';
				progress[5] = '<li><a data-toggle="tab"><span class="step">1</span> <span class="title">CONFIG</span></a></li> <li><a data-toggle="tab"><span class="step">2</span> <span class="title">MODULES</span></a></li> <li><a data-toggle="tab"><span class="step">3</span> <span class="title">CONTENT</span></a></li> <li ><a data-toggle="tab"><span class="step">4</span> <span class="title">APPSTORE</span></a></li> <li class="active"><a data-toggle="tab"><span class="step">5</span> <span class="title">REVIEW</span></a></li> <li><a data-toggle="tab"><span class="step">6</span> <span class="title">SUBMIT</span></a></li>';
				progress[6] = '<li><a data-toggle="tab"><span class="step">1</span> <span class="title">CONFIG</span></a></li> <li><a data-toggle="tab"><span class="step">2</span> <span class="title">MODULES</span></a></li> <li><a data-toggle="tab"><span class="step">3</span> <span class="title">CONTENT</span></a></li> <li ><a data-toggle="tab"><span class="step">4</span> <span class="title">APPSTORE</span></a></li> <li><a data-toggle="tab"><span class="step">5</span> <span class="title">REVIEW</span></a></li> <li class="active"><a data-toggle="tab"><span class="step">6</span> <span class="title">SUBMIT</span></a></li>';
				
				var fullListInsert = ''; 
				
				$.each(containerListData, function(index, key) {
					
					if(key.pc_type === '1'){
						var pc_id = key.pc_id;
						var pc_icon = key.pc_icon;
						var pc_name = key.pc_name;
						var cp_code = key.cp_code;
						var pc_type = key.pc_type;
						var autoContainerType = key.autoContainerType;
						var projectContainerInsert = '';
						
						if(autoContainerType === 'single'){
							var progressInsert = progress[parseInt(key.cms_project_progress, 10)];
							
							//TODO finish up this string that I will append to the containerListing
							projectContainerInsert = containerElements['element1'] + pc_id + 
								containerElements['element2'] + base_url + containerElements['element3'] +
								pc_id + containerElements['forwardSlash'] + pc_icon + containerElements['element4'] +
								pc_name + containerElements['element5']  + cp_code + containerElements['element6']  +
								base_url + containerElements['element7']  + pc_id + 
								containerElements['element8'] + pc_id + containerElements['element9'] + progressInsert + 
								containerElements['element10'];
						}else{
							projectContainerInsert = containerElements['element1'] + pc_id + 
								containerElements['element2'] + base_url + containerElements['element3'] +
								pc_id + containerElements['forwardSlash'] + pc_icon + containerElements['element4'] +
								pc_name + containerElements['element5']  + cp_code + containerElements['element6']  +
								base_url + containerElements['element7']  + pc_id + 
								containerElements['element8'] + pc_id + containerElements['element11'] + containerElements['autoMultiContainer'] +
								containerElements['element10'];
						}
						
						fullListInsert = fullListInsert + projectContainerInsert;
					}
					
					});
				
				containerList.html(fullListInsert);
				
			});
		}
		
	});
	
	// The rest of the code goes here!
	
}
));
