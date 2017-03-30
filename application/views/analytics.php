<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Analytics</title>

		<!-- BEGIN META -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="keywords" content="career,fair,mobile,app,analytics,analysis,performance">
		<meta name="description" content="Review your mobile app's performance">
		<!-- END META -->

        <!-- BEGIN MATERIAL DESIGN LIBRARY -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <!-- END MATERIAL DESIGN LIBRARY -->

		<!-- BEGIN STYLESHEETS -->
		<link href='http://fonts.googleapis.com/css?family=Roboto:300italic,400italic,300,400,500,700,900' rel='stylesheet' type='text/css'/>
		<link type="text/css" rel="stylesheet" href="public/backend/cms/assets/css/theme-default/bootstrap.css?1422792965" />
		<link type="text/css" rel="stylesheet" href="public/backend/cms/assets/css/theme-default/materialadmin.css?1425466319" />
		<link type="text/css" rel="stylesheet" href="public/backend/cms/assets/css/theme-default/font-awesome.min.css?1422529194" />
		<link type="text/css" rel="stylesheet" href="public/backend/cms/assets/css/theme-default/material-design-iconic-font.min.css?1421434286" />
		<link type="text/css" rel="stylesheet" href="public/backend/cms/assets/css/theme-default/libs/rickshaw/rickshaw.css?1422792967" />
		<link type="text/css" rel="stylesheet" href="public/backend/cms/assets/css/theme-default/libs/morris/morris.core.css?1420463396" />
        <link type="text/css" rel="stylesheet" href="public/backend/cms/report/css/report.css"/>
        <style type="text/css">
		/*
            .alert.alert-callout:before {
                background: <?php echo $primaryColor;?>;
            }

            .nav-tabs.graph-tabs > li.active > a {
                color: <?php echo $primaryColor;?>;
                border-color: <?php echo $primaryColor;?>;
            }
*/

        </style>
		<!-- END STYLESHEETS -->

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script type="text/javascript" src="<?php echo base_url();?>public/backend/cms/assets/js/libs/utils/html5shiv.js?1403934957"></script>
			<script type="text/javascript" src="<?php echo base_url();?>public/backend/cms/assets/js/libs/utils/respond.min.js?1403934956"></script>
		<![endif]-->
	</head>

	<body class="menubar-hoverable header-fixed ">
        <div style="height: 300px; background-color: <?php echo $secondaryColor?>;">
            <div id="header-container" style="padding-left: 12%; padding-right: 12%;">
                <h1 style="color: #ffffff; margin-top: 0px; margin-bottom: 0px; padding-top: 36px; font-weight: 300;"> Analytics </h1>
                <!-- <h3 style="color: #ffffff; margin-top: 0px; margin-bottom: 0px; padding-top: 8px; font-weight: 100;"> <?php echo "$projectContainerName: $projectName"; ?> </h3> -->
                <h3 style="color: #ffffff; margin-top: 0px; margin-bottom: 0px; padding-top: 8px; font-weight: 100;"> <?php echo "$projectName"; ?> </h3>
                <div class="row" style="margin-top: 12px;">
                    <div class="col-md-12">
                        <div class="card-head">
                            <ul class="nav nav-tabs sub-menu-tabs" data-toggle="tabs" style="border-bottom: 0px; padding-left: 0px; padding-right: 0px;">
                            <li class="active">
                                <a>Summary</a>
                            </li>
                            <!-- <li>
                                <a>Features</a>
                            </li>
                            <li>
                                <a>Users</a>
                            </li>
                            <li>
                                <a>Survey</a>
                            </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

		<!-- BEGIN CONAINER -->
        <div id="container" style="padding-left: 12%; padding-right: 12%; margin-top: -130px;">
			<!-- BEGIN CONTENT-->
			<div> <!--  id="content"> -->
                <div class="section-body">
                    <div id="statContainer">
                        <div id="summaryContainer">
                            <div class="row">
                                <!-- BEGIN SITE ACTIVITY -->
                                <div class="col-md-12">
                                    <div class="col-lg-12" style="padding-left: 0px; padding-right: 0px;">
                                        <h3 style="margin-top: 0px; margin-bottom: 12px; color: white;">Overview</h3>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="card">
                                                <div class="card-head">
                                                    <ul class="nav nav-tabs graph-tabs pull-left" data-toggle="tabs" style="border-bottom-width: 0px;">
                                                        <li id="users-tab" class="active">
                                                            <a href="#users-tab" style="display: inline-block; padding-right: 20px; padding-left: 20px;">USERS</a>
                                                            <i class="fa fa-info-circle" id="users-tooltip" data-toggle="tooltip" data-placement="top" data-original-title="The number of people who have downloaded and opened the app." style="margin-left: -20px; display: none; color: inherit;"></i>
                                                        </li>
                                                        <li id="sessions-tab">
                                                            <a href="#sessions-tab" style="display: inline-block; padding-right: 20px; padding-left: 20px;">SESSIONS</a>
                                                            <i class="fa fa-info-circle" id="sessions-tooltip" data-toggle="tooltip" data-placement="top" data-original-title="The number of times the app has been opened." style="margin-left: -20px; display: none; color: rgb(100, 100, 100);"></i>
                                                        </li>
                                                    </ul>
                                                    <ul class="nav nav-tabs graph-tabs pull-right" data-toggle="tabs" style="border-bottom-width: 0px;">
                                                        <li class="active">
                                                            <a href="#all-days-tab">ALL DAYS</a>
                                                        </li>
                                                        <li>
                                                            <a href="#past-30-days-tab">30 DAYS</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="card-body height-8 tab-content" style="margin-top: 10px;"> <!-- TEMP FOR SCREENSHOT, STYLE -->
                                                    <div class="tab-pane" id="users-tab">
                                                            <div id="flot-visitors-legend" class="flot-legend-horizontal stick-top-right no-y-padding"></div>
                                                            <div id="flot-visitors" class="flot height-7" data-title="Activity entry" data-color="<?php echo $primaryColor;?>"></div>
                                                        </div>
                                                        <div class="tab-pane active" id="sessions-tab"> <!-- TEMP SETTING ACTIVE ON THIS INSTEAD OF USERS TAB BECAUSE MORRIS GRAPH ISSUES -->
                                                            <div id="sessions-summary-graph" class="height-7" data-color="<?php echo $primaryColor;?>"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="col-lg-12">
                                                <h3>Engagement</h3>
                                            </div>
                                            <div class="col-md-12 col-sm-12">
                                                <div class="card">
                                                    <div class="card-body no-padding">
                                                        <div class="alert alert-callout no-margin">
                                                            <span class="pull-right" style="padding-top: 22px;"><i class="fa fa-exclamation text-warning" style="padding-right: 10px;"></i>Medium engagement</span> <!-- TEMP, fix this styling -->
                                                            <strong class="text-xl"><?php echo number_format($avgSessionsPerUser, 2); ?></strong><br/>
                                                            <span class="opacity-50">Sessions per User</span> <!-- I don't like this area -->
                                                        </div>
                                                    </div><!--end .card-body -->
                                                </div><!--end .card -->
                                            </div><!--end .col -->
                                                    <!--
                                            <div class="col-md-6 col-sm-6">
                                                <div class="card">
                                                    <div class="card-body no-padding">
                                                        <div class="alert alert-callout no-margin">
                                                            <h1 class="pull-right text-success"><i class="material-icons">query_builder</i></h1>
                                                            <span class="pull-right" style="padding-top: 22px;"><i class="md md-done text-success" style="padding-right: 10px;"></i>Very high engagement</span>
                                                            <strong class="text-xl"><?php // echo $deviceDict["android"]; ?></strong><br/>
                                                            <span class="opacity-50">Avg Interaction per User</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> -->
                                        </div>
                                        <div class="col-md-6">
                                            <div class="col-lg-12">
                                                <h3>Device Breakdown</h3>
                                            </div>
                                            <div class="col-md-6 col-sm-6">
                                                <div class="card">
                                                    <div class="card-body no-padding">
                                                        <div class="alert alert-callout no-margin">
                                                            <strong class="text-xl"><?php echo  $deviceDict["ios"]; ?></strong><br/>
                                                            <span class="opacity-50">iOS Users</span> <!-- I don't like this area -->
                                                        </div>
                                                    </div><!--end .card-body -->
                                                </div><!--end .card -->
                                            </div><!--end .col -->
                                            <div class="col-md-6 col-sm-6">
                                                <div class="card">
                                                    <div class="card-body no-padding">
                                                        <div class="alert alert-callout no-margin">
                                                            <strong class="text-xl"><?php echo $deviceDict["android"]; ?></strong><br/>
                                                            <span class="opacity-50">Android Users</span>
                                                        </div>
                                                    </div><!--end .card-body -->
                                                </div><!--end .card -->
                                            </div><!--end .col -->
                                        </div>
                                    </div><!--end .row -->
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="col-lg-12">
                                                <h3>Features</h3>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="card">
                                                    <div class="card-body height-8"> <!-- TEMP FOR SCREENSHOT, STYLE -->
                                                        <div id="feature-summary-graph" class="height-7" data-color="<?php echo "$primaryColor"; ?>"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div><!--end .row -->
                                </div>
                            </div>
                        </div><!--end .section-body -->
                    </div><!--end #content-->
                <!-- END CONTENT -->
                </div>
            </div><!--end .offcanvas-->
        <!-- END OFFCANVAS RIGHT -->
        </div><!--end #container-->
    <!-- END CONTAINER -->

