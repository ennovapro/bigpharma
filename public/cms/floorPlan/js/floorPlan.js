/**
 * WH 01/28/16: I created the file. I used this SO question: https://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript
 * for guidelines on namespacing.
 *
 * I am also attempting to adhere to this guideline for naming: https://google.github.io/styleguide/javascriptguide.xml (look at section titled Naming)
 * TODO: EXPLAIN BETTER, I AM NOT STRICTLY ADHEREING TO THIS, HAVEN'T THOUGHT THIS THROUGH EITHER
 *
 * This assumes JQuery
 *
 * TODO: I feel like my functions need better names
 * TODO: There should be generic helper functions (_addPins...), and listener
 * helper functions (_setRemoveButtonListener())
 *
 * @author William Hua
 */

(function (floorPlan, $, undefined) {
    "use strict";

    // HTML Convenience variables required for later usage
    var contentContainer = $('#contentContainer');
    var floorPlanHeaderInsertTemplate = $("#floor-plan-header-insert-template").clone().html();
    var floorPlanInsertTemplate = $("#floor-plan-insert-template").clone().html();
    var floorPlanMapInsertTemplate = $("#floor-plan-map-insert-template").clone().html();
    var floorPlanItemInsertTemplate = $("#floor-plan-item-insert-template").clone().html();

    // FIMXE
    var horizontalOffset = 3;
    var verticalOffset = 42;

    var pmId;

    // TOASTR Options
    toastr.options = {
        "closeButton": false,
        "progressBar": false,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "showDuration": 330,
        "hideDuration": 330,
        "timeOut":  2000,
        "extendedTimeOut": 1000,
        "showEasing": "swing",
        "hideEasing": "swing",
        "showMethod": "slideDown",
        "hideMethod": "slideUp",
        "onclick": null
    }


    /**
     * Update the user interface with the appropriate floor plan
     *
     * @author William Hua
     */
    floorPlan.populateFloorPlan = function(localPmId, moduleData) {
        pmId = localPmId; // This is called local so that it won't conflict with pmId from floorPlan namespace
        var floorPlanInsert = '';
        var floorPlanMapObj = { PMID: pmId };
        floorPlanInsert = floorPlanInsertTemplate;

        // Update the main content (everything under the title of the module)
        contentContainer.html(floorPlanInsert);

        // Populate floor plan header tabs
        var floorPlanHeaderInsert = '';
        $.each(moduleData.floorPlanContainer.floorPlans, function(index, value) {
            var mapObj = {
                HEADERID: value.id,
            HEADERTITLE: value.name,
            INDEX: index
            };

            var insert = floorPlanHeaderInsertTemplate.replace(/HEADERID|HEADERTITLE|INDEX/g, function(matched){
                return mapObj[matched];
            });

            floorPlanHeaderInsert = floorPlanHeaderInsert + insert;

        });

        $('#headerListContainer').html(floorPlanHeaderInsert);

        _updateInterfaceForFloorPlan(moduleData.floorPlanContainer.floorPlans[0]);

        $.each(moduleData.floorPlanContainer.floorPlans, function(index, value) {
            // Make it update interface for floor plan on click
            $("#" + value.id + "").on('click', function() {
                var index = $(this).attr("data-index");
                _updateInterfaceForFloorPlan(moduleData.floorPlanContainer.floorPlans[parseInt(index)]);
            });
        });

        $("#add-floor-plan-header-btn").on("click", function() { // When it's clicked
            // also get the pmfphId
            var name = $("#fp-name").val();
            var shortDescription = $("#fp-short-description").val();
            var bgColor = $("#fp-bg-color").val();
            var textColor = $("#fp-text-color").val();

            $.post('/cms/ajax/project_ajax/insertFloorPlanItem', {
                pmfpchId: floorPlan.id, //TEMP
                name: name,
                shortDescription: shortDescription,
                bgColor: bgColor,
                textColor: textColor
            })
            .done(function(data){
                // close out of modal

                // you have to create a floor plan object and add it to the moduleData

                var mapObj = {
                    HEADERID: value.id,
                HEADERTITLE: value.name,
                INDEX: index
                };

                // create another header to add on, also destroy the modal
                $("#headerListContainer").append(floorPlanHeaderInsertTemplate.replace(/HEADERID|HEADERTITLE|INDEX/g, function(matched) {
                    return mapObj[matched];
                }));
            });

        });
    }

    /**
     * Refactor this
     *
     * @author William Hua
     */
    function _databaseXToCss(x, floorPlan) {
        var height = $("#floor-plan-image").height();
        var width = $("#floor-plan-image").width();

        var heightRatio = height / floorPlan.height;
        var widthRatio = width / floorPlan.width;

        return widthRatio * parseInt(x) + horizontalOffset;
    }

    /**
     * Refactor this
     *
     * @author William Hua
     */
    function _databaseYToCss(y, floorPlan) {
        var height = $("#floor-plan-image").height();
        var width = $("#floor-plan-image").width();

        var heightRatio = height / floorPlan.height;
        var widthRatio = width / floorPlan.width;

        return height - (heightRatio * parseInt(y)) + verticalOffset;
    }

    /**
     * This needs a better name, refactor this shit
     *
     * @author William Hua
     */
    function _cssXToDatabase(selectedItem, floorPlan) {
        var height = $("#floor-plan-image").height();
        var width = $("#floor-plan-image").width();
        var heightRatio = height / floorPlan.height;
        var widthRatio = width / floorPlan.width;

        var xCoord = (parseInt(selectedItem.css('left').substring(0, selectedItem.css('left').length - 2)) - horizontalOffset) / widthRatio;
        return xCoord;
    }

    /**
     * This needs a better name, refactor this shit
     *
     * @author William Hua
     */
    function _cssYToDatabase(selectedItem, floorPlan) {
        var height = $("#floor-plan-image").height();
        var width = $("#floor-plan-image").width();
        var heightRatio = height / floorPlan.height;
        var widthRatio = width / floorPlan.width;

        var yCoord = (height - parseInt(selectedItem.css('top').substring(0, selectedItem.css('top').length - 2)) + verticalOffset) / heightRatio;
        return yCoord;
    }

    /**
     * This resets the screen back to the state of not being clicked.
     * It does NOT remove the pins from the screen
     *
     * @author William Hua
     */
    function _resetPins() {
        // Delete all the new pins (that haven't been inserted to the database,
        // but the UI exists on the map)
        $('.floor-plan-marker[data-new=1]').remove();

        // Make everything unselected
        $('.floor-plan-marker').css('opacity', 0.6);
        $('.floor-plan-marker').attr('data-selected', 0);

        // Clear out the menu on the right
        $("#item-header").html("Item Detail");
        $('#item-name').val("");
        $('#short-desc').val("");
        $('#x-coord').val("");
        $('#y-coord').val("");
        $('#tags').val("");
        $('#goto-link').val("");
    }

    /**
     * Add pins onto the floor plan when you click anywhere on the floor plan
     *
     * @author William Hua
     */
    function _setFloorPlanListener(floorPlan) {
        $('#floor-plan-image').on('click', function(e) {
            var offset = $(this).offset();

            // Turn opacity off for all other pins
            _resetPins();


            // Create a new pin, set the "new" flag (remove the new flag when the user submits the information)
            var insert = $("#floor-plan-item-insert-template").clone(); // Has to clone so that I'm using a copy
            var xCoordCss = e.pageX - offset.left + horizontalOffset;
            var yCoordCss = e.pageY - offset.top + verticalOffset;
            insert.find('.floor-plan-marker').css('left', xCoordCss).css('top', yCoordCss).css('opacity', 1);
            insert.find('.floor-plan-marker').attr('data-new', '1');
            insert.find('.floor-plan-marker').attr('data-selected', '1');
            insert.find('.floor-plan-marker').attr('x-coord', '1');
            insert.find('.floor-plan-marker').attr('data-selected', '1');

            // Update the X / Y
            var selectedItem = insert.find('.floor-plan-marker[data-selected=1]');

            $('#x-coord').val(_cssXToDatabase(selectedItem, floorPlan));
            $('#y-coord').val(_cssYToDatabase(selectedItem, floorPlan));

            /**
              insert.find('.floor-plan-marker')
              .attr('marker-id', value.id)
              .attr('marker-name', value.name)
              .attr('marker-short-desc', value.shortDescription)
              .attr('marker-tags', value.tags)
              .attr('marker-goto-link', value.gotoLink);
              */


            // Add the newly created pin to the UI
            $('#floor-plan-item-container').append(insert.html());

            // Change button to "submit"
            $("#update-floor-plan-item-btn").html("Submit");
        });
    }


    /**
     * Update interface of the pin and the menu
     * when you click on a pin
     *
     * @author William Hua
     */
    function _setPinListener() {
        $("#floor-plan-item-container").on("click", ".floor-plan-marker", function(e) { //
            _resetPins();

            // Increase the opacity of this marker, but not the other markers
            $(this).css('opacity', 1);
            $(this).attr('data-selected', 1);

            // If you click on the marker, update the item interface
            $('#item-header').html("Item Detail: " + $(this).attr('marker-id'));
            $('#item-name').val($(this).attr('marker-name'));
            $('#short-desc').val($(this).attr('marker-short-desc'));
            $('#x-coord').val($(this).attr('marker-x-coord'));
            $('#y-coord').val($(this).attr('marker-y-coord'));
            $('#tags').val($(this).attr('marker-tags'));
            $('#goto-link').val($(this).attr('marker-goto-link'));

            // Change button to "update"
            $("#update-floor-plan-item-btn").html("Update");
        });
    }

    /**
     * Remove all the pins from the container
     * @author William Hua
     */
    function _hideAllPins() {
        var pins = $('#floor-plan-item-container').find('.floor-plan-marker');

        _resetPins();
        pins.remove();
    }

    /**
     * Hide all the pins from the UI when you click the hide all button
     *
     */
    function _setHideAllButtonListener() {
        $('#hide-all-floor-plan-item-btn').on('click', function(e) {
            _hideAllPins();
        });
    }

    /**
     * Redownload all the pins from the database when you click the show
     * all button
     *
     * @author William Hua
     */
    function _setShowAllButtonListener() {
        $('#show-all-floor-plan-item-btn').on('click', function(e) {

            // TODO: This is SUPER hacky, and a temp solution
            $.post('/cms/ajax/project_ajax/getProjectModuleContent', { pmId: pmId })
            .done(function(data){
                var moduleData = JSON.parse(data);

                var parseModuleContent = {
                    floorPlan: function() { floorPlan.populateFloorPlan(pmId, moduleData); },
                };

                _hideAllPins();

                parseModuleContent[moduleData.pmType]();
            });
        });
    }

    /**
     * Submit the pin to the database when you click
     *
     * @author William Hua
     */
    function _setUpdateButtonListener(floorPlan) {
        // Update the floor plan item when you click the update button
        $('#update-floor-plan-item-btn').on('click', function(e) {
            var name = $('#item-name').val();
            var shortDesc = $('#short-desc').val();
            var tags = $('#tags').val();
            var gotoLink = $('#goto-link').val();

            var height = $("#floor-plan-image").height();
            var width = $("#floor-plan-image").width();

            var heightRatio = height / floorPlan.height;
            var widthRatio = width / floorPlan.width;

            var xCoord = $("#x-coord").val();
            var yCoord = $("#y-coord").val();

            //TODO: check to make sure name exists

            var selectedItem = $('#floor-plan-item-container').find('.floor-plan-marker[data-selected=1]');
            var itemId = selectedItem.attr('marker-id');

            if($(this).html().toLowerCase() == "update") {
                $.post('/cms/ajax/project_ajax/updateFloorPlanItem', {
                    itemId: itemId,
                    name: name,
                    shortDescription: shortDesc,
                    x: xCoord,
                    y: yCoord,
                    tags: tags,
                    gotoLink: gotoLink
                }).done(function(data) {
                    toastr.success("Update successful");
                    selectedItem.attr('marker-name', name);
                    selectedItem.attr('marker-short-desc', shortDesc);
                    selectedItem.attr('marker-x-coord', xCoord);
                    selectedItem.attr('marker-y-coord', yCoord);
                    selectedItem.attr('marker-tags', tags);
                    selectedItem.attr('marker-goto-link', gotoLink);

                    // Update the item
                    selectedItem.css("left", _databaseXToCss(xCoord, floorPlan));
                    selectedItem.css("top", _databaseYToCss(yCoord, floorPlan));
                });
            } else {
                // TODO this isn't right and I'm not sure why (idk about 2, and if - horizontalOffset is the correct formula or just by conicidence
                //var xCoord = (parseInt(selectedItem.css('left').substring(0, selectedItem.css('left').length - 2)) - horizontalOffset) / widthRatio;
                //var yCoord = (height - parseInt(selectedItem.css('top').substring(0, selectedItem.css('top').length - 2)) + verticalOffset) / heightRatio;

                $.post('/cms/ajax/project_ajax/insertFloorPlanItem', {
                    pmfphId: floorPlan.id, //TEMP
                    name: name,
                    shortDescription: shortDesc,
                    x: xCoord,
                    y: yCoord,
                    tags: tags,
                    gotoLink: gotoLink
                })
                .done(function(data){
                    toastr.success("Creation successful");
                    var data = JSON.parse(data);
                    selectedItem.attr('data-new', '0');
                    selectedItem.attr('marker-id', data.itemId);
                    selectedItem.attr('marker-name', name);
                    selectedItem.attr('marker-short-desc', shortDesc);
                    selectedItem.attr('marker-x-coord', xCoord);
                    selectedItem.attr('marker-y-coord', yCoord);
                    selectedItem.attr('marker-tags', tags);
                    selectedItem.attr('marker-goto-link', gotoLink);

                    // Update the item
                    selectedItem.css("left", _databaseXToCss(xCoord, floorPlan));
                    selectedItem.css("top", _databaseYToCss(yCoord, floorPlan));
                });
            }
        });

    }

    /**
     * On click event listener when the remove button is clicked
     * and a pin is selected
     *
     * @author William Hua
     */
    function _setRemoveButtonListener() {
        $('#remove-floor-plan-item-btn').on('click', function(e) {
            var selectedItem = $('#floor-plan-item-container').find('.floor-plan-marker[data-selected=1]');
            var itemId = selectedItem.attr('marker-id');

            // Make sure a pin is selected
            if (selectedItem.length === 0) {
                toastr.warning("Please select a pin to remove.");
                return;
            }

            // Make sure the floor plan item exists
            if (selectedItem.attr('data-new') === "1") {
                toastr.warning("Cannot remove non-existant pin.");
                return;
            }

            $.post('/cms/ajax/project_ajax/deleteFloorPlanItem', {
                itemId: itemId,
            })
            .done(function(data){
                toastr.success("Removal successful");

                // remove the pin UI
                selectedItem.remove();
            });
        });
    }


    /**
     * General function that updates the interface of the page witt the floor plan
     *
     * @author William Hua
     */
    function _updateInterfaceForFloorPlan(floorPlan) {
        var projectContainerId = parseInt($("#content").attr("data-container-id"));
        var floorPlanMapInsert = floorPlanMapInsertTemplate.replace(/IMAGE_URL/g, function(){
            // TODO: this should not be hardcoded anywhere
            // TODO: maybe make a constants js file?
            return "http://d2q3mjua9r3eta.cloudfront.net/core/projectcontainers/" + projectContainerId + "/" + floorPlan.bgImage;
        });

        $('#floorPlanContainer').html(floorPlanMapInsert);

        $('#floor-plan-image').load(function(){
            // Populate the content of the first floor plan
            var floorPlanItemInsert = '';
            var height = $("#floor-plan-image").height();
            var width = $("#floor-plan-image").width();

            var heightRatio = height / floorPlan.height;
            var widthRatio = width / floorPlan.width;

            $.each(floorPlan.items, function(index, value) {
                //var insert = floorPlanItemInsertTemplate;
                var insert = $("#floor-plan-item-insert-template");
                console.log("widthRatio" + widthRatio);
                console.log("value x" + value.x);
                insert.find('.floor-plan-marker').css('left', _databaseXToCss(value.x, floorPlan)).css('top', _databaseYToCss(value.y, floorPlan)).css('opacity', 0.6);
                insert.find('.floor-plan-marker')
                .attr('marker-id', value.id)
                .attr('marker-name', value.name)
                .attr('marker-short-desc', value.shortDescription)
                .attr('marker-x-coord', value.x)
                .attr('marker-y-coord', value.y)
                .attr('marker-tags', value.tags)
                .attr('marker-goto-link', value.gotoLink);

                $('#floor-plan-item-container').append(insert.html());
            });

            _setFloorPlanListener(floorPlan);

            _setPinListener();
            _setHideAllButtonListener();
            _setShowAllButtonListener();
            _setRemoveButtonListener();
            _setUpdateButtonListener(floorPlan);
        });

    }



}(window.floorPlan = window.floorPlan || {}, $));
