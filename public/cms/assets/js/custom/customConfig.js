// IIFE - Immediately Invoked Function Expression
(function(executor) {
	
    // The global jQuery object is passed as a parameter
  	executor(window.jQuery, window, document);
	
	}(function($, window, document) {
	
    // The $ is now locally scoped
	
	// Listen for the jQuery ready event on the document
	$(function() {
		
		var configObject = {
			drawerSelect:{
				status: 'unchanged',
				value: ''
			},
			headerImage:{
				status: 'unchanged',
				value: ''
			},
			headerColor:{
				status: 'unchanged',
				value: ''
			},
			brandImage:{
				status: 'unchanged',
				value: ''
			},
			primaryText:{
				status: 'unchanged',
				value: ''
			},
			secondaryText:{
				status: 'unchanged',
				value: ''
			},
			primaryTextColor:{
				status: 'unchanged',
				value: ''
			},
			secondaryTextColor:{
				status: 'unchanged',
				value: ''
			}
		};
		
		var projectId = $('#projectId').attr('data-id');
		var headerContent = $('#headerContent');
		
		//Form input variables
		var drawerSelect = $('#drawerSelect');
		var headerColor = $('#headerColor');
		var headerImage = $('#headerImage');
		var primaryText = $('#primaryText');
		var primaryTextColor = $('#primaryTextColor');
		var secondaryText = $('#secondaryText');
		var secondaryTextColor = $('#secondaryTextColor');
		//Other Variables
		var next = $('#configNext');
		var previous = $('#configPrevious');
		
		//Set the original values of the config values.
		configObject.drawerSelect.value = drawerSelect.val();
		configObject.headerColor.value = headerColor.val();
		configObject.headerImage.value = headerImage.val();
		configObject.primaryText.value = primaryText.val();
		configObject.primaryTextColor.value = primaryTextColor.val();
		configObject.secondaryText.value = secondaryText.val();
		configObject.secondaryTextColor.value = secondaryTextColor.val(); 
		
		headerColor.colorpicker();
		primaryTextColor.colorpicker();
		secondaryTextColor.colorpicker();
		
		drawerSelect.on('change', function(){
			var drawerChoice = drawerSelect.val(); 

			if(drawerChoice != configObject.drawerSelect.value){
				configObject.drawerSelect.status = 'changed';
				var setConfigResult = setConfigValue(projectId, 'nav_drawer_header_visible', drawerChoice);
			}
			
			if(drawerChoice === 'true'){
				headerContent.slideDown();
				}else{
				headerContent.slideUp();
			}
		});
		
		headerColor.on('blur', function(){
			var headerColorValue = headerColor.val();
			if(headerColorValue != configObject.headerColor.value){
				configObject.headerColor.status = 'changed';
				var setConfigResult = setConfigValue(projectId, 'nav_drawer_header_background_color', headerColorValue);
			}
		});
		
		headerImage.on('change', function(){
			configObject.headerImage = headerImage.val();
			var options = { 	
				success: configImageResponse,
				beforeSubmit: checkConfigImage,  // pre-submit callback 
				resetForm: false        // reset the form after successful submit 
			}; 
			//This is the line of code to ajax the item image file 
			$('#imageUploadForm').ajaxSubmit(options); 
			return;			
		});
		
		primaryText.on('change', function(){
			var primaryTextValue  = primaryText.val();
			
			if(primaryTextValue != configObject.primaryText.value){
				configObject.primaryText.status = 'changed';
				var setConfigResult = setConfigValue(projectId, 'nav_drawer_primary_text', primaryTextValue);
			}
		});
		
		primaryTextColor.on('change', function(){
			var primaryTextColorValue  = primaryTextColor.val();
			
			if(primaryTextColorValue != configObject.primaryTextColor.value){
				configObject.primaryTextColor.status = 'changed';
				var setConfigResult = setConfigValue(projectId, 'nav_drawer_primary_text_color', primaryTextColorValue);
			}
		});
		
		secondaryText.on('change', function(){
			var secondaryTextValue  = secondaryText.val();
			
			if(secondaryTextValue != configObject.secondaryText.value){
				configObject.secondaryText.status = 'changed';
				var setConfigResult = setConfigValue(projectId, 'nav_drawer_secondary_text', secondaryTextValue);
			}
		});
		
		secondaryTextColor.on('blur', function(){
			var secondaryTextColorValue  = secondaryTextColor.val();
			
			if(secondaryTextColorValue != configObject.secondaryTextColor.value){
				configObject.secondaryText.status = 'changed';
				var setConfigResult = setConfigValue(projectId, 'nav_drawer_secondary_text_color', secondaryTextColorValue);
			}
		});
		//TODO Finish this function to check if the config object was changed before sending the user
		//to the next page. 
		next.on('click', function(){
			for (var key in configObject) {
				if (configObject.hasOwnProperty(key)) {
					//alert(key + " -> " + p[key]);
					alert(configObject[key].status);
				}
			}
		});
		
		previous.on('click', function(){
			alert();
		});
		//Eventually this function should be applicable to both projects and project containers if 
		//we choose to reuse this javascript code for both cases. 
		function setConfigValue(projectId, configKey, configValue){
			var setConfigStatus = false;
			$.post('/cms/project_ajax/setConfigValue', {projectId:projectId, configKey:configKey, configValue:configValue})
			.done(function(data){
				var configObjectUpdate = {
					nav_drawer_header_visible: function() { 
						configObject.drawerSelect.value = configValue; 
						configObject.drawerSelect.status = 'unchanged';
						return;
					},
					nav_drawer_header_background_img: function() { 
						configObject.headerImage.value = configValue; 
						configObject.headerImage.status = 'unchanged';
					},
					nav_drawer_header_background_color: function() { 
						configObject.headerColor.value = configValue; 
						configObject.headerColor.status = 'unchanged';
						return;
						},
					nav_drawer_brand_image: function(){
						configObject.brandImage.value = configValue; 
						configObject.brandImage.status = 'unchanged';
						return;
						},
					nav_drawer_primary_text: function(){
						configObject.primaryText.value = configValue; 
						configObject.primaryText.status = 'unchanged';
						return;
						},
					nav_drawer_secondary_text: function(){
						configObject.secondaryText.value = configValue; 
						configObject.secondaryText.status = 'unchanged';
						return;
						},
					nav_drawer_primary_text_color: function(){
						configObject.primaryTextColor.value = configValue; 
						configObject.primaryTextColor.status = 'unchanged';
						return;
						},
					nav_drawer_secondary_text_color: function(){
						configObject.secondaryTextColor.value = configValue; 
						configObject.secondaryTextColor.status = 'unchanged';
						return;
						}
				};
				
				if(data){
					configObjectUpdate[configKey]();
					setConfigStatus = true;
				}else{
					alert('didnt work');
				}
			});
			return setConfigStatus;
		}
		
		function configImageResponse(imageStatus, p2, p3, p4){
			alert(imageStatus);
			return;
		}
		
		function checkConfigImage(){
			//check whether browser fully supports all File API
			if (window.File && window.FileReader && window.FileList && window.Blob)
			{
				if(!headerImage.val()) //check empty input filed
				{
					alert('Image is not set');
					//TODO I need to put a status update here.
					return false;
				}
				
				var fsize = headerImage[0].files[0].size; //get file size
				var ftype = headerImage[0].files[0].type; // get file type

				//allow only valid image file types 
				switch(ftype)
				{
					case 'image/png': case 'image/gif': case 'image/jpeg': case 'image/pjpeg':
					break;
					default:
					$("#top_item_status").html("<b>"+ftype+"</b> Unsupported file type!");
					return false
				}
				
				//Allowed file size is less than 1 MB (1048576)   
				if(fsize>2048576) 
				{
					alert('too big');
					$("#top_item_status").html("<b>"+fsize +"</b> Too big Image file! <br />Please reduce the size of your photo using an image editor.");
					
					return false
				}

			}
			else
			{
				//Output error to older browsers that do not support HTML5 File API
				//$("#top_item_status").html("Please upgrade your browser, because your current browser lacks some new features we need!");
				alert('Please upgrade your browser.');
				return false;
			}
		}
	});
	
	// The rest of the code goes here!
	
}
));
