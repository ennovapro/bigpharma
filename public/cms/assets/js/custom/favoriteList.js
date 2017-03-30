/**
 * This is all crappy code
 */
console.log("lol");
jQuery(document).ready(function() {
    // $('#icon-bg-color').colorpicker();

    $("#hide-advanced-btn").click(function() {
        var defaultDisplay = "block";
        var noneDisplay = "none";
        var htmlToHide = $(".advanced-hidden");

        if(htmlToHide.css("display") === "none") {
            htmlToHide.css("display", defaultDisplay);
        } else {
            htmlToHide.css("display", noneDisplay);
        }

    });

    $("#submit-btn").click(function() {
        var pmId = $("#pmId").val();
        var name = $("#name").val();
        var isSegmented = $("#isSegmented").val();
        var iconImage = $("#icon-image").val();
        var iconBgColor = $("#icon-bg-color").val();
        var bgColor = $("#bg-color").val();
        var image = $("#image").val();

        $.post("cms/modules/favoriteList/submitFavoriteListEdit", {
            pmId: pmId,
            name: name,
            isSegmented: isSegmented,
            iconImage: iconImage,
            iconBgColor: iconBgColor,
            bgColor: bgColor,
            image: image
        })

        .done(function(data) {
        });
    });

    /*
    var myDropzone  = new Dropzone("#icon-dropzone2", {
    }); */

    Dropzone.options.iconDropzone = {
        maxFiles: 1,
        dictDefaultMessage: "",
        maxfilesexceeded: function(file) {
            this.removeAllFiles();
            this.addFile(file);
        },
        /*
        init: function() {
            /**
             * If the user adds more than 1 file
             * replace the original file with the new file
            this.on("addedfile", function() {
                console.log("added a file");
                if (this.files[1]!=null){
                    this.removeFile(this.files[0]);
                }
            });
        } */
    }

    Dropzone.options.imageDropzone = {
        maxFiles: 1,
        dictDefaultMessage: "",
        maxfilesexceeded: function(file) {
            this.removeAllFiles();
            this.addFile(file);
        },
        /*
        init: function() {
            /**
             * If the user adds more than 1 file
             * replace the original file with the new file
            this.on("addedfile", function() {
                console.log("added a file");
                if (this.files[1]!=null){
                    this.removeFile(this.files[0]);
                }
            });
        } */
    }

});
