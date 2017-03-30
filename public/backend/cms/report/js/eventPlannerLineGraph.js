/**
 * This file is for the JavaScript that is used to display the 
 * dc.js linegraph
 *
 * It pulls data from analytics_ajax/getUserInputsForCustomListRow,
 * processes it, and then displays it
 *
 * https://stackoverflow.com/questions/2190801/passing-parameters-to-javascript-files
 */
var EventPlannerLineGraph = EventPlannerLineGraph || (function() {

	/**
	 * WIP
	 *
	 * Current
	 *
	 */

	// Create the two DC.js chart objects
	var chart = dc.lineChart('#user-data-line-graph');
	var rangeChart = dc.lineChart('#range-user-data-line-graph');

	var spinner = $("#line-graph-spinner");
	var graphs = $("#line-graphs");
	var errorMessage = $("#line-graph-error");

	// Get the width of the graph. This will be used later
	var width = $("#line-graphs-container").width();

	var filteredDimensions = [];
	var cf; // crossfilter
	var timestamp;
	var timestampGroup;
	var sixHoursGroup;
	var sixHours;
	var customListRowId;
	var endDate;
	var pcId;
	var pastXDays;
	var pcIdData;

	function getUserInputsForCustomListRowAndDisplayGraph() {
		/**
		 * Get all the custom list inputs
		 */
		$.ajax({
			type: "POST",
			url: "/cms/ajax/analytics_ajax/getEmployerOverviewData",
			data: {
				pcId: self.pcId,
				customListRowId: self.clrId,
				endDate: self.endDate,
				pastXDays: self.pastXDays,
			}
		})
		.done(function(data) {
			pcIdData = JSON.parse(data);

			// If (arbitrary) less than 5
			// data points, then show the error message instead
			if(pcIdData.length <= 5) {
				showComponent("error");
			} else {
				showComponent("graphs");
				displayGraphWithData(pcIdData.pcIdUserInputs);
			}
		}) 
		.fail(function(error) {
			showComponent("error");
		});
	}

	// Because of dc.js rendering issues, we need to add in data, on average
	// we will add ~730 data points per month of data
	function fillData(data, minTimestamp, maxTimestamp) {
		var minTimestamp = minTimestamp * 1000;
		var maxTimestamp = maxTimestamp * 1000;
		var secondsInAnHour = 60 * 60 * 1000;

		var remainder = minTimestamp % secondsInAnHour;
		var minRoundedTimestamp = minTimestamp - remainder;

		var remainder = maxTimestamp % secondsInAnHour;
		var maxRoundedTimestamp = maxTimestamp - remainder;

		var hoursToCreate = (maxRoundedTimestamp - minRoundedTimestamp) / secondsInAnHour;

		for(i = 0; i < hoursToCreate; i++) {
			var incrementTimestamp = minRoundedTimestamp + i * secondsInAnHour;

			data.push({
				pcuihId: -1,
				pcuId: -1,
				unix_timestamp: incrementTimestamp,
				filled_data: true
			});
		}
	}

	function augmentData() {
	}

	function customListOpenGroup(data) {
	}

	function customListFavoriteGroup(data) {
	}

	/**
	 * component = "spinner", "graphs", or "error"
	 */
	function showComponent(component) {
		if(component === null) return;

		$(".overview-line-graph-component").each(function() {
			var display = $(this).css("display").toLowerCase();

			if(display === "block") {
				$(this).fadeOut(400, function() {
					component = component.toLowerCase();
					var componentToShow;
					if(component === "spinner") {
						componentToShow = spinner;
					} else if (component === "graphs") {
						componentToShow = graphs;
					} else if (component === "error") {
						componentToShow = errorMessage;
					}

					if(componentToShow !== null) {
						componentToShow.fadeIn(400, function() {
						});
					}

				});

			}
		});

		return;
	}

	// https://github.com/dc-js/dc.js/wiki/FAQ#accumulate-values
	function accumulateGroup(source_group, key) {
		return {
			all:function () {
				var cumulate = 0;
				return source_group.all().map(function(d) {
					cumulate += d.value[key];
					return {
						key: d.key, 
						value: { 
							value: cumulate
						},
					};
				});
			}
		};
	}

	function accumulateGroupUniqueUsers(source_group, key) {
		return {
			all:function () {
				var users = [];
				var cumulate = 0;
				return source_group.all().map(function(d) {
					d.value.addedUsers.forEach(function(v, i) {
						if(users.indexOf(v) === -1) {
							cumulate++;
							users.push(v);
						}
					});

					return {
						key: d.key, 
						value: { 
							value: cumulate,
						}
					};
				});
			}
		};
	}

	/**
	 * Clear the filter completely
	 */
	function clearFilter() {
		filteredDimensions.forEach(function(v, i) {
			v.filterAll();
		});

		filteredDimensions = [];
	}

	/**
	 * Honestly, this needs to be in a better place
	 *
	 * Create reduceInitial, reduceAdd, and reduceRemove functions for reduction
	 * We cannot use default reduceSum because there are some values with duplicate
	 * timestamps
	 */
	var reduceInitial = function() {
		return {
			value: 0,
			addedUsers: [],
			count: 0
		};
	}

	var reduceAdd = function(p, v) {
		if(v.isReal === 1) {
			p.value++;
		}

		if(v.pcuId > 0 && p.addedUsers.indexOf(v.pcuId) === -1) {
			p.addedUsers.push(v.pcuId);
		}

		p.count++;
		return p;
	}

	var reduceRemove = function(p, v) {
		if(v.isReal === 1) {
			p.value--;
		} 

		var index = p.addedUsers.indexOf(v.pcuId);
		if(v.pcuId > 0 && index !== -1) {
			p.addedUsers.splice(index, 1);
		}

		p.count--;
		return p;
	}

	/* shitty name */
	function getNumbers(cf) {
		var numDownloads = 0;
		var users = [];
		timestampGroup.all().map(function(d) {
			d.value.addedUsers.forEach(function(v, i) {
				if(users.indexOf(v) === -1) {
					numDownloads++;
					users.push(v);
				}
			});
		});

		// Filter shit
		clearFilter();

		var userInputHeader = cf.dimension(function(d) {
			return d.pcuihId;
		});

		userInputHeader.filter(function(p) {
			return p == 1 || p == -1;
		});

		filteredDimensions.push(userInputHeader);

		var numFavorites = 0;
		timestampGroup.all().map(function(d) {
			numFavorites += d.value['value'];
		});

		clearFilter();

		var userInputHeader = cf.dimension(function(d) {
			return d.pcuihId;
		});

		userInputHeader.filter(function(p) {
			return p == 13 || p == -1;
		});

		var numViews = 0;
		timestampGroup.all().map(function(d) {
			numViews += d.value['value'];
		});

		filteredDimensions.push(userInputHeader);

		clearFilter();

		$("#summary-num-users").html(numDownloads + " students");
		$("#summary-num-views").html(numViews + " views");
		$("#summary-num-favorites").html(numFavorites + " favorites");
		$("#favorites-summary-num-views").html(numViews + " views");
		$("#favorites-summary-num-favorites").html(numFavorites + " favorites");
		if(numViews !== 0) {
			var percentage = (numFavorites * 100 / numViews).toFixed(1);
			$("#favorites-summary-percentage").html(percentage + " %");
		} else {
			$("#favorites-summary-percentage").html("0 %");
		}
	}


	function displayGraphWithData(data) {
		// Eventually I will want to compute the minimum / maximum of a particular group
		// For now, I can just use the minimum / maximum of everything 
		var minTimestamp = Number.MAX_SAFE_INTEGER;
		var maxTimestamp = Number.MIN_SAFE_INTEGER;

		// Convert all the unix timestamps from strings
		// into int's in case while sorting weird string comparison issue
		data.forEach(function(d) {
			d.unix_timestamp = parseInt(d.unix_timestamp) * 1000;
			d.date = new Date(d.unix_timestamp);
			if(d.unix_timestamp > maxTimestamp) {
				maxTimestamp = d.unix_timestamp;
			}

			if(d.unix_timestamp < minTimestamp) {
				minTimestamp = d.unix_timestamp;
			}
		});

		// Because of dc.js rendering issues, we need to add in data, on average
		// we will add ~730 data points per month of data
		fillData(data, minTimestamp / 1000, maxTimestamp / 1000);

		// https://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
		// Sort the array based off of unix timestamp
		data.sort(function(a, b){
			var keyA = a.date,
			keyB = b.date;

			// Compare the 2 dates
			if(keyA < keyB) return -1;
			if(keyA > keyB) return 1;
			return 0;
		});

		// Create a sum so we have something to plot
		var secondsInSixHours = 60 * 60 * 6 * 1000; // 1000 because js
		data.forEach(function(d) {
			var remainder = d.unix_timestamp % secondsInSixHours;
			d.six_hours = d.unix_timestamp - remainder;

			d.isReal = 0;
			if(!d.filled_data) {
				d.isReal = 1;
			}
		});

		// Create the crossfilter 
		cf = crossfilter(data);

		// Create the dimensions based on date objects
		timestamp = cf.dimension(function(d) {
			return d.unix_timestamp;
		});

		// Create reduceAdd
		timestampGroup = timestamp.group().reduce(reduceAdd, reduceRemove, reduceInitial);

		sixHours = cf.dimension(function(d) {
			return d.six_hours;
		});
		sixHoursGroup  = sixHours.group().reduce(reduceAdd, reduceRemove, reduceInitial);

		getNumbers(cf);

		chart
			.renderArea(true)
			.width(width)
			.height(300)
			.transitionDuration(600)
			.x(d3.time.scale().domain([new Date(minTimestamp), new Date(maxTimestamp)]))
			.dimension(timestamp)
			.group(accumulateGroupUniqueUsers(timestampGroup, 'value'), "Students Using The App")
			.brushOn(false)
			.rangeChart(rangeChart)
			.mouseZoomable(true)
			.interpolate('basis')
			.elasticY(true)
			.margins({top: 30, right: 50, bottom: 25, left: 40})
			.legend(dc.legend().x(65).y(30).itemHeight(13).gap(5))
			.valueAccessor(function(d) {
				return d.value.value;
			});

		rangeChart
			.elasticY(true)
			.renderArea(true)
			.width(width)
			.height(110)
			.brushOn(true)
			.interpolate('basis')
			.transitionDuration(600)
			.x(d3.time.scale().domain([new Date(minTimestamp), new Date(maxTimestamp)]))
			.dimension(timestamp)
			.group(accumulateGroupUniqueUsers(timestampGroup, 'value'))

			.margins({top: 30, right: 50, bottom: 25, left: 40})
			.valueAccessor(function(d) {
				return d.value.value;
			});

		dc.renderAll();

		$("#range-user-data-line-graph").find("rect.extent").each(function(i, item) {
			$(item).css("cursor", "pointer");
		});
	}

	function setupLineGraphControlListener() {
		$(".line-graph-control").click(function() {
			$(".line-graph-control").removeClass("active");
			$(this).addClass("active");
			var source = $(this).data("source").toLowerCase();

			if(typeof cf !== "undefined" && cf !== null) {

				clearFilter();
				// This removes the brush filter
				// ideally, we don't have to do this
				// But if we don't have it, then switching dimensions
				// causes some of the data to be lost
				//
				// Not completely sure why it happens
				chart.filterAll();
				rangeChart.filterAll();

				if(source === "views") {
					var userInputHeader = cf.dimension(function(d) {
						return d.pcuihId;
					});

					userInputHeader.filter(function(p) {
						return p == 13 || p == -1;
					});


					filteredDimensions.push(userInputHeader);
					chart
						.dimension(sixHours)
						.group(sixHoursGroup, 'Number of Views');
					rangeChart
						.dimension(sixHours)
						.group(sixHoursGroup);

				} else if (source === "favorites") {
					var userInputHeader = cf.dimension(function(d) {
						return d.pcuihId;
					});

					userInputHeader.filter(function(p) {
						return p == 1 || p == -1;
					});

					filteredDimensions.push(userInputHeader);

					chart
						.dimension(timestamp)
						.rangeChart(rangeChart)
						.group(accumulateGroup(timestampGroup, 'value'), "Favorites Received");

					rangeChart
						.dimension(timestamp)
						.group(accumulateGroup(timestampGroup, 'value'));

				} else if (source === "users") {

					chart
						.dimension(timestamp)
						.group(accumulateGroupUniqueUsers(timestampGroup, 'value'), "Students Using The App");
					rangeChart
						.dimension(timestamp)
						.group(accumulateGroupUniqueUsers(timestampGroup, 'value'));
				}


				dc.redrawAll();
			}
		});
	}



	return {
		init: function(pcId, clrId, endDate, pastXDays) {
			self.pcId = pcId;
			self.customListRowId = clrId;
			self.endDate = endDate;
			self.pastXDays = pastXDays;
		},

		start() {
			getUserInputsForCustomListRowAndDisplayGraph();
			setupLineGraphControlListener();
		}
	}
}());


