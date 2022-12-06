define(function () {

    'use strict';

    var SubmitQueue = function (widget) {
            this.widget = widget;
            this.queue = [];
        },
        p = SubmitQueue.prototype;

    p.add = function (config) {
        var self = this;
        this.queue.push(config);
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(function () {
            self.queue[0].deferred = false;
            self.widget.submitChange(self.queue[0]);
            self.clear();
        }, 100);
    };

    p.clear = function () {
        window.clearTimeout(this.timeout);
        this.queue = [];
    };

    p.getPrevious = function () {
        return (this.queue.length > 0) ? this.queue[0].previous : undefined;
    };

    p.length = function () {
        return this.queue.length;
    };

    return SubmitQueue;
});
