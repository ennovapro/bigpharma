// IIFE - Immediately Invoked Function Expression
(function(executor) {
	
    // The global jQuery object is passed as a parameter
  	executor(window.jQuery, window, document);
	
	}(function($, window, document) {
	
    // The $ is now locally scoped
	
	// Listen for the jQuery ready event on the document
	$(function() {
		

		/*
			var myApplication = {
			getInfo:function(){  },
			// we can also populate our object literal to support
			// further object literal namespaces containing anything
			// really:
			models : {},
			views : {
			pages : {}
			},
			collections : {}
			};
			
			The following options *do* check for variable/namespace existence.
			If already defined, we use that instance, otherwise we assign a new
			object literal to myApplication.
			Option 1: var myApplication = myApplication || {};
			Option 2  if(!MyApplication) MyApplication = {};
			Option 3: var myApplication = myApplication = myApplication || {}
			Option 4: myApplication || (myApplication = {});
			Option 5: var myApplication = myApplication === undefined ? {} : myApplication;
			
			Example of namespacing with IIFE:
			http://addyosmani.com/blog/essential-js-namespacing/#beginners
			
		*/
		
		$('#loginBtn').on('click', function(){
			
			var loginStatus = $('#loginStatus');
			var username =  $('#username').val();
			var password = $('#password').val();
			var loginCheck = validateLogin();
			
			if(loginCheck == true){
				
				logIn();
				
				}else{
				
				var loginFailure = {
					missingInput: function() { loginStatus.html('Please provide required credentials.').show().fadeOut(2000, 'swing'); },
					maliciousString: function() { loginStatus.html('Unallowed characters used.').show().fadeOut(2000, 'swing'); },
					other: function() { loginStatus.html('Login Failed.').show().fadeOut(2000, 'swing'); }
				};
				
			loginFailure[loginCheck]();
			
			}
			
			
			
			/*
				* A function closure for client side input checking.
				*
				* @author PF
			*/
			function validateLogin(){
				if(username == '' || password == ''){
					return 'missingInput';
				}else{
					return true;
				}
				//@PF I need to create a second check using Regex to make sure user didn't input malicious strings.
			}
			
			/*
				* A function closure for login validation.
				*
				* @PF
				*/
			function logIn(){
				
				$.post( "cms/ajax/login_ajax/validateLogin", { username: username, password: password })
				.done(function(data) {

					var loginArray = JSON.parse(data);
										
					if(loginArray['loginStatus'] == 'success'){
						window.location.replace('http://dev.eventus.io/cms/' + loginArray['orgId']  + '/portal');
						return;
					}
				});	
			}
		});
	});
	
	// The rest of the code goes here!
	
}
));
