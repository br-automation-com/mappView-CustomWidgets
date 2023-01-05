define([
    'widgets/brease/Button/Button',
    'widgets/brease/FileExplorerSystem/FileExplorerSystem',
    'widgets/brease/FileManager/FileManager'
], function (
    SuperClass, FileExplorerSystem, FileManager
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

    var defaultSettings = {
            FileDevice: '',
            FileName: ''
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

        navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true }).then(
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
                            });
                    }).catch(function (telegram) {
                        widget._errorHandling(telegram);                            
                    });
            }).catch(function (telegram) {
                widget._errorHandling(telegram);                     
            });
    };

    /**
     * @method Screenshot2Plc
     * @iatStudioExposed
     * Creates a screenshot and save it on the client device.
     * @param {String} DeviceName The name of the file device
     * @param {String} FileName The name of the screenshot file
     */
       p.Screenshot2Plc = function Screenshot2Plc(DeviceName, FileName) {
        var widget = this;

        //console.log("DeviceName:" + DeviceName);
        //console.log("FileName:" + FileName);
        navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true }).then(
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
                        widget._saveFile(DeviceName + FileName, 'OVERWRITE', "BINARY", image_base64);       
                    }).catch(function (telegram) {
                        widget._errorHandling(telegram);
                    });
            }).catch(function (telegram) {
                widget._errorHandling(telegram);                    
            });
    };

    // /**
    // * @method saveAs
    // * @iatStudioExposed
    // * Open the FileExplorer popup to allow you save the file as a 
    // * new file into a specific path.
    // */
    // p.saveAs = function () {
    //     this._saveASHelper();
    // };

    // p._saveASHelper = function _saveASHelper() {
    //     if (brease.config.preLoadingState) return;

    //     var widget = this;
    //     widget.fileExplorer.saveas(widget.getFileManagerProfile(), '', 'NewFile', widget.elem).then(function (fileDetail) {
    //         widget._saveFile(fileDetail.path, 'OVERWRITE', widget.getEncoding(), widget.editor.getValue());
    //     }).catch(function () {
    //         //console.log(err);
    //     });
    // };

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
            widget._errorHandling(telegram);
        });
    };

    p._errorHandling = function _errorHandling(telegram) {
        console.log("Screenshot Error:" + telegram);

        var widget = this;
        /**
        * @event OnError
        * Fired when there is an error on the operation.
        * @iatStudioExposed
        * @param {Integer} result Number of error transmitted by the mapp component.
        */
        if (telegram.error !== undefined && telegram.error.code !== undefined){
            var ev = widget.createEvent('OnError', { result: telegram.error.code });
        }
        else{
            var ev = widget.createEvent('OnError', { result: -1 });
        }
        if (ev !== undefined) {
            ev.dispatch();
        }
    };
    
    p.dispose = function () {
        var that = this;
        SuperClass.prototype.dispose.apply(that, arguments);
    };

    return WidgetClass;
});