<!-- BEGIN JAVASCRIPT -->
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/jquery/jquery-1.11.2.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/jquery/jquery-migrate-1.2.1.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/custom/customAnalytics.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/bootstrap/bootstrap.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/spin.js/spin.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/autosize/jquery.autosize.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/moment/moment.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/flot/jquery.flot.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/flot/jquery.flot.time.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/flot/jquery.flot.resize.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/flot/jquery.flot.orderBars.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/flot/jquery.flot.pie.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/flot/curvedLines.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/jquery-knob/jquery.knob.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/sparkline/jquery.sparkline.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/nanoscroller/jquery.nanoscroller.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/d3/d3.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/d3/d3.v3.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/rickshaw/rickshaw.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/raphael/raphael-min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/libs/morris.js/morris.min.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/App.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/AppNavigation.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/AppOffcanvas.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/AppCard.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/AppForm.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/AppNavSearch.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/source/AppVendor.js"></script>
<script src="<?php echo base_url();?>public/backend/cms/assets/js/core/demo/Demo.js"></script>

<script>
    // Data for summaryUserChart.js
    // TODO: not sure if this is good practice
    var Data = {};
    Data.cumulativeUsers = [];

    <?php foreach($cumulativeUsersDict as $key => $value) {
        echo "Data.cumulativeUsers.push([new Date(\"$key\").getTime(), $value]);";
    }
    ?>

    Data.sessions = [];
    <?php foreach($sessionsDict as $key => $value) {
        echo "Data.sessions.push({x: \"$key\", y: $value});";
    }
    ?>

    Data.modulesData = [];
    <?php foreach($modulesData as $moduleData) {
        $name = $moduleData["name"];
        $value = $moduleData["value"];
        echo "Data.modulesData.push({x: \"$name\", y: \"$value\"});";
    }
    ?>
</script>

<script src="<?php echo base_url();?>public/backend/cms/report/js/summaryUserChart.js"></script>

<script>
//
// Temp HACKY stuff so that the Morris Bar Chart works
//
$(document).ready(function() {
    $("div#users-tab").addClass("active");
    $("div#sessions-tab").removeClass("active");
});
</script>

<!-- END JAVASCRIPT -->

</body>
</html>
