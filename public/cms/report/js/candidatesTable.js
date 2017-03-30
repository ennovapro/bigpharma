/**
 * This file is for the JavaScript that is used to display the 
 * interested candidates table
 *
 * https://stackoverflow.com/questions/2190801/passing-parameters-to-javascript-files
 */
var CandidatesTable = CandidatesTable || (function() {

	var pcuIds;
	var customListRowId;
	var table;


	function clickOnRow(table, jqueryRow) {
		var tr = $(jqueryRow).closest("tr");

		var row = table.row(tr);
		if(typeof row.data() === "undefined") return;

		// Choose whether to show / close
		// Ideally, close everything when opening up another student's
		if(row.child.isShown()) {
			// It's open, close it
			row.child.hide();
			tr.removeClass('shown');
		} else {
			row.child(formatDetails(row.data())).show();
			tr.addClass('shown');
		}
	}


	var formatDetails = function(d) {
		if(typeof d === "undefined") return "";

		if(('avatar_url' in d) === false) {
			d.avatar_url = "";
		}

		var profileSmallHeaderHtml = "";
		if(('linkedin_profile' in d) && d.linkedin_profile !== "") {
			d.linkedin_profile;
			profileSmallHeaderHtml = '<a href="' + d.linkedin_profile + '"><small class="text-sm opacity-75"> <i class="fa fa-linkedin-square"></i>  LinkedIn Profile</small></a>';
		} else if (('email' in d) && d.email !== "") {
			profileSmallHeaderHtml = '<a href="mailto:' + d.email + '"><small class="text-sm opacity-75"> ' + d.email + '</small></a>';
		}

		// d.name = "Name Placeholder";

		return '' +
			'<div class="col-lg-12 hbox-xs">' +
			'<div class="hbox-column width-2">' +
			'<img class="img-circle img-responsive pull-left" style="height: 84px; width: 84px;" src="' + d.avatar_url + '" onError="this.onerror=null;this.src=\'/public/backend/cms/img/default_user_avatar.png\';" alt>' + // There might be an error in these linkedin images
			'</div>' +
			'<div class="hbox-column v-top">' +
			'<div class="clearfix">' +
			'<div class="col-lg-12 margin-bottom-lg">' +
			'<span class="text-lg text-medium">' + d.name + '  </span>' +
			profileSmallHeaderHtml +
			'</div>' +
			'</div>' +
			'<div class="clearfix">' +
			'<div class="col-md-12">' +
			'<span class="gyphicon gyphicon-phone text-sm">Viewed you ' + d.num_views + ' times</span>' +
			'</div>' +
			'</div>' +
			'<div class="clearfix">' +
			'<div class="col-md-12">' +
			'<span class="gyphicon gyphicon-envelope text-sm">Viewed you at 0 other events<i class="md md-info-circle"></i></span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>';
	}

	/**
	 * Sending campaign data. This is not used for the graphing
	 */
	function sendCampaignData(customListRowId, numProfiles) {
		// TODO: Hotfix
		$.ajax({
			type: "POST",
			url: "/cms/campaign/updateConfigValues",
			data: {
				custom_list_row_id: customListRowId, 
				profiles_created_for_views: numProfiles
			}
		});
	}

	return {
		init: function(pcuIdsInit, clrId) {
			pcuIds = pcuIdsInit;
			customListRowId = clrId;
		},

		start() {
			console.log("I'm being start");
			$.ajax({
				url: "/cms/ajax/analytics_ajax/getInterestedUsers",
				type: "post",
				data: {
					pcuIds: pcuIds,
					customListRowId: clrId
				},
				success: function(response) {
					var data = JSON.parse(response);
					var anonProfilesCount = pcuIds.length - data.length;
					console.log("ayyy lmaooooo");

					var options = {
						ajax: {
							url: $("#datatable").data("source"),
							type: "post",
							data: {
								pcuIds: pcuIds,
								customListRowId: clrId
							},
							dataSrc: '',
						},
						columns: [
							// Number of headers in DataTable and columns must match or else JS error
						{
							class: 'details-control',
							orderable: false,
							data: null,
							defaultContent: ''
						},
						{ data: "name" },
						{ data: "email" },
						{ data: "major" },
						{ data: "graduation_year" },
						],

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
						// dom: 'T<"clear">lfrtip',
						dom: 'B<"clear">lfrtip',
						buttons: [
							'copyHtml5',
							'csvHtml5'
						], 
						initComplete: function(settings, json) {
							var firstRow = $("#datatable").find('tr.odd:first');
							clickOnRow(self.table, firstRow);
						}
					};


					options.language.info = "_START_ to _END_ of _TOTAL_ students. <br/>" + anonProfilesCount + " interested students did not have profiles.";

					self.table = $("#datatable").DataTable( options );

					$("#datatable tbody").on("click", "td", function() {
						clickOnRow(self.table, this);
					});

				}
			});

		}
	}
}());


