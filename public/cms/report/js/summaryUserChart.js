/**
 * Most of this is a relic of the DemoDashboard.js file included in the template
 *
 * TODO: Don't think this is great practice, right now it assumes certain data exists outside of this file
 *
 * TODO: Right now I will only support the past 7 days, but ideally in the future
 * The graph will be able to go back more than 7 days ago (I'm thinking a switch like
 * you see on most graphds with 7d, 1m, 3m, 1y, etc)
 *
 * TODO: yaxis labels aren't showing
 *
 * TODO: Clean up this a lot
 *
 * @author William Hua 01/06/2015
 */

(function (namespace, $) {
	"use strict";

    /// WILLIAM HUA ADDED HELPER FUNCTIONS, THESE SHOULD BE TEMP

    function componentToHex(c) {
            var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function applyOpacity(c, opacity) {
        return Math.round((opacity) * (c - 255) + 255);
        //return Math.round((c - (1 - opacity) * 255) / opacity);
    }

    //alert( rgbToHex(0, 51, 255) ); // #0033ff

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    //// END

	var DemoDashboard = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = DemoDashboard.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._initFlotVisitors();
		//this._initFlotRegistration();
        this._initMorris();
	};

	// =========================================================================
	// FLOT
	// =========================================================================

	p._initFlotVisitors = function () {
		var o = this;
		var chart = $("#flot-visitors");

		// Elements check
		if (!$.isFunction($.fn.plot) || chart.length === 0) {
			return;
		}

		// Chart data
		var data = [
			{
				label: 'Users',
                data: Data.cumulativeUsers,
				last: true,
			},
            // TEMP COMMENTING OUT FOR THE SCREENSHOT
			/*{
				label: 'Sessions',
				data: Data.cumulativeSessions,
                last: true,
                yaxis: 2
			}*/
		];

		// Chart options
		var labelColor = chart.css('color');
		var options = {
			colors: chart.data('color').split(','),
			series: {
				shadowSize: 0,
                points: {
                    show: true,
                },
				lines: {
					show: true,
					lineWidth: 3,
					fill: true
				},
				curvedLines: {
					//apply: true,
					apply: false,
					//active: true,
					active: false,
					monotonicFit: false
			   }
			},
			legend: {
				container: $('#flot-visitors-legend')
			},
			xaxis: {
				mode: "time",
				timeformat: "%d %b",
                font: {
                    color: labelColor,
                    size: 13,
                    family: "Roboto",
                },
                tickLength: 0, // Gets rid of grids for X axis
                ticks: 5, // TEMP For screenshot
            },
            yaxis: {
                font: {
                    color: labelColor,
                    size: 13,
                    family: "Roboto",
                },
                tickLength: 0, // Gets rid of grids for Y axis
            },
            // TEMP COMMENTING OUT FOR SCREENSHOT
            /*
            yaxes: [ {
                position: 0,
                axisLabel: "Users",
                axisLabelUseCanvas: true,
                axisLabelPadding: 5,

            },
            {
                axisLabel: "Sessions",
                axisLabelUseCanvas: true,
                axisLabelPadding: 5,
            }
            ],*/
            grid: {
				borderWidth: 0,
				color: labelColor,
				hoverable: true
			}
		};
		chart.width('100%');

		// Create chart
		var plot = $.plot(chart, data, options);

		// Hover function
		var tip, previousPoint = null;
		chart.bind("plothover", function (event, pos, item) {
			if (item) {
				if (previousPoint !== item.dataIndex) {
					previousPoint = item.dataIndex;

					var x = item.datapoint[0];
					var y = item.datapoint[1];
					var tipLabel = '<strong>' + $(this).data('title') + '</strong>';
					var tipContent = Math.round(y) + " " + item.series.label.toLowerCase() + " on " + moment(x).format('dddd');

					if (tip !== undefined) {
						$(tip).popover('destroy');
					}
					tip = $('<div></div>').appendTo('body').css({left: item.pageX, top: item.pageY - 5, position: 'absolute'});
					tip.popover({html: true, title: tipLabel, content: tipContent, placement: 'top'}).popover('show');
				}
			}
			else {
				if (tip !== undefined) {
					$(tip).popover('destroy');
				}
				previousPoint = null;
			}
		});
	};

	// =========================================================================
	// FLOT
	// =========================================================================

	p._initFlotRegistration = function () {
		var o = this;
		var chart = $("#flot-registrations");

		// Elements check
		if (!$.isFunction($.fn.plot) || chart.length === 0) {
			return;
		}

		// Chart data
		var data = [
			{
				label: 'Registrations',
				data: [
					[moment().subtract(11, 'month').valueOf(), 1100],
					[moment().subtract(10, 'month').valueOf(), 2450],
					[moment().subtract(9, 'month').valueOf(), 3800],
					[moment().subtract(8, 'month').valueOf(), 2650],
					[moment().subtract(7, 'month').valueOf(), 3905],
					[moment().subtract(6, 'month').valueOf(), 5250],
					[moment().subtract(5, 'month').valueOf(), 3600],
					[moment().subtract(4, 'month').valueOf(), 4900],
					[moment().subtract(3, 'month').valueOf(), 6200],
					[moment().subtract(2, 'month').valueOf(), 5195],
					[moment().subtract(1, 'month').valueOf(), 6500],
					[moment().valueOf(), 7805]
				],
				last: true
			}
		];

		// Chart options
		var labelColor = chart.css('color');
		var options = {
			colors: chart.data('color').split(','),
			series: {
				shadowSize: 0,
				lines: {
					show: true,
					lineWidth: 2
				},
				points: {
					show: true,
					radius: 3,
					lineWidth: 2
				}
			},
			legend: {
				show: false
			},
			xaxis: {
				mode: "time",
				timeformat: "%b %y",
				color: 'rgba(0, 0, 0, 0)',
				font: {color: labelColor}
			},
			yaxis: {
				font: {color: labelColor}
			},
			grid: {
				borderWidth: 0,
				color: labelColor,
				hoverable: true
			}
		};
		chart.width('100%');

		// Create chart
		var plot = $.plot(chart, data, options);

		// Hover function
		var tip, previousPoint = null;
		chart.bind("plothover", function (event, pos, item) {
			if (item) {
				if (previousPoint !== item.dataIndex) {
					previousPoint = item.dataIndex;

					var x = item.datapoint[0];
					var y = item.datapoint[1];
					var tipLabel = '<strong>' + $(this).data('title') + '</strong>';
					var tipContent = y + " " + item.series.label.toLowerCase() + " on " + moment(x).format('dddd');

					if (tip !== undefined) {
						$(tip).popover('destroy');
					}
					tip = $('<div></div>').appendTo('body').css({left: item.pageX, top: item.pageY - 5, position: 'absolute'});
					tip.popover({html: true, title: tipLabel, content: tipContent, placement: 'top'}).popover('show');
				}
			}
			else {
				if (tip !== undefined) {
					$(tip).popover('destroy');
				}
				previousPoint = null;
			}
		});
	};

    // =========================================================================
    // MORRIS
    // =========================================================================

    p._initMorris = function () {
        if (typeof Morris !== 'object') {
            return;
        }

        // Get the maximum of the sessions
        var max = -1;
        Data.sessions.forEach(function(entry) {
            if (entry.y > max) {
                max = entry.y;
            }
        });

        // This is the bar graph for the module summaries
        if ($('#sessions-summary-graph').length > 0) {
            Morris.Bar({
                element: 'sessions-summary-graph',
                data: Data.sessions,
                xkey: 'x',
                ykeys: ['y'],
                labels: ['Number of Sessions'],
                hideHover: true,
                barColors: function (row, series, type) {
                    var y = series.key;
                    var ratio = row.y / max;
                    var percentageAlpha = 0.5 + (ratio / 2);
                    var origHexString = $("#sessions-summary-graph").data("color")
                    var rgb = hexToRgb(origHexString);
                    rgb.r = applyOpacity(rgb.r, percentageAlpha);
                    rgb.g = applyOpacity(rgb.g, percentageAlpha);
                    rgb.b = applyOpacity(rgb.b, percentageAlpha);
                    var hex = rgbToHex(rgb.r, rgb.g, rgb.b);

                    return hex;
                },
            });
        }

        // Get the maximum
        max = -1;
        Data.modulesData.forEach(function(entry) {
            if (parseInt(entry.y) > parseInt(max)) {
                max = entry.y;
            }
        });

        // This is the bar graph for the module summaries
        if ($('#feature-summary-graph').length > 0) {
            Morris.Bar({
                element: 'feature-summary-graph',
                data: Data.modulesData,
                xkey: 'x',
                ykeys: ['y'],
                labels: ['Number of Clicks'],
                horizontal: true,
                hideHover: true,
                barColors: function (row, series, type) {
                    var y = series.key;
                    var ratio = row.y / max;
                    var percentageAlpha = 0.5 + (ratio / 2);
                    var origHexString = $("#feature-summary-graph").data("color")
                    var rgb = hexToRgb(origHexString);
                    rgb.r = applyOpacity(rgb.r, percentageAlpha);
                    rgb.g = applyOpacity(rgb.g, percentageAlpha);
                    rgb.b = applyOpacity(rgb.b, percentageAlpha);

                    var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                    return hex;
                },

            });
        }
    };

	// =========================================================================
	namespace.DemoDashboard = new DemoDashboard;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):
