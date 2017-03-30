/**
 * This file is for the JavaScript that is used to display the 
 * dc.js linegraph
 *
 * It pulls data from analytics_ajax/getUserInputsForCustomListRow,
 * processes it, and then displays it
 *
 * https://stackoverflow.com/questions/2190801/passing-parameters-to-javascript-files
 */
var ExhibitorLineGraph = ExhibitorLineGraph || (function() {

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
	var mediumIntervalDimension;
	var mediumIntervalGroup;

	// Group for short intervals
	var shortIntervalDimension;
	var shortIntervalGroup;

	// Values passed in
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
				pcId: pcId,
				customListRowId: customListRowId,
				endDate: endDate,
				pastXDays: pastXDays,
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

	/* bad name */
	function displaySummaryStatistics(cf, group) {
		var numDownloads = 0;
		var users = [];

		// Not too sure how to refactor this
		// but it's the accumulate unique users thing
		group.all().map(function(d) {
			d.value.addedUsers.forEach(function(v, i) {
				if(users.indexOf(v) === -1) {
					numDownloads++;
					users.push(v);
				}
			});
		});

		// Clear all the filters
		clearFilter();

		// Create the filter for favorites
		filterFavoritesOnlyForCustomListRowId(cf, customListRowId);

		var numFavorites = 0;
		group.all().map(function(d) {
			numFavorites += d.value['value'];
		});

		clearFilter();

		// Create the filter for views
		filterViewsOnlyForCustomListRowId(cf, customListRowId);

		var numViews = 0;
		group.all().map(function(d) {
			numViews += d.value['value'];
		});

		clearFilter();

		modifySummaryStatistics(numDownloads, numViews, numFavorites);
	}

	/**
	 * Modifies the HTML
	 */
	function modifySummaryStatistics(numDownloads, numViews, numFavorites) {
		$("#summary-num-users").html(numDownloads + " students");
		$("#summary-num-views").html(numViews + " views");
		$("#summary-num-favorites").html(numFavorites + " favorites");
		$("#favorites-summary-num-views").html(numViews + " views");
		$("#favorites-summary-num-favorites").html(numFavorites + " favorites");
		if(numViews !== 0) {
			var percentage = (numFavorites * 100 / numViews).toFixed(0);
			$("#favorites-summary-percentage").html(percentage + "% captured");
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
		var secondsInFourHours = 60 * 60 * 1 * 1000; // 1000 because js
		var secondsInFifteenMinutes = 30 * 60 * 1000; // 1000 because js
		data.forEach(function(d) {
			var mediumRemainder = d.unix_timestamp % secondsInFourHours;
			var shortRemainder = d.unix_timestamp % secondsInFifteenMinutes;
			d.unixTimestampRoundedToMediumInterval = d.unix_timestamp - mediumRemainder;
			d.unixTimestampRoundedToShortInterval = d.unix_timestamp - shortRemainder;

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

		// Create the timestamp grouping
		timestampGroup = timestamp.group().reduce(reduceAdd, reduceRemove, reduceInitial);

		// Create the medium interval group dimension
		mediumIntervalDimension = cf.dimension(function(d) {
			return d.unixTimestampRoundedToMediumInterval;
		});

		// Create the medium interval grouping
		mediumIntervalGroup = mediumIntervalDimension.group().reduce(reduceAdd, reduceRemove, reduceInitial);

		// Create the short interval group
		shortIntervalDimension = cf.dimension(function(d) {
			return d.unixTimestampRoundedToShortInterval;
		});

		// Create the short interval grouping
		shortIntervalGroup = shortIntervalDimension.group().reduce(reduceAdd, reduceRemove, reduceInitial);

		// Make sure to display the summary statistics
		displaySummaryStatistics(cf, shortIntervalGroup);

		// It would be really cool if we could annotate
		// when the event started and ended
		chart
			.renderArea(true)
			.width(width)
			.height(300)
			.transitionDuration(600)
			.x(d3.time.scale().domain([new Date(minTimestamp), new Date(maxTimestamp)]))
			.dimension(shortIntervalDimension)
			.group(accumulateGroupUniqueUsers(shortIntervalGroup, 'value'), "Cumulative # of students using the app")
			.brushOn(false)
			.rangeChart(rangeChart)
			.mouseZoomable(true)
			.interpolate('basis')
			.elasticY(true)
			.margins({top: 30, right: 50, bottom: 25, left: 40})
			.legend(dc.legend().x(65).y(30).itemHeight(13).gap(5))
			// .renderDataPoints(true)
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
			.dimension(shortIntervalDimension)
			.group(accumulateGroupUniqueUsers(shortIntervalGroup, 'value'))

			.margins({top: 30, right: 50, bottom: 25, left: 40})
			.valueAccessor(function(d) {
				return d.value.value;
			});

		dc.renderAll();

		// Make it a cursor over the rect extent
		$("#range-user-data-line-graph").find("rect.extent").each(function(i, item) {
			$(item).css("cursor", "pointer");
		});

		// Make it a cursor over the rect background
		$("#range-user-data-line-graph").find("rect.background").each(function(i, item) {
			$(item).css("cursor", "pointer");
		});
	}

	/**
	 * Filter the cross filter such that only views data for the given custom 
	 * list row id persists. 
	 *
	 * Assumes crossfilter has been cleared.
	 *
	 * Adds the filters to filteredDimensions array.
	 *
	 * Has many side effects on crossftiler environment.
	 * This needs to be used in conjunction with accumulate group
	 */
	function filterViewsOnlyForCustomListRowId(crossfilter, customListRowId) {
		var userInputHeader = cf.dimension(function(d) {
			return d.pcuihId;
		});

		userInputHeader.filter(function(p) {
			return p == 13 || p == -1;
		});

		var arg1dimension = cf.dimension(function(d) {
			return d.arg1;
		});

		arg1dimension.filter(function(p) {
			return p == customListRowId;
		});

		filteredDimensions.push(userInputHeader);
		filteredDimensions.push(arg1dimension);
	}

	/**
	 * Filter the cross filter such that only favorite data for the given custom 
	 * list row id persists. 
	 *
	 * Assumes crossfilter has been cleared.
	 *
	 * Adds the filters to filteredDimensions array.
	 *
	 * Has many side effects on crossftiler environment.
	 * This needs to be used in conjunction with accumulate group
	 */
	function filterFavoritesOnlyForCustomListRowId(crossfilter, customListRowId) {
		var userInputHeader = crossfilter.dimension(function(d) {
			return d.pcuihId;
		});

		userInputHeader.filter(function(p) {
			return p == 1 || p == -1;
		});

		var arg1 = crossfilter.dimension(function(d) {
			return d.arg1;
		});

		arg1.filter(function(p) {
			return p == customListRowId;
		});

		filteredDimensions.push(userInputHeader);
		filteredDimensions.push(arg1);
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
					filterViewsOnlyForCustomListRowId(cf, customListRowId);
					chart
						.dimension(mediumIntervalDimension)
						.group(mediumIntervalGroup, '# of views (per hour)');
					rangeChart
						.dimension(mediumIntervalDimension)
						.group(mediumIntervalGroup);

				} else if (source === "favorites") {
					filterFavoritesOnlyForCustomListRowId(cf, customListRowId);
					chart
						.dimension(shortIntervalDimension)
						.rangeChart(rangeChart)
						.group(accumulateGroup(shortIntervalGroup, 'value'), "Cumulative # of favorites received");

					rangeChart
						.dimension(shortIntervalDimension)
						.group(accumulateGroup(shortIntervalGroup, 'value'));

				} else if (source === "users") {
					chart
						.dimension(shortIntervalDimension)
						.group(accumulateGroupUniqueUsers(shortIntervalGroup, 'value'), "Cumulative # of students using the app");
					rangeChart
						.dimension(shortIntervalDimension)
						.group(accumulateGroupUniqueUsers(shortIntervalGroup, 'value'));
				}


				dc.redrawAll();
			}
		});
	}

	return {
		init: function(pcIdInit, clrId, endDateInit, pastXDaysInit) {
			pcId = pcIdInit;
			customListRowId = clrId;
			endDate = endDateInit;
			pastXDays = pastXDaysInit;
		},

		start: function() {
			getUserInputsForCustomListRowAndDisplayGraph();
			setupLineGraphControlListener();
		}
	}
}());


