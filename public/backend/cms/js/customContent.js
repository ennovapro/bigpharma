// IIFE - Immediately Invoked Function Expression
(function(executor) {

    // The global jQuery object is passed as a parameter
  	executor(window.jQuery, window, document);

	}(function($, window, document) {
	//global base_url variable
	var base_url = '' ;
	if(window.location.href.indexOf("dev") != -1){
		base_url = 'dev.eventus.io' ;
		}else{
		base_url = 'eventus.io';
	}
	var containerId = $('#content').attr('data-container-id');
	//global modalContentContainer variable
	var modalContentContainer = $('#modalContentContainer');

	// Listen for the jQuery ready event on the document
	$(function() {
		//Load initial content of content container based on the first listed module
		initialContentLoad();

		//Attach event listeners to modules tabs. Whenever user clicks a tab, populateContentContainer is called.
		$('.moduleTab').on('click', function(){
			var pmId = $(this).attr('id');
			populateContentContainer(pmId);
		});
	});

	//HTML INSERT TEMPLATES
    var customListInsertTemplate = $("#custom-list-insert-template").clone().html();

    //TODO: refactor these templates

    var headerInsertTemplate = $("#custom-list-header-insert-template").clone().html();

	var addRowModalTemplate = '<div class="modal-header"> \
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
	<h4 class="modal-title" id="formModalLabel">Add a Row</h4> \
	</div> \
	<div class="form-horizontal" role="form"> \
	<div class="modal-body"> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="title" class="control-label">Title</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="" id="title" class="form-control" placeholder="Title"> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="subtitle" class="control-label">Subtitle</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="" id="subtitle" class="form-control" placeholder="subtitle"> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="description" class="control-label">Description</label> \
	</div> \
	<div class="col-sm-9"> \
	<textarea name="" id="supportingText" class="form-control" placeholder="Description"></textarea> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="article_content" class="control-label">article_content</label> \
	</div> \
	<div class="col-sm-9"> \
	<textarea name="" id="article_content" class="form-control" placeholder="article_content"></textarea> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="backgroundColor" class="control-label">Background Color</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="backgroundColor" id="rowBackgroundColor" class="form-control colorInput" placeholder="Background Color"> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="cardType" class="control-label">Card Type</label> \
	</div> \
	<div class="col-sm-9">\
	<label class="checkbox-inline checkbox-styled">\
	<input id="compactChoice" type="checkbox" value="compact"><span>Compact</span>\
	</label>\
	<label class="checkbox-inline checkbox-styled">\
	<input id="favoriteChoice" type="checkbox" value="favorite"><span>Favorite</span>\
	</label>\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="backGroundImage" class="control-label">Background Image</label>\
	</div>\
	<div class="col-sm-9">\
	<p class="imgTxt">Choose a file</p>\
	</div>\
	<div class="col-sm-9 col-sm-offset-3">\
	<form class="form" action="/cms/ajax/project_ajax/uploadRowImage" method="post" enctype="multipart/form-data" id="rowImageUploadForm"> \
	<div class="form-group">\
	<input type="file" name="rowImage" id="rowImage" class="form-control">\
	<input name="containerId" type="hidden" value="CONTAINERID" />\
	</div>\
	</form> \
	</div>\
	</div>\
	<div id="addLinkGroup" class="form-group"> \
	<div class="col-sm-3"> \
	<label for="link" class="control-label">Add a Link</label> \
	</div> \
	<div class="col-sm-3"> \
	<button id="addLinkBtn" class="btn btn-block ink-reaction btn-default-light"> Add Link </button> \
	</div> \
	</div> \
	</div> \
	<div class="modal-footer"> \
	<span id="modalStatus" class="pull-left text-primary"> </span>\
	<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button> \
	<button id="addRowModalBtn" type="button" class="btn btn-primary btn-loading-state-addRow" data-loading-text=\'<i class="fa fa-spinner fa-spin"></i> Saving...\' data-header-id="HEADERID">Add</button> \
	</div> \
	</div>';
	var editRowModalTemplate = '<div class="modal-header"> \
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
	<h4 class="modal-title" id="formModalLabel">Edit Row</h4> \
	</div> \
	<div class="form-horizontal" role="form"> \
	<div class="modal-body"> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="title" class="control-label">Title</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="title" id="title" class="form-control" placeholder="" value="ROWTITLE"> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="subtitle" class="control-label">Subtitle</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="subtitle" id="subtitle" class="form-control" placeholder="" value="ROWSUBTITLE"> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="supportingText" class="control-label">Description</label> \
	</div> \
	<div class="col-sm-9"> \
	<textarea name="supportingText" id="supportingText" class="form-control">ROWDESCRIPTION</textarea> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="article_content" class="control-label">article_content</label> \
	</div> \
	<div class="col-sm-9"> \
	<textarea name="" id="article_content" class="form-control" placeholder="">ROWARTICLE</textarea> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="backgroundColor" class="control-label">Background Color</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="backgroundColor" id="rowBackgroundColor" class="form-control colorInput" value="ROWBACKGROUNDCOLOR"> \
	</div> \
	</div> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="cardType" class="control-label">Card Type</label> \
	</div> \
	<div class="col-sm-9">\
	<label class="checkbox-inline checkbox-styled">\
	<input id="compactChoice" type="checkbox" value="compact" ><span>Compact</span>\
	</label>\
	<label class="checkbox-inline checkbox-styled">\
	<input id="favoriteChoice" type="checkbox" value="favorite" ><span>Favorite</span>\
	</label>\
	</div>\
	</div>\
	<div id="imageFormGroup" class="form-group">\
	<div class="col-sm-3">\
	<label for="backGroundImage" class="control-label">Background Image</label>\
	</div>\
	<div class="col-sm-9">\
	<p class="imgTxt">FILENAME</p>\
	</div>\
	<div class="col-sm-9 col-sm-offset-3">\
	<form class="form" action="/cms/ajax/project_ajax/uploadRowImage" method="post" enctype="multipart/form-data" id="rowImageUploadForm"> \
	<div class="form-group">\
	<input type="file" name="rowImage" id="rowImage" class="form-control">\
	<input name="containerId" type="hidden" value="CONTAINERID" />\
	</div>\
	</form> \
	</div>\
	</div>\
	<div id="addLinkGroup" class="form-group"> \
	<div class="col-sm-3"> \
	<label for="linkGroup" class="control-label">Add a Link</label> \
	</div> \
	<div class="col-sm-9"> \
	<button id="addLinkBtn" class="btn btn-block ink-reaction btn-default-light"> Add Link </button> \
	</div> \
	</div> \
	</div> \
	<div class="modal-footer"> \
	<span id="modalStatus" class="pull-left text-primary"> </span>\
	<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button> \
	<button id="editRowModalBtn" type="button" class="btn btn-primary btn-loading-state-addRow" data-loading-text=\'<i class="fa fa-spinner fa-spin"></i> Saving...\' data-header-id="HEADERID">Save Changes</button> \
	</div> \
	</div>';
	var linkGroupTemplate1 = '  \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="link" class="control-label">LINKSEQUENCE</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="link" id="LINKNAME" class="form-control" placeholder="Link Name"> \
	</div> \
	<div class="col-sm-9 col-sm-offset-3"> \
	<input type="text" name="link" id="LINKROUTE" class="form-control" placeholder="Link Route"> \
	</div> \
	<div class="col-sm-9 col-sm-offset-3"> \
	<p id="ICONDISPLAY">Select an icon </p>\
	<div class="panel-group" id="ACCORDION"> \
	<div class="card panel"> \
	<div class="card-head card-head-xs collapsed" data-toggle="collapse" data-parent="ACCORDION" data-target="#ACCORDION-1"> \
	<header>Link Icons </header> \
	<div class="tools"> \
	<a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a> \
	</div> \
	</div> \
	<div id="ACCORDION-1" class="collapse"> \
	<div class="card-body"> \
	<div class="row"> \
	<div class="col-sm-2"> \
	<div class="tile-icon pointer iconContainer LINKINDEX"> \
	<img class="facebook_icon.png" src="http://' + base_url + '/public/core/library/social/facebook.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	<div class="col-sm-2"> \
	<div class="tile-icon pointer iconContainer LINKINDEX"> \
	<img class="linkedin.png" src="http://' + base_url + '/public/core/library/social/linkedin.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	<div class="col-sm-2"> \
	<div class="tile-icon pointer iconContainer LINKINDEX"> \
	<img class="twitter.png" src="http://' + base_url + '/public/core/library/social/twitter.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	<div class="col-sm-2">  \
	<div class="tile-icon pointer demo-icon-hover iconContainer LINKINDEX"> \
	<img class="web_icon.png" src="http://' + base_url + '/public/core/library/social/web_icon.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	</div> \
	</div> \
	</div> \
	</div><!--end .panel --> \
	</div><!--end .panel-group --> \
	</div><!--end .col -->\
	</div> ';
	var linkGroupTemplate2 = '  \
	<div class=""> \
	<div class="col-sm-3"> \
	<label for="link" class="control-label">LINKSEQUENCE</label> \
	</div> \
	<div class="col-sm-9"> \
	<input type="text" name="link" id="LINKNAMEID" class="form-control" value="LINKNAME" placeholder="Link Name"> \
	</div> \
	<div class="col-sm-9 col-sm-offset-3"> \
	<input type="text" name="link" id="LINKROUTEID" class="form-control" value="LINKROUTE" placeholder="Link Route"> \
	</div> \
	<div class="col-sm-9 col-sm-offset-3"> \
	<p id="ICONDISPLAY">Select an icon </p>\
	<div class="panel-group" id="ACCORDION"> \
	<div class="card panel"> \
	<div class="card-head card-head-xs collapsed" data-toggle="collapse" data-parent="ACCORDION" data-target="#ACCORDION-1"> \
	<header>Link Icons </header> \
	<div class="tools"> \
	<a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a> \
	</div> \
	</div> \
	<div id="ACCORDION-1" class="collapse"> \
	<div class="card-body"> \
	<div class="row"> \
	<div class="col-sm-2"> \
	<div class="tile-icon pointer iconContainer LINKINDEX"> \
	<img class="facebook_icon.png" src="http://' + base_url + '/public/core/library/social/facebook.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	<div class="col-sm-2"> \
	<div class="tile-icon pointer iconContainer LINKINDEX"> \
	<img class="linkedin.png" src="http://' + base_url + '/public/core/library/social/linkedin.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	<div class="col-sm-2"> \
	<div class="tile-icon pointer iconContainer LINKINDEX"> \
	<img class="twitter.png" src="http://' + base_url + '/public/core/library/social/twitter.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	<div class="col-sm-2">  \
	<div class="tile-icon pointer demo-icon-hover iconContainer LINKINDEX"> \
	<img class="web_icon.png" src="http://' + base_url + '/public/core/library/social/web_icon.png" width="40" height="40" alt="Facebook"> \
	</div> \
	</div> \
	</div> \
	</div> \
	</div> \
	</div><!--end .panel --> \
	</div><!--end .panel-group --> \
	</div><!--end .col -->\
	</div> ';

	var addCustomListHeaderTemplate = '<div class="modal-header"> \
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
	<h4 class="modal-title" id="formModalLabel">Add a Header</h4> \
	</div> \
	<div class="form-horizontal" role="form"> \
	<div class="modal-body"> \
	<div class="form-group"> \
	<div class="col-sm-3">\
	<label for="title" class="control-label">Name</label>\
	</div>\
	<div class="col-sm-9">\
	<input type="text" name="title" id="title" class="form-control" placeholder="Name">\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="backgroundColor" class="control-label">Background Color</label>\
	</div>\
	<div class="col-sm-9">\
	<input type="text" name="backgroundColor" id="backgroundColor" class="form-control colorInput" placeholder="Background Color">\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="iconBackgroundColor" class="control-label">Icon Background Color</label>\
	</div>\
	<div class="col-sm-9">\
	<input type="text" id="iconBackgroundColor" name="iconBackgroundColor"  class="form-control colorInput" placeholder="Icon Background Color">\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="icon" class="control-label">Icon</label>\
	</div>\
	<div class="col-sm-9">\
	<div class="panel-group" id="accordion2">\
	<div class="card panel">\
	<div class="card-head card-head-xs collapsed" data-toggle="collapse" data-parent="#accordion2" data-target="#accordion2-1">\
	<header>Link Icon: </header>\
	<div class="tools">\
	<a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>\
	</div>\
	</div>\
	<div id="accordion2-1" class="collapse">\
	<div class="card-body height-2" style="overflow-y:scroll">\
	<div class="row">\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer">\
	<img src="http://' + base_url +  '/public/core/library/social/facebook.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/linkedin.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/twitter.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer demo-icon-hover">\
	<img src="http://' +base_url +  '/public/core/library/social/sharethis.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	</div>\
	<!-- public/core/library/social -->\
	</div>\
	</div>\
	</div><!--end .panel -->\
	</div><!--end .panel-group -->\
	</div><!--end .col -->\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="backGroundImage" class="control-label">Background Image</label>\
	</div>\
	<div class="col-sm-9">\
	<p> Background Image</p>\
	</div>\
	<div class="col-sm-9 col-sm-offset-3">\
	<form class="form" action="/cms/ajax/project_ajax/uploadListHeaderImg" method="post" enctype="multipart/form-data" id="rowImageUploadForm"> \
	<div class="form-group">\
	<input type="file" name="headerImg" id="headerImg" class="form-control">\
	<input name="containerId" type="hidden" value="CONTAINERID" />\
	</div>\
	</form> \
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="listTemplate" class="control-label">List Template</label>\
	</div>\
	<div class="col-sm-9">\
	<div class="panel-group" id="accordion3">\
	<div class="card panel">\
	<div class="card-head card-head-xs collapsed" data-toggle="collapse" data-parent="#accordion3" data-target="#accordion3-1">\
	<header>Link Icon: </header>\
	<div class="tools">\
	<a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>\
	</div>\
	</div>\
	<div id="accordion3-1" class="collapse">\
	<div class="card-body">\
	<div class="row">\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/facebook.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/linkedin.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/twitter.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-9"> \
	<div class="tile-icon pointer demo-icon-hover">\
	<img src="https://s3.amazonaws.com/eventusio-static/core/projectcontainers/40/RF-8G+Crusader.jpg" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	</div>\
	<!-- public/core/library/social -->\
	</div>\
	</div>\
	</div><!--end .panel -->\
	</div><!--end .panel-group -->\
	</div><!--end .col -->\
	</div>\
	</div>\
	<div class="modal-footer">\
	<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
	<button id="addListHeaderBtn" type="button" class="btn btn-primary btn-loading-state" data-loading-text="<i class=\'fa fa-spinner fa-spin\'></i> Saving..." data-pm-id="PMID">Add</button>\
	</div>\
	</div>';

	var rowInsertTemplate = ' \
	<li class="tile ui-sortable-handle"> \
	<a class="tile-content ink-reaction"> \
	<div class="tile-icon"> \
	<img src="http://' + base_url + '/public/backend/cms/assets/img/avatar9.jpg?1404026744" alt=""> \
	</div> \
	<div class="tile-text"> \
	ROWTITLE \
	<small> \
	ROWDESCRIPTION \
	</small> \
	</div> \
	<a class="btn btn-flat ink-reaction btn-default editRowBtn" data-row-header-id="ROWHEADERID" data-toggle="modal" data-target="#formModal" > \
	<i class="fa fa-edit"></i>\
	</a> \
	<div class="btn-group">\
	<a class="btn ink-reaction btn-icon-toggle btn-primary deleteRowBtn" data-toggle="dropdown" data-row-header-id="ROWHEADERID"> \
	<i class="fa fa-trash"></i> \
	</a> \
	<ul class="dropdown-menu" role="menu">\
	<li class="rowDeleteBtn"data-row-header-id="ROWHEADERID"><a>Delete</a></li>\
	</ul>\
	</div>\
	</a> \
	</li> \
	';
	var editListHeaderModalTemplate = '<div class="modal-header"> \
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
	<h4 class="modal-title" id="formModalLabel">Edit Header</h4> \
	</div> \
	<div class="form-horizontal" role="form"> \
	<div class="modal-body"> \
	<div class="form-group"> \
	<div class="col-sm-3">\
	<label for="title" class="control-label">Name</label>\
	</div>\
	<div class="col-sm-9">\
	<input type="text" name="title" id="title" class="form-control" placeholder="Name" value="HEADERNAME">\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="" class="control-label">Background Color</label>\
	</div>\
	<div class="col-sm-9">\
	<input type="text" name="" id="subtitle" class="form-control colorInput" placeholder="Background Color" value="HEADERBACKGROUNDCOLOR">\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="" class="control-label">Icon Background Color</label>\
	</div>\
	<div class="col-sm-9">\
	<input type="text" class="form-control colorInput" placeholder="Icon Background Color" value="ICONBACKGROUNDCOLOR">\
	</div>\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="backgroundColor" class="control-label">Icon</label>\
	</div>\
	<div class="col-sm-9">\
	<div class="panel-group" id="accordion2">\
	<div class="card panel">\
	<div class="card-head card-head-xs collapsed" data-toggle="collapse" data-parent="#accordion2" data-target="#accordion2-1">\
	<header>Link Icon: </header>\
	<div class="tools">\
	<a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>\
	</div>\
	</div>\
	<div id="accordion2-1" class="collapse">\
	<div class="card-body">\
	<div class="row">\
	<div class="col-sm-2"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/facebook.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-2"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/linkedin.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-2"> \
	<div class="tile-icon pointer">\
	<img src="http://' +base_url +  '/public/core/library/social/twitter.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	<div class="col-sm-2"> \
	<div class="tile-icon pointer demo-icon-hover">\
	<img src="http://' +base_url +  '/public/core/library/social/sharethis.png" width="40" height="40" alt="Facebook">\
	</div>\
	</div>\
	</div>\
	<!-- public/core/library/social -->\
	</div>\
	</div>\
	</div><!--end .panel -->\
	</div><!--end .panel-group -->\
	</div><!--end .col -->\
	</div>\
	<div class="form-group">\
	<div class="col-sm-3">\
	<label for="backGroundImage" class="control-label">Background Image</label>\
	</div>\
	<div class="col-sm-9">\
	<p> HEADERIMAGENAME </p>\
	</div>\
	<div class="col-sm-9 col-sm-offset-3">\
	<input type="file" name="" id="subtitle" class="form-control">\
	</div>\
	</div>\
	</div>\
	<div class="modal-footer">\
	<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
	<button id="editListHeaderModalBtn" type="button" class="btn btn-primary btn-loading-state" data-loading-text="<i class=\'fa fa-spinner fa-spin\'></i> Saving..." data-pm-id="PMID">Add</button>\
	</div>\
	</div>';
	var uploadCSVModalTemplate = '<div class="modal-header"> \
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
	<h4 class="modal-title" id="formModalLabel">Upload a CSV or Excel File</h4> \
	</div> \
	<div class="form-horizontal" role="form"> \
	<div class="modal-body"> \
	<div class="form-group"> \
	<div class="col-sm-3"> \
	<label for="title" class="control-label">Upload CSV or Excel</label> \
	</div> \
	<div class="col-sm-9"> \
	<form class="form" action="/cms/ajax/project_ajax/uploadExcel" method="post" enctype="multipart/form-data" id="excelUploadForm"> \
	<input type="hidden" name="customListHeaderId" class="form-control" value="HEADERID"> \
	<input type="file" name="excelInput" id="excelInput" class="form-control" value=""> \
	</form>\
	</div> \
	</div> \
	</div> \
	<div class="modal-footer"> \
	<span id="modalStatus" class="pull-left text-primary"> </span>\
	<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button> \
	<button id="addCSVBtn" type="button" class="btn btn-primary btn-loading-state" data-loading-text=\'<i class="fa fa-spinner fa-spin"></i> Saving...\' data-header-id="HEADERID">Upload</button> \
	</div> \
	</div>\
	';

	// FUNCTIONS

    /*
     * Loads the initial content of the content container when the document finishes loading.
     * @author Peter Feng
     */
    function initialContentLoad(){
		var firstModuleId = $('.moduleTab').attr('id');
		populateContentContainer(firstModuleId);
	}

    /**
     * Update the user interface to reflect the data
     * associated with the given pmId
     *
     * Sends an AJAX request and updates the interface based on which kind of
     * module the pmId represents. Fills it in with the correct data
     *
     * @author Peter Feng
     */
	function populateContentContainer(pmId){
		var contentContainer = $('#contentContainer');
		$.post('/cms/ajax/project_ajax/getProjectModuleContent', { pmId:pmId })
		.done(function(data){
			var moduleData = JSON.parse(data);

            // Call the respective function to populate the content based off of response data
			var parseModuleContent = {
				customList: function() { populateCustomList(); },
				gallery: function() {},
				interactiveMap: function() {},
                floorPlan: function() { floorPlan.populateFloorPlan(pmId, moduleData); }
			};

			parseModuleContent[moduleData.pmType]();


            /*
             * Update the user interface with the custom list content
             *
             * @author Peter Feng
             */
			function populateCustomList(){
				var firstCustomListHeaderId = moduleData.customListHeaders[0].pmclh_id;
				//First put in the standard template for the custom list content container.
				var customListInsert = '';
				var customListMapObj = { PMID: pmId };
				customListInsert = customListInsertTemplate.replace(/PMID/gi, function(matched){
					return customListMapObj[matched];
				});

                // Update the main content (everything under the title of the module)
				contentContainer.html(customListInsert);

				// Next, populate the custom list header tabs with the provided module data.
				var fullHeaderInsert = '';
				$.each(moduleData.customListHeaders, function(index, value){
					var headerId = value.pmclh_id;
					var headerName = value.pmclh_name;
					var headerInsert = '';
					var mapObj = {
						HEADERID: headerId,
						HEADERTITLE: headerName
					};
					headerInsert = headerInsertTemplate.replace(/HEADERID|HEADERTITLE/g, function(matched){
						return mapObj[matched];
					});
					fullHeaderInsert = fullHeaderInsert + headerInsert;
				});
				$('#headerListContainer').html(fullHeaderInsert);

				//Next populate custom list rows with provided module data
				generateCustomListRows(firstCustomListHeaderId, 1);

				//Set event listeneres and data Ids
				attachCustomListEventListeners();
				setCustomListDataIds(firstCustomListHeaderId);
			}

		});
	}

	/*
	 *Get a set of custom list rows based off of header Id and index.
	 *@author PF
	 */
	function generateCustomListRows(customListHeaderId, index){
		$.post('/cms/ajax/project_ajax/getCustomListRows', {customListHeaderId:customListHeaderId, index:index})
		.done(function(data){
			var customListRowData = JSON.parse(data);
			var rowListContainer = $('#rowListContainer');
			var fullRowInsert = '';
			$.each(customListRowData, function(index, value){
				var rowTitle = value.title_text;
				var rowDescription = value.supporting_text;
				var rowHeaderId = index;
				if(typeof rowDescription != 'undefined'){
					if(rowDescription.length > 90){
						rowDescription = rowDescription.substring(0,90);
						rowDescription += '...';
					}
				}
				var rowInsert = '';
				var mapObj = {
					ROWTITLE: rowTitle,
					ROWDESCRIPTION: rowDescription,
					ROWHEADERID: rowHeaderId
				};

				rowInsert = rowInsertTemplate.replace(/ROWTITLE|ROWDESCRIPTION|ROWHEADERID/gi, function(matched){
					return mapObj[matched];
				});

				fullRowInsert = fullRowInsert + rowInsert;
			});
			$('#rowListContainer').html(fullRowInsert);
			attachCustomListEventListeners();

		});
	}
	/*
		* Set the modal to hold the template needed for user to input new rows into the custom list.
		*@author PF
	*/
	function setAddRowModal(headerId){
		var addRowModalInsert = '';
		var addRowModalMapObj = {
			HEADERID: headerId,
			CONTAINERID: containerId
		};
		addRowModalInsert = addRowModalTemplate.replace(/HEADERID|CONTAINERID/g, function(matched){
			return addRowModalMapObj[matched];
		});
		//Insert the modal template into the modal container
		modalContentContainer.html(addRowModalInsert);
		//Event Listeners that must be attached.
		$('#addRowModalBtn').on('click', function(){
			var headerId = $(this).attr('data-header-id');
			addCustomListRow(headerId);
		});
		$('#addLinkBtn').on('click', function(){
			var linkGroupInsert = '';
			if($('#firstLinkName').length > 0){
				if($('#secondLinkName').length > 0){
					if($('#thirdLinkName').length > 0){
						alert('no more links allowed');
						}else{
						linkGroupInsert = getLinkGroupInsert(3);
						$('#addLinkBtn').addClass('disabled');
					}
					}else{
					linkGroupInsert = getLinkGroupInsert(2);
				}
				}else{
				linkGroupInsert = getLinkGroupInsert(1);
			}
			$('#addLinkGroup').before(linkGroupInsert);
			setFormEventListeners();
		});
		setFormEventListeners();
	}
	/*
		* Set the modal to hold the row details specified by the row header id. Attach event listeners that call server functions
		* if user chooses to update the row details.
		*@author PF
	*/
	function setEditRowModal(rowHeaderId){
		$.post('/cms/ajax/project_ajax/getCustomListRowDetails', {rowHeaderId:rowHeaderId})
		.done(function(data){
			var customListRowDetailsObject = JSON.parse(data);
			//Create new original object to check against. Object values will either be set to the data provided or ''.
			//Set the form values to hold the original object values.
			//When creating the new object, compare the new objects values to the old one. Omit any null values from the check.
			var customListRowDetailsObjectOld = {
					title_text: customListRowDetailsObject.title_text != undefined ? customListRowDetailsObject.title_text : "",
					subtitle_text: customListRowDetailsObject.subtitle_text != undefined ? customListRowDetailsObject.subtitle_text : "",
					supporting_text: customListRowDetailsObject.supporting_text != undefined ? customListRowDetailsObject.supporting_text : "",
					article_content: customListRowDetailsObject.article_content != undefined ? customListRowDetailsObject.article_content : "",
					background_color: customListRowDetailsObject.background_color != undefined ? customListRowDetailsObject.background_color : "",
					compact: customListRowDetailsObject.compact != undefined ? customListRowDetailsObject.compact : "",
					favorite_button_exists: customListRowDetailsObject.favorite_button_exists != undefined ? customListRowDetailsObject.favorite_button_exists : "",
					link_exists_1: customListRowDetailsObject.link_exists_1 != undefined ? customListRowDetailsObject.link_exists_1 : "",
					top_image_url: customListRowDetailsObject.top_image_url != undefined ? customListRowDetailsObject.top_image_url.trim() : "No image provided",
					link_text_1: customListRowDetailsObject.link_text_1 != undefined ? customListRowDetailsObject.link_text_1 : "",
					link_url_1: customListRowDetailsObject.link_url_1 != undefined ? customListRowDetailsObject.link_url_1 : "",
					link_image_url_1: customListRowDetailsObject.link_image_url_1 != undefined ? customListRowDetailsObject.link_image_url_1 : "",
					link_exists_2: customListRowDetailsObject.link_exists_2 != undefined ? customListRowDetailsObject.link_exists_2 : "",
					link_text_2: customListRowDetailsObject.link_text_2 != undefined ? customListRowDetailsObject.link_text_2 : "",
					link_url_2: customListRowDetailsObject.link_url_2 != undefined ? customListRowDetailsObject.link_url_2 : "",
					link_image_url_2: customListRowDetailsObject.link_image_url_2 != undefined ? customListRowDetailsObject.link_image_url_2 : "",
					link_exists_3: customListRowDetailsObject.link_exists_3 != undefined ? customListRowDetailsObject.link_exists_3 : "",
					link_text_3: customListRowDetailsObject.link_text_3 != undefined ? customListRowDetailsObject.link_text_3 : "",
					link_url_3: customListRowDetailsObject.link_url_3 != undefined ? customListRowDetailsObject.link_url_3 : "",
					link_image_url_3: customListRowDetailsObject.link_image_url_3 != undefined ? customListRowDetailsObject.link_image_url_3 : ""
				};

			editRowModalInsert = '';
			//TODO append links if they exist.
			var editRowModalMapObj = {
				ROWTITLE: customListRowDetailsObjectOld.title_text,
				ROWSUBTITLE: customListRowDetailsObjectOld.subtitle_text,
				ROWDESCRIPTION: customListRowDetailsObjectOld.supporting_text,
				ROWARTICLE: customListRowDetailsObjectOld.article_content,
				ROWBACKGROUNDCOLOR: customListRowDetailsObjectOld.background_color,
				FILENAME: customListRowDetailsObjectOld.top_image_url,
				HEADERID: rowHeaderId,
				CONTAINERID: containerId
			};

			editRowModalInsert = editRowModalTemplate.replace(/ROWTITLE|ROWSUBTITLE|ROWDESCRIPTION|ROWARTICLE|ROWBACKGROUNDCOLOR|FILENAME|HEADERID|CONTAINERID/g, function(matched){
				return editRowModalMapObj[matched];
			});

			modalContentContainer.html(editRowModalInsert);

			if(customListRowDetailsObjectOld['compact'] === 'true'){
				$('#compactChoice').attr('checked', 'true');
			}
			if(customListRowDetailsObjectOld['favorite_button_exists'] === 'true'){
				$('#favoriteChoice').attr('checked', 'true');
			}
			$('#addLinkBtn').on('click', function(){
				var linkGroupInsert = '';
				if($('#firstLinkName').length > 0){
					if($('#secondLinkName').length > 0){
						if($('#thirdLinkName').length > 0){
							alert('no more links allowed');
							}else{
							linkGroupInsert = getLinkGroupInsert(3);
							$('#addLinkBtn').addClass('disabled');
						}
						}else{
						linkGroupInsert = getLinkGroupInsert(2);
					}
					}else{
					linkGroupInsert = getLinkGroupInsert(1);
				}
				$('#addLinkGroup').before(linkGroupInsert);
				setFormEventListeners();
			});
			//TODO Delete this "Expanded patch" when matt is done.
		if(customListRowDetailsObjectOld.link_exists_1 === 'expanded' || customListRowDetailsObjectOld.link_exists_1 === 'true'){
				getCompletedLinkGroup(1);
			}
			if(customListRowDetailsObjectOld.link_exists_2 === 'true'){
				getCompletedLinkGroup(2);
			}
			if(customListRowDetailsObjectOld.link_exists_3 === 'true'){
				getCompletedLinkGroup(3);
			}
		    var rowImage = $('#rowImage');
			var imgTxt = $('.imgTxt');
			rowImage.on('change', function(){
				imgTxt.html(rowImage.val().replace("C:\\fakepath\\", ""));
			});
			setFormEventListeners();
			/*
				*Function closure. Returns completed link html group to append to form.
				*@author PF
			*/
			function getCompletedLinkGroup(order){
				var numeralArray = [];
				numeralArray[1] = '1';
				numeralArray[2] = '2';
				numeralArray[3] = '3';
				var textArray = [];
				textArray[1] = 'first';
				textArray[2] = 'second';
				textArray[3] = 'third';
				var numeral = numeralArray[order];
				var text = textArray[order];
				var linkNameArray = [];
				linkNameArray[1] = 'link_text_1';
				linkNameArray[2] = 'link_text_2';
				linkNameArray[3] = 'link_text_3';
				var linkRouteArray = [];
				linkRouteArray[1] = 'link_url_1';
				linkRouteArray[2] = 'link_url_2';
				linkRouteArray[3] = 'link_url_3';

				var linkGroupInsert = '';
				var linkGroupMapObj = {
					LINKGROUPID: 'linkGroup' + numeral,
					LINKSEQUENCE: 'Link ' + numeral,
					LINKNAMEID: text + 'LinkName',
					LINKROUTEID: text + 'LinkRoute',
					LINKNAME: customListRowDetailsObjectOld[linkNameArray[order]],
					LINKROUTE: customListRowDetailsObjectOld[linkRouteArray[order]],
					ACCORDION: 'accordion' + numeral,
					//TODO
					//Fix the icon display issue.
					ICONDISPLAY: 'iconDisplay' + numeral,
					LINKINDEX: numeral
				};
				linkGroupInsert = linkGroupTemplate2.replace(/LINKGROUPID|LINKSEQUENCE|LINKNAMEID|LINKROUTEID|LINKNAME|LINKROUTE|ACCORDION|ICONDISPLAY|LINKINDEX/g, function(matched){
					return linkGroupMapObj[matched];
				});
				$('#imageFormGroup').append(linkGroupInsert);
			}
			//Upon clicking the editRowModalBtn the current values of the modal will be compared with the original values.
			$('#editRowModalBtn').on('click', function(){
				//Google docs quotation edit
				var fixedArticleContent = $('#article_content').val().replace(/”/g, '"');

				//Grab all the values inputted into the edit row modal form and store them in this object.
				var customListRowDetailsObjectNew = {
					title_text: $('#title').val(),
					subtitle_text: $('#subtitle').val(),
					supporting_text: $('#supportingText').val(),
					article_content: fixedArticleContent,
					background_color: $('#rowBackgroundColor').val().trim(),
					compact: ($('#compactChoice').attr("checked") ? 'true' : ''),
					favorite_button_exists: ($('#favoriteChoice').attr("checked") ? 'true' : ''),
					top_image_url: $('.imgTxt').html(),
					link_text_1:  $('#firstLinkName').val() != undefined ? $('#firstLinkName').val().trim() : "" ,
					link_url_1: $('#firstLinkRoute').val() != undefined ? $('#firstLinkRoute').val().trim() : "",
					link_image_url_1: $('#iconDisplay1').children('img').attr('class') != undefined ? $('#iconDisplay1').children('img').attr('class') : "",
					link_text_2: $('#secondLinkName').val() != undefined ? $('#secondLinkName').val().trim() : "",
					link_url_2: $('#secondLinkRoute').val() != undefined ? $('#secondLinkRoute').val().trim() : "",
					link_image_url_2: $('#iconDisplay2').children('img').attr('class') != undefined ? $('#iconDisplay2').children('img').attr('class') : "",
					link_text_3: $('#thirdLinkName').val() != undefined ? $('#thirdLinkName').val().trim() : "",
					link_url_3: $('#thirdLinkRoute').val() != undefined ? $('#thirdLinkRoute').val().trim() : "",
					link_image_url_3: $('#iconDisplay3').children('img').attr('class') != undefined ? $('#iconDisplay3').children('img').attr('class') : ""
				};
				//This object will store values that the user changed and be sent to the server for processing.
				var customListRowDetailsChangedValuesObject = {};
				//Compare the new values of the input form to the original values to determine what values to update
				//Set the old object values to the new ones if the two values differ.
				//Then I have to do something about the non-existent keys.
				for (var key in customListRowDetailsObjectNew) {
					if (customListRowDetailsObjectNew.hasOwnProperty(key)) {
							if(customListRowDetailsObjectNew[key] != customListRowDetailsObjectOld[key]){
								customListRowDetailsChangedValuesObject[key] = customListRowDetailsObjectNew[key];
								customListRowDetailsObjectOld[key] = customListRowDetailsObjectNew[key];
						}
					}
				}

				//Count the number of attributes in customListRowDetailsChangedValuesObject
				var objectLength = getObjectLength(customListRowDetailsChangedValuesObject);
				//If the customListRowDetailsChangedValuesObject has attributes, that means the user changed certian values.
				//Send those values to the server.
				if(objectLength > 0){
					var customListRowDetailsJSON = JSON.stringify(customListRowDetailsChangedValuesObject);
					//If the user provided an image, ajax the image file to the AWS Server.
					//IF the top_image_url property exists on the object, that means that the user provided an image.
					if(customListRowDetailsChangedValuesObject.hasOwnProperty('top_image_url')){
								var rowImageInput = $('#rowImage');
								var options = {
									success: submitRowEdits,
									beforeSubmit: checkImage(rowImageInput),  // pre-submit callback
									resetForm: false        // reset the form after successful submit
								};
								//This is the line of code to ajax the item image file
								$('#rowImageUploadForm').ajaxSubmit(options);
					}else{
						submitRowEdits();
					}
				}
				/*
				*Function closure to handle submitting row edits to the server.
				*@author PF
				*/
				function submitRowEdits(){
					$.post('/cms/ajax/project_ajax/updateCustomListRow', {rowHeaderId:rowHeaderId, customListRowDetailsJSON:customListRowDetailsJSON})
						.done(function(data){
							var updateStatus = JSON.parse(data);
							if(updateStatus['updateStatus'] === 'false'){
								alert('failed');
								}else{
								alert('success');
								return;
								//TODO, update the front end.
							}
						});
				}
			});
		});
	}
	function setAddCustomListHeaderModal(pmId){
		var addCustomListHeaderModalInsert = '';
		addCustomListHeaderTemplate
		var addCustomListHeaderModalMapObj = {
			PMID: pmId,
			CONTAINERID: containerId
		};
		addCustomListHeaderModalInsert = addCustomListHeaderTemplate.replace(/PMID|CONTAINERID/g, function(matched){
			return addCustomListHeaderModalMapObj[matched];
		});
		modalContentContainer.html(addCustomListHeaderModalInsert);
		setFormEventListeners();
		var addCustomListHeaderModalObjectOld = {
			//pmclh_name: ,
			//pmclh_bg_color: ,
			//pmclh_bg_image: ,
			//pmclh_icon: ,
			//pmclh_icon_bg_color: ,

			};
		$('#addListHeaderBtn').on('click', function(){
				alert();
		});
	}

	function setEditCustomListHeaderModal(customListHeaderId){
		$.post('/cms/ajax/project_ajax/getCustomListHeaderDetails', {customListHeaderId:customListHeaderId})
		.done(function(data){
			var customListHeaderDetails = JSON.parse(data);
			//Set the row detail variables
			var headerName = customListHeaderDetails.pmclh_name;
			var headerBackgroundColor = customListHeaderDetails.pmclh_bg_color;
			var icon = customListHeaderDetails.pmclh_icon;
			var iconBackgroundColor = customListHeaderDetails.pmclh_icon_bg_color;
			var headerImageName = customListHeaderDetails.pmclh_bg_image;

			editListHeaderModalInsert = '';

			var editListHeaderModalMapObj = {
				HEADERNAME: headerName,
				HEADERBACKGROUNDCOLOR: headerBackgroundColor,
				ICONBACKGROUNDCOLOR: iconBackgroundColor,
				HEADERIMAGENAME: headerImageName
			};

			editListHeaderModalInsert = editListHeaderModalTemplate.replace(/HEADERNAME|HEADERBACKGROUNDCOLOR|ICONBACKGROUNDCOLOR|HEADERIMAGENAME/g, function(matched){
				return editListHeaderModalMapObj[matched];
			});

			modalContentContainer.html(editListHeaderModalInsert);
			setFormEventListeners();
			$('#editListHeaderModalBtn').on('click', function(){
			});
		});
	}
	/*
		* Set the modal to provide UI for user to upload CSV file for the specified custom list header.
		*
		*@author PF
	*/
	function setUploadCSVModal(headerId){
		var uploadCSVModalMapObj = {
			HEADERID: headerId
		};
		var uploadCSVModalTemplateInsert = uploadCSVModalTemplate.replace(/HEADERID/g, function(matched){
			return uploadCSVModalMapObj[matched];
		});

		modalContentContainer.html(uploadCSVModalTemplateInsert);
		setFormEventListeners();
		var excelFile = $('#excelInput');

		$('#addCSVBtn').on('click', function(){
			checkFileType(excelFile)
			var excelUploadOptions = {
				success: successfulExcelUpload,
				resetForm: true        // reset the form after successful submit
			};
			$('#excelUploadForm').ajaxSubmit(excelUploadOptions);
		});
	}

	/*
		* Set the form event listeners that may be removed due to ajax.
		*@author PF
	*/
	function setFormEventListeners(){
		//Remove event listeners that may already be attached
		$('.iconContainer').off();
		//Standard form event listeners that need to be reattached
		$('.floating-label .form-control').on('keyup change', function (e) {
			var input = $(e.currentTarget);

			if ($.trim(input.val()) !== '') {
				input.addClass('dirty').removeClass('static');
				} else {
				input.removeClass('dirty').removeClass('static');
			}
		});

		$('.floating-label .form-control').each(function () {
			var input = $(this);
			if ($.trim(input.val()) !== '') {
				input.addClass('static').addClass('dirty');
			}
		});

		$('.form-horizontal .form-control').each(function () {
			$(this).after('<div class="form-control-line"></div>');
		});
		//TODO figure out why the colorpicker isn't working here.
		$('.colorInput').colorpicker();
		$('.iconContainer').on('click', function(){
			var iconImg = $(this).children('img').clone();
			if($(this).hasClass('1')){
				$('#iconDisplay1').html(iconImg);
				}else if($(this).hasClass('2')){
				$('#iconDisplay2').html(iconImg);
				}else{
				$('#iconDisplay3').html(iconImg);
			}
		});
	}

	function addCustomListRow(headerId){
		//Set the glabal window attribute addCustomListRowStatus to unchanged.
		window.addCustomListRowStatus = 'unchanged';
		//Grab the values of the add row modal form and store them in this object.
		var titleText = $('#title');
		var subtitleText = $('#subtitle');
		var supportingText = $('#supportingText');
		var articleContent = $('#article_content');
		var backgroundColor =  $('#rowBackgroundColor');
		var compactChoice = $('#compactChoice');
		var favoriteChoice = $('#favoriteChoice');
		var topImageUrl = $('#rowImage');
		var linkText1 = $('#firstLinkName');
		var linkUrl1 = $('#firstLinkRoute');
		var linkImageUrl1 = $('#iconDisplay1');
		var linkText2 = $('#secondLinkName');
	    var linkUrl2 = $('#secondLinkRoute');
		var linkImageUrl2 = $('#iconDisplay2');
		var linkText3 = $('#thirdLinkName');
		var linkUrl3 = $('#thirdLinkRoute');
		var linkImageUrl3 = $('#iconDisplay3');

		
		//Google docs quotation edit
		var fixedArticleContent = articleContent.val().replace(/”/g, '"');
		//TODO
		//Edit the code so that it accounts for people typing in shit and leaving it blank.
		var rowObject = {
			title_text: titleText.val(),
			subtitle_text: subtitleText.val(),
			supporting_text: supportingText.val(),
			article_content: fixedArticleContent,
			background_color: backgroundColor.val(),
			compact: (compactChoice.attr("checked") ? 'true' : ''),
			favorite_button_exists: (favoriteChoice.attr("checked") ? 'true' : ''),
			top_image_url: topImageUrl.val(),
			link_text_1: linkText1.val(),
			link_url_1: linkUrl1.val(),
			link_image_url_1: linkImageUrl1.children('img').attr('class'),
			link_text_2: linkText2.val(),
			link_url_2: linkUrl2.val(),
			link_image_url_2: linkImageUrl2.children('img').attr('class'),
			link_text_3: linkText3.val(),
			link_url_3: linkUrl3.val(),
			link_image_url_3: linkImageUrl3.children('img').attr('class')
		};
		//Check the values of the object. If the values aren't '', undefined, or null, that means the user provided a value.
		//Set the global addCustomListRowStatus attribute to changed if that's the case.
		for (var key in rowObject) {
			if (rowObject.hasOwnProperty(key)) {
				if(rowObject[key] != '' && rowObject[key] != null && rowObject[key] != undefined){
					window.addCustomListRowStatus = 'changed';
				}
			}
		}
		//If user didn't provide any input, tell them to provide input.
		if(window.addCustomListRowStatus != 'changed'){
			$('#modalStatus').html('Please provide input');
			return;
		}
		//If the user provided a row image, check the image properties. If it passes the check, ajax it to the server.
		//Once the image is successfully uploaded, call update database to input the rest of the row attributes to the database.
		if(rowObject.top_image_url != ''){
			var rowImageInput = $('#rowImage');
			var options = {
				success: updateDatabase,
				beforeSubmit: checkImage(rowImageInput),  // pre-submit callback
				resetForm: false        // reset the form after successful submit
			};
			//This is the line of code to ajax the item image file
			$('#rowImageUploadForm').ajaxSubmit(options);
			}else{
			updateDatabase('');
		}

		/*
		*Function closure. Send form values to server for insertion into the database. Reset form upon success.
		*@author PF
		*/
		function updateDatabase(data){
			if(data === 'success'){
				rowObject.top_image_url = rowObject.top_image_url.replace("C:\\fakepath\\", "");
			}
			var rowObjectJson = JSON.stringify(rowObject);

			$.post('/cms/ajax/project_ajax/insertCustomListRow', {rowObjectJson:rowObjectJson, headerId:headerId})
			.done(function(data){
				var rowInsertionStatus = JSON.parse(data);
				if(rowInsertionStatus.status === false){
					alert('failed');
					}else{
					//Upon successful insertion, reset the values of the form.
					titleText.val('');
					subtitleText.val('');
					supportingText.val('');
					articleContent.val('');
					backgroundColor.val('');
					compactChoice.attr('checked', false);
					favoriteChoice.attr('checked', false);
					topImageUrl.val('');
					linkText1.val('');
					linkUrl1.val('');
					linkImageUrl1.html('');
					linkText2.val('');
					linkUrl2.val('');
					linkImageUrl2.html('');
					linkText3.val('');
					linkUrl3.val('');
					linkImageUrl3.html('');
					var rowListContainer = $('#rowListContainer');
					var rowInsert = '';

					var mapObj = {
						ROWTITLE: rowObject.titleText,
						ROWDESCRIPTION: rowObject.supportingText,
						ROWHEADERID: headerId
					};
					//TODO append another row to the list row listing upon successful insertion of values into the database.
					rowInsert = rowInsertTemplate.replace(/ROWTITLE|ROWDESCRIPTION|ROWHEADERID/gi, function(matched){
						return mapObj[matched];
					});

					//rowListContainer.append();
					//Change the global addCustomListRowStatus attribute back to unchanged.
					window.addCustomListRowStatus = 'unchanged';
				}
			});

		}
	}

	function getLinkGroupInsert(order){
		var numeralArray = [];
		numeralArray[1] = '1';
		numeralArray[2] = '2';
		numeralArray[3] = '3';
		var textArray = [];
		textArray[1] = 'first';
		textArray[2] = 'second';
		textArray[3] = 'third';
		var numeral = numeralArray[order];
		var text = textArray[order];
		var linkGroupMapObj = {
			LINKSEQUENCE: 'Link ' + numeral,
			LINKNAME: text + 'LinkName',
			LINKROUTE: text + 'LinkRoute',
			ACCORDION: 'accordion' + numeral,
			ICONDISPLAY: 'iconDisplay' + numeral,
			LINKINDEX: numeral
		};
		var linkGroupInsert = linkGroupTemplate1.replace(/LINKSEQUENCE|LINKNAME|LINKROUTE|ACCORDION|ICONDISPLAY|LINKINDEX/g, function(matched){
			return linkGroupMapObj[matched];
		});
		return linkGroupInsert;
	}

	function checkImage(imageInput){
		//check whether browser fully supports all File API
		if (window.File && window.FileReader && window.FileList && window.Blob)
		{

			if(!imageInput.val()) //check empty input filed
			{
				alert('Image is not set');
				//TODO I need to put a status update here.
				return false;
			}

			var fsize = imageInput[0].files[0].size; //get file size
			var ftype = imageInput[0].files[0].type; // get file type

			//allow only valid image file types
			switch(ftype)
			{
				case 'image/png': case 'image/gif': case 'image/jpeg': case 'image/pjpeg':
				break;
				default:
				$("#modalStatus").html("<b>"+ftype+"</b> Unsupported image file type!");
				return false
			}

			//Allowed file size is less than 600 kilobytes
			if(fsize>600000)
			{
				alert('too big');
				$("#modalStatus").html("<b>"+fsize +"</b> Image file is too big! <br />Please reduce the size of your photo using an image editor.");

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
   /*
    * Attach the necessary event listeners of the custom list content editor elements. This is necessary since we use ajax,
	* and new elements are being created frequently which require new event listeners. 
	*@author PF
	*/
	function attachCustomListEventListeners(){
		var addCustomListHeaderBtn = $('#addCustomListHeaderBtn');
		var editCustomListHeaderBtn = $('.editCustomListHeaderBtn');
		var title = $('.title');
		var addRowBtn = $('#addRowBtn');
		var editRowBtn = $('.editRowBtn');
		var uploadCSVBtn = $('#uploadCSVBtn');
		var rowDeleteBtn = $('.rowDeleteBtn');
		//Unbind any existing event listener to keep event listeners from piling up.
		addCustomListHeaderBtn.off();
		editCustomListHeaderBtn.off();
		title.off();
		addRowBtn.off();
		editRowBtn.off();
		uploadCSVBtn.off();
		rowDeleteBtn.off();
		//Set the sortable functionality for the custom list rows.
		$('[data-sortable="true"]').sortable({
			placeholder: "ui-state-highlight",
			delay: 100,
			start: function (e, ui) {
				ui.placeholder.height(ui.item.outerHeight() - 1);
			}
		});
		//Set the custom list header event listeners.
		title.on('click', function(){
			var customListHeaderId = $(this).attr('id');
			//TODO add in the pagination capabilities later
			generateCustomListRows(customListHeaderId, 1);
			setCustomListDataIds(customListHeaderId);
		});
		//Set addRowBtn event listener
		addRowBtn.on('click', function(){
			var headerId = $(this).attr('data-header-id');
			setAddRowModal(headerId);
		});
		//Set editRowBtn event listener
		editRowBtn.on('click', function(){
			var rowHeaderId = $(this).attr('data-row-header-id');
			setEditRowModal(rowHeaderId);
		});
		rowDeleteBtn.on('click', function(){
			var rowHeaderId = $(this).attr('data-row-header-id');
			deleteRow(rowHeaderId, $(this));
		});
		//Set addCustomListHeaderBtn
		addCustomListHeaderBtn.on('click', function(){
			var pmId = $(this).attr('data-pm-id');
			setAddCustomListHeaderModal(pmId);
		});
		//Set editCustomListHeaderBtn
		editCustomListHeaderBtn.on('click', function(){
			var headerId = $(this).attr('data-header-id');
			setEditCustomListHeaderModal(headerId);
		});
		uploadCSVBtn.on('click', function(){
			var headerId = $(this).attr('data-header-id');
			setUploadCSVModal(headerId);
		});
	}
	/*
		* Set the data Ids of relevant custom list content editor elements
		* to hold the headerId of the specified custom list header.
		*@author PF
	*/
	function setCustomListDataIds(headerId){
		var addRowBtn = $('#addRowBtn');
		var sortChoice = $('.sortChoice');
		var templateChoice = $('.templateChoice');
		var uploadCSVBtn = $('#uploadCSVBtn');

		addRowBtn.attr('data-header-id', headerId);
		sortChoice.attr('data-header-id', headerId);
		templateChoice.attr('data-header-id', headerId);
		uploadCSVBtn.attr('data-header-id', headerId);
	}

	function checkFileType(excelFile){
		//TODO create checks to make sure the file type is csv or excel.
		var validExts = new Array(".xlsx", ".xls", ".csv");
		var fileExt = excelFile.val();
		fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
		if (validExts.indexOf(fileExt) < 0) {
			alert("Invalid file selected, valid files are of " +
			validExts.toString() + " types.");
			return false;
			} else {
			return true;
		}
	}

	function successfulExcelUpload(data){
		if(data === true){
			$('#modalStatus').html('CSV upload successful');
		}
	}
	/*
		*This function counts the number of attributes in an object.
		*@author PF
	*/
	function getObjectLength(object){
		var count = 0;
		var i;
		for (i in object) {
			if (object.hasOwnProperty(i)) {
				count++;
			}
		}
		return count;
	}
	/*
		*This function deletes the custom list off of the given row header ID
		*@author PF
	*/
	function deleteRow(rowHeaderId, deleteBtn){
		$.post('/cms/ajax/project_ajax/deleteCustomListRow', {rowHeaderId:rowHeaderId})
			.done(function(data){
					var deletionStatusObject = JSON.parse(data);
					if(deletionStatusObject.status === true){
						var elementToDelete = deleteBtn.parents('.ui-sortable-handle');
						elementToDelete.fadeOut(250, 'swing');
					}
				});
		}
}
));
