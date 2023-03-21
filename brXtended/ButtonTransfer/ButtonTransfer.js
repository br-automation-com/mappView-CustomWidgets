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
     * @class widgets.brXtended.ButtonTransfer
     * #Description
     * This widget provides a button that can upload or download a file to 
     * the PLC with the visualization.
     *  
     * @breaseNote
     * @extends widgets.brease.Button
     * 
     * @iatMeta category:Category
     * Media
     * @iatMeta description:short
     * Screenshot widget
     * @iatMeta description:de
     * Dieses Widget dient zur Dateiübetragung
     * @iatMeta description:en
     * This widget transfers a file
     */

     /**
     * @cfg {Integer} maxFileSize=10000000
     * @iatStudioExposed
     * @bindable
     * @iatCategory Extended
     * Maximum size of the transfered file
     */

    // Local constants and limits
    const _minFileSize = 1000;
    const _maxFileSize = 10000000;
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // Widget error numbers
    const err_unkown = 10100;
    const err_file_size = 10101;

    var defaultSettings = {
        maxFileSize : 1000000
        },

        WidgetClass = SuperClass.extend(function ButtonTransfer() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('brXtendedButtonTransfer');
        }

        if (this.settings.maxFileSize < _minFileSize) {
            this.settings.maxFileSize = _minFileSize;
        }

        // Create the the transfer element and append it invisibly.
        if (!brease.config.editMode) {
            // Create download object
            this.a = document.createElement('a');
            this.a.style.display = 'none';
            document.body.append(this.a);

            // Create upload dialog
            this.form = document.createElement('input');
            this.form.setAttribute('type', 'file');
            this.form.setAttribute('id', 'myFile');
            this.form.setAttribute('class', 'form-control');
            this.form.addEventListener('change', this._bind('_upload'));

            document.body.append(this.form);

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
     * @method setMaxFileSize
     * @iatStudioExposed
     * Sets maxFileSize
     * @param {Integer} maxFileSize The maximum length of the value
     */
    p.setMaxFileSize = function (newFileSize) {
        if (newFileSize <= _maxFileSize && newFileSize >= _minFileSize){
            this.settings.maxFileSize = newFileSize;                
        }
        else{
            widget._errorHandling(err_file_size);
        }
    };
    
    /**
    * @method getMaxFileSize 
    * @iatStudioExposed
    * Returns maxFileSize.
    * @return {Integer} The maximum length of the value
    */
    p.getMaxFileSize = function () {   
        return this.settings.maxFileSize;
    };

     /**
     * @method Download
     * @iatStudioExposed
     * Download a file from the PLC and save it on the client device.
     * @param {FilePath} filePath
     */
    p.Download = function Download(filePath) {
        this._openFile(filePath, 'LOCK', "BINARY", this.settings.maxFileSize, 0);
    };

     /**
     * @method Upload
     * @iatStudioExposed
     * Upload a file from the PLC and save it on the client device.
     * @param {FilePath} filePath
     */
    p.Upload = function Upload(filePath) {
        var widget = this;
        widget.filePath = filePath;
        
        // Click the file select form
        widget.form.click();         
    };

    /**
    * @method childrenInitializedHandler
    * method used by the DataHandler middlware during initialization
    */
    p._upload = function (event) {
        const widget = this;

        // getting a hold of the file reference
        const file = event.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
    
        reader.readAsDataURL(file); // this is reading as data url

        // here we tell the reader what to do when it's done reading...
        reader.onload = function(readerEvent){
            var content = readerEvent.target.result; // this is the content!
            var regex = /data:[^;]+;base64,(.*)/;
            var base64 = content.match(regex)[1];

            //console.log("Data:" + base64);
            if (file.size <  widget.settings.maxFileSize){
                widget._saveFile(widget.filePath +  file.name, 'OVERWRITE', "BINARY", base64);
            }
            else{
                widget._errorHandling(err_file_size);
            }
        }
    };

    p._saveFile = function _saveFile(path, flags, encoding, data) {
        if (brease.config.preLoadingState) return;

        var widget = this;
        //console.log("Path:" + path);
        widget.fileManager.save(widget.elem.id, path, flags, encoding, data).then(function () {
            /**
                * @event FileSaved
                * Fired when a file was saved.
                * @param {FilePath} filePath Path to the file that has been saved.
                * @iatStudioExposed
                */
            var ev = widget.createEvent('FileSaved', { filePath: path });
            if (ev !== undefined) {
                ev.dispatch();
            }
        }).catch(function (telegram) {
            if(telegram.error === undefined || telegram.error.code === undefined){
                widget._errorHandling(err_unkown);
            }
            else{
                widget._errorHandling(telegram.error.code);
            }  
        });
    };

    p._openFile = function _openFile(path, flags, encoding, maxFileSize, offset) {
        if (brease.config.preLoadingState) return;
        var widget = this;

        // Make sure file size is within range
        if (maxFileSize > _minFileSize && maxFileSize < _maxFileSize){

            return widget.fileManager.load(widget.elem.id, path, flags, encoding, maxFileSize, offset).then(function (fileData) {
                //console.log("fileData.length:" + fileData.length);

                // Make sure file does not exceed maximum size
                if (fileData.length <= widget.settings.maxFileSize){
                    // Decode data and create download stream
                    var data = atob(fileData);
                    var decode = _decodebase64(data)

                    var blob = new Blob([decode], {type: 'octet/stream'});
                    const objectURL = window.URL.createObjectURL(blob);

                    widget.a.href = objectURL;
                    widget.a.download = path.filename(true);

                    // Programmatically click the element to trigger download
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
                }
                else{
                    widget._errorHandling(err_file_size);
                }
            }).catch(function (telegram) {
                //console.log("telegram:" + telegram);
                if(telegram.error === undefined || telegram.error.code === undefined){
                    widget._errorHandling(err_unkown);
                }
                else{
                    widget._errorHandling(telegram.error.code);
                }  
            });
        }
        else{
            widget._errorHandling(err_file_size);
        }  
    };

    // private method for decoding the base64 data
    function _decodebase64(input) {
        var output = new Uint8Array(input.length);
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var n = 0;
    
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
        while (i < input.length) {
    
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
    
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
    
            output[n++] = chr1;
    
            if (enc3 != 64) {
              output[n++] = chr2;
            }
            if (enc4 != 64) {
              output[n++] = chr3;
            }   
        }
    
        var buffer = new Uint8Array(n);
        for (var i = 0; i < n; i++)
          buffer[i] = output[i];
        return buffer;
    }   

    p._errorHandling = function _errorHandling(code) {
        console.log("Widget Error:" + code);

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

    String.prototype.filename=function(extension){
        var s= this.replace(/\\/g, '/');
        s= s.substring(s.lastIndexOf('/')+ 1);
        return extension? s.replace(/[?#].+$/, ''): s.split('.')[0];
    }

    p.dispose = function () {
        var that = this;
        SuperClass.prototype.dispose.apply(that, arguments);
    };

    return WidgetClass;
});
