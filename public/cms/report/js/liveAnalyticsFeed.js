/**
 * Function to set up the live analytics table after downloading
 * the data 
 */
function setupLiveAnalyticsFeed(data) {
	var list = $("#analytics-feed-body");
	$.each(data, function(i, item) {
		var timeAgo = moment(item.timestamp, "X").fromNow();
		var html = "" +
			"<tr>" +
			'<th style="padding: 6px 12px; border: 0px;">' +
			'<img class="profile-image-url" style="border-radius: 18px; height: 36px; padding: 3px;" src="' + item.profile_image_url + '" onError="this.onerror=null;this.src=\'/public/backend/cms/img/default_user_avatar.png\';">' + // There might be an error in these linkedin images
			'<span style="font-weight: normal; font-size: 16px; padding-left: 12px;">' + item.name + ' ' + item.action + '</span>' +
			'</th>' +
			'<th style="text-align: right; padding: 6px 12px; font-weight: normal; font-size: 16px; border: 0px;">' + timeAgo + '</th>' +
			'<th style="display:none;">' + item.timestamp + '</th>' +
			"</tr>" +
			"";
		list.append(html);
	});

	$("#analytics-feed").DataTable(analyticsFeedOptions);
}

/**
	* AJAX Request to download data needed for live analytics table
 */
$.ajax({
	type: "POST",
	url: "/cms/ajax/analytics_ajax/getEmployerFacingDescriptions",
	data: {
		customListRowId: clrId,
		endDate: endDate,
		pastXDays: pastXDays,
	},
	success: function(data) {
		data = JSON.parse(data);
		setupLiveAnalyticsFeed(data);
	}
});

var analyticsFeedOptions = {
	order: [[ 2, "desc" ]],
    language: {
		info: "_START_ to _END_ of _TOTAL_ students. <br/>35 interested students did not have profiles.",
		infoEmpty: "No students submitted a profile.",
        lengthMenu: "_MENU_ students per page.",
        search: "<i class='fa fa-search'></i>",
        paginate: {
            previous: '<i class="fa fa-angle-left"></i>',
            next: '<i class="fa fa-angle-right"></i>'
        }
    },

    // Not sure what this does, but it's required for buttons to work
    dom: 'tp',
    buttons: [
        'copyHtml5',
        'csvHtml5'
    ]
};

