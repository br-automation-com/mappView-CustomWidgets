define([
    'widgets/brease/Button/Button',
    'widgets/brease/FileExplorerSystem/FileExplorerSystem',
    'widgets/brease/FileManager/FileManager',
    'brease/enum/Enum',
    'brease/core/Utils'
], function (
    SuperClass, FileExplorerSystem, FileManager, Enum, Utils
) {

    'use strict';

    /**
     * @class widgets.brXtended.Screenshot
     * #Description
     * This widget provides a button that can generate a screenshot of the visualization
     * and save it on the PLC or on the client device.
     *  
     * @breaseNote
     * @extends widgets.brease.Button
     * 
     * @iatMeta category:Category
     * Media
     * @iatMeta description:short
     * Screenshot widget
     * @iatMeta description:de
     * Dieses Widget erzeugt ein Bildschirm Foto
     * @iatMeta description:en
     * This widget creates a screenshot
     */

    // Widget error numbers
    const err_unkown = 10000;
    const err_http_access = 10001;

    var defaultSettings = {
        },

        WidgetClass = SuperClass.extend(function Screenshot() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('brXtendedScreenshot');
        }

        // Create the the download element and append it invisibly.
        if (!brease.config.editMode) {
            this.a = document.createElement('a');
            this.a.style.display = 'none';
            document.body.append(this.a);

            if (!brease.config.preLoadingState) {
                // FileExplorer handling
                this.fileExplorer = new FileExplorerSystem();
                // Init com to FileHandlerComm 
                this.fileManager = FileManager.createWidget(this.elem.id);
            }
        }

        SuperClass.prototype.init.call(this);
    };

    /**
     * @method Screenshot2Client
     * @iatStudioExposed
     * Creates a screenshot and save it on the client device.
     */
       p.Screenshot2Client = function Screenshot2Client() {
        var widget = this;

        var displayMediaOptions = {
            video: {
                cursor: "always"
            },
            audio: false
        };

        // Make sure we have access to the media device
        if (navigator.mediaDevices === undefined){
            widget._errorHandling(err_http_access); 
        }
        else
        {
            navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(
                function(stream){
                    const canvas = document.createElement("canvas");
                    const video = document.createElement("video");
                    
                    video.srcObject = stream;                                
                    video.play().then(
                        function(result){
                            // Get image from video
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext("2d").drawImage(video, 0, 0);

                            // Create screenshot download
                            canvas.toBlob(
                                function(blob) {
                                // Create the blob URL and attach it to object
                                const blobURL = URL.createObjectURL(blob);
                                widget.a.href = blobURL;
                                widget.a.download = 'screenshot.png';

                                // Stop video recording
                                var tracks = video.srcObject.getTracks();
                                tracks.forEach(function(track) { track.stop()});

                                // Programmatically click the element.
                                widget.a.click();

                                /**
                                * @event FileDownloaded
                                * Fired when a file was downloaded.
                                * @iatStudioExposed
                                */
                                var ev = widget.createEvent('FileDownloaded', { });
                                if (ev !== undefined) {
                                    ev.dispatch();
                                }
                                });
                        }).catch(function (telegram) {
                            if(telegram.error === undefined || telegram.error.code === undefined){
                                widget._errorHandling(err_unkown);
                            }
                            else{
                                widget._errorHandling(telegram.error.code);
                            }                 
        
                       });
                }).catch(function (telegram) {
                    if(telegram.error === undefined || telegram.error.code === undefined){
                        widget._errorHandling(err_unkown);
                    }
                    else{
                        widget._errorHandling(telegram.error.code);
                    }                 
                });
        }
    };

    /**
     * @method Screenshot2Plc
     * @iatStudioExposed
     * Creates a screenshot and save it on the client device.
     * @param {FilePath} filePath
     */
    p.Screenshot2Plc = function Screenshot2Plc(filePath) {
        var widget = this;

        var displayMediaOptions = {
            video: {
                cursor: "always"
            },
            audio: false
        };

        //console.log("FilePath:" + filePath);

        // Make sure we have access to the media device
        if (navigator.mediaDevices === undefined){
            widget._errorHandling(err_http_access); 
        }
        else
        {
            navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(
                function(stream){
                    const canvas = document.createElement("canvas");
                    const video = document.createElement("video");
                    
                    video.srcObject = stream;                                
                    video.play().then(
                        function(result){
                            // Get image from video
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext("2d").drawImage(video, 0, 0);

                            // Stop video recording
                            var tracks = video.srcObject.getTracks();
                            tracks.forEach(function(track) { track.stop()});
                            
                            // Convert image to PNG format
                            const image_base64 = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, "");
                            widget._saveFile(filePath, 'OVERWRITE', "BINARY", image_base64);       
                        }).catch(function (telegram) {
                            if(telegram.error === undefined || telegram.error.code === undefined){
                                widget._errorHandling(err_unkown);
                            }
                            else{
                                widget._errorHandling(telegram.error.code);
                            }                        
                        });
                }).catch(function (telegram) {
                    if(telegram.error === undefined || telegram.error.code === undefined){
                        widget._errorHandling(err_unkown);
                    }
                    else{
                        widget._errorHandling(telegram.error.code);
                    }                               
                });
        }
    };

    // Save image to PLC
    p._saveFile = function _saveFile(path, flags, encoding, data) {
        if (brease.config.preLoadingState) return;

        var widget = this;
        //console.log("Path:" + path);
        widget.fileManager.save(widget.elem.id, path, flags, encoding, data).then(function () {
            /**
                * @event FileSaved
                * Fired when a file is saved.
                * @param {FilePath} filePath Path to the file that has been saved.
                * @iatStudioExposed
                */
            var ev = widget.createEvent('FileSaved', { filePath: path });
            if (ev !== undefined) {
                ev.dispatch();
            }
        }).catch(function (telegram) {
            widget._errorHandling(telegram.error.code);
        });
    };

    p._errorHandling = function _errorHandling(code) {
        console.log("Screenshot Error:" + code);

        var widget = this;
        /**
        * @event OnError
        * Fired when there is an error on the operation.
        * @iatStudioExposed
        * @param {Integer} result Number of error transmitted by the mapp component.
        */
        var ev = widget.createEvent('OnError', { result: code });
        if (ev !== undefined) {
            ev.dispatch();
        }

        // Send error to PLC logger
        if (!brease.config.editMode) {
            var m = 'Error ' + code + ' in brXtended on page ' + widget.settings.parentContentId +  ' at widget ' + this.elem.id;
            brease.loggerService.log(Enum.EventLoggerId.CLIENT_SCRIPT_FAIL, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.OFF, Enum.EventLoggerSeverity.ERROR, [], m);
        }
    };
    
    p.dispose = function () {
        var that = this;
        SuperClass.prototype.dispose.apply(that, arguments);
    };

    return WidgetClass;
});
