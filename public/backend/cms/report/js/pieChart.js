/**
 * This JavaScript controls the Major + Graduation year breakdown
 *
 * We use Google's Chart Visualization JS libraries
 * to render these charts
 */
var EmployerPieChart = EmployerPieChart || (function() {

	var google;
	var pcId;
	var pcuIds;
	var primaryHexColor;
	var majorHtmlId; // will be passed into  selectorById
	var graduationYearHtmlId; // will be passed into selectorById

	var majorPieChart = $("#major-pie-chart");
	var majorPieChartSpinner = $("#major-pie-chart-spinner");
	var majorPieChartError = $("#major-pie-chart-error");
	var graduationYearPieChart = $("#graduation-year-pie-chart");
	var graduationYearPieChartSpinner = $("#graduation-year-pie-chart-spinner");
	var graduationYearPieChartError = $("#graduation-year-pie-chart-error");

	/**
	 * This is going to start the graph
	 */
	function start() {
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawCharts);
	}

	/**
	 * Wrapper to call functions to download and render
	 * - major pie chart
	 * - graduation year pie chart
	 */
	function drawCharts() {
		downloadAndDrawMajorPieChart();
		downloadAndDrawGraduationYearPieChart();
	}

	/**
	 * component = "chart", "spinner", or "error"
	 */
	function showMajorComponent(component) {
		if(component === null) return;

		$(".major-pie-chart-component").each(function() {
			var display = $(this).css("display").toLowerCase();

			if(display === "block") {
				$(this).fadeOut(400, function() {
					component = component.toLowerCase();
					var componentToShow;
					if(component === "spinner") {
						componentToShow = majorPieChartSpinner;

					} else if (component === "chart") {
						componentToShow = majorPieChart;
					} else if (component === "error") {
						componentToShow = majorPieChartError;
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

	/**
	 * component = "spinner", "chart", or "error"
	 */
	function showGraduationYearComponent(component) {
		if(component === null) return;

		$(".graduation-year-pie-chart-component").each(function() {
			var display = $(this).css("display").toLowerCase();

			if(display === "block") {
				$(this).fadeOut(400, function() {
					component = component.toLowerCase();
					var componentToShow;
					if(component === "spinner") {
						componentToShow = graduationYearPieChartSpinner;
					} else if (component === "chart") {
						componentToShow = graduationYearPieChart;
					} else if (component === "error") {
						componentToShow = graduationYearPieChartError;
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

	function downloadAndDrawMajorPieChart() {
		$.ajax({
			type: "POST",
			url: "/cms/ajax/analytics_ajax/getMajorBreakdown",
			data: {
				pcuIds: pcuIds,
				pcId: pcId
			}
		})
		.success(function(response) {
			response = JSON.parse(response);

			if(response.length === 0) {
				majorPieChart.css("display", "none");
				showMajorComponent("error");
				return;
			} 

			var data = [];
			// This is not used. Google throws error if not here
			data.push(["Student Majors", "# of students in a major"]);

			$.each(response, function(i, item) {
				data.push([i, item]);
			});

			var colors = hexes(primaryHexColor, data.length);

			// Sort the data by values
			data.sort(function(a, b){
				return a[1] > b[1];
			});

			showMajorComponent("chart");
			drawChartWithData(data, "Majors for Students Who Viewed You", majorHtmlId, colors);
		})
		.fail(function(error) {
			majorPieChart.css("display", "none");
			showMajorComponent("error");
		});
	}

	function downloadAndDrawGraduationYearPieChart() {
		$.ajax({
			type: "POST",
	   		url: "/cms/ajax/analytics_ajax/getGraduationYearBreakdown",
			data: {
				pcuIds: pcuIds,
				pcId: pcId
			}
		})
		.done(function(response) {
			response = JSON.parse(response);

			if(response.length === 0) {
				graduationYearPieChart.css("display", "none");
				showGraduationYearComponent("error");
				return;
			} 

			var data = [];
			$.each(response, function(i, item) {
				data.push([i, item]);
			});

			var colors = hexes(primaryHexColor, data.length);

			// First organize the data by value
			data.sort(function(a, b){
				return a[1] > b[1];
			});

			// Add in the colors
			$.each(data, function(i, item) {
				item[2] = colors[i];
				data[i] = item;
			});

			// Then organize by label, ASC
			data.sort(function(a, b){
				return a[0] < b[0];
			});

			var newData = [];
			// This is not used. Google throws error if not here
			newData.push(["Student Graduation Years", "year the student is graduating in"]); 
			var newColors = [];
			$.each(data, function(i, item) {
				newData.push([item[0], item[1]]);
				newColors.push(item[2]);
			});

			showGraduationYearComponent("chart");
			drawChartWithData(newData, "Graduation Years for Students Who Viewed You", graduationYearHtmlId, newColors);
		})
		.fail(function(error) {
			graduationYearPieChart.css("display", "none");
			showGraduationYearComponent("error");
		});
	}

	function drawChartWithData(data, chartTitle, htmlId, colors) {

		var googleData = google.visualization.arrayToDataTable(data);
		var majorDiv = document.getElementById(htmlId);
		var chart = new google.visualization.PieChart(majorDiv);

		console.log("title: " + chartTitle);

		var options = {
			title: chartTitle,
			pieSliceText: 'label',
			pieSliceTextStyle: {
				fontName: 'Roboto',
			},
			legend: {
				position: 'right',
				maxLines: 1,
				alignment: 'center'
			},
			chartArea: {
				left: 42, 
				top: 10, 
				right: 0,
				bottom: 10,
				width: "100%", 
				height: "100%"
			}, 
			colors: colors,
			sliceVisibilityThreshold: 0.02,
		};

		chart.draw(googleData, options);
	}


	// convert RGBA color data to hex
	// https://stackoverflow.com/questions/9765618/javascript-shifting-issue-rgb-and-rgba-to-hex

	function rgbaTo6Hex(red, green, blue, alpha) {
		var rgb = rgbaToRgb(red, green, blue, alpha);
		var hex = rgbToHex(rgb.red, rgb.green, rgb.blue);
		return hex;
	}

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	/**
	 * RGBA to RGB assuming white background
	 */
	function rgbaToRgb(red, green, blue, alpha) {
		var background = {
			red: 255,
			green: 255,
			blue: 255
		};

		var inverseAlpha = 1 - alpha;
		red = Math.round((alpha * (red / 255) + (inverseAlpha * (background.red / 255))) * 255);
		green = Math.round((alpha * (green / 255) + (inverseAlpha * (background.green / 255))) * 255);
		blue = Math.round((alpha * (blue / 255) + (inverseAlpha * (background.blue / 255))) * 255);

		return {
			red: red,
			green: green,
			blue: blue
		};
	}

	function hexToRgba(hex, alpha){
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return {
				red: (c>>16)&255, 
				green: (c>>8)&255, 
				blue: c&255,
				alpha: alpha
			}
		}
	}

	function hexes(hex, numColors) {
		var hexes = [];
		var percent = 80.0 / (numColors * 100);
		var baseOpacity = 0.2;

		for(i = 0; i < numColors; i++) {
			var opacity = baseOpacity + i * percent;
			var rgba = hexToRgba(hex, opacity);
			var hexWithOpacity = rgbaTo6Hex(rgba.red, rgba.green, rgba.blue, rgba.alpha);
			hexes.push(hexWithOpacity);
		}

		return hexes;
	}

	return {
		init: function(googleInit, pcuIdsInit, primaryHexColorInit, majorHtmlIdInit, graduationYearHtmlIdInit, pcIdInit) {
			google = googleInit;
			pcuIds = pcuIdsInit;
			primaryHexColor = primaryHexColorInit;
			majorHtmlId = majorHtmlIdInit;
			graduationYearHtmlId = graduationYearHtmlIdInit;
			pcId = pcIdInit;
		},

		start() {
			start();
		}
	}
}());


