"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var Command = /** @class */ (function () {
    function Command(options) {
        options.dmPermission = false;
        Object.assign(this, options);
    }
    return Command;
}());
exports.Command = Command;
