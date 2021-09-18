/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = /** @class */ (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode == 32) || (keyCode == 13) || (keyCode == 8) || (keyCode == 9))) { // space & enter & backspace & tab
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 38) { // up arrow
                chr = "upArrow";
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 40) { // down arrow
                chr = "downArrow";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57)) { // digits & symbols...
                switch (keyCode) {
                    case (48):
                        if (isShifted === true) {
                            chr = String.fromCharCode(keyCode - 7); // ")"
                        }
                        else {
                            chr = String.fromCharCode(keyCode); // "0"
                        }
                        break;
                    case (49):
                        if (isShifted === true) {
                            chr = String.fromCharCode(keyCode - 16); // "!"
                        }
                        else {
                            chr = String.fromCharCode(keyCode); // "1"
                        }
                        break;
                    case (50):
                        if (isShifted === true) {
                            chr = String.fromCharCode(keyCode + 14); // "@"
                        }
                        else {
                            chr = String.fromCharCode(keyCode); // "2"
                        }
                        break;
                    case (51):
                        if (isShifted === true) {
                            chr = String.fromCharCode(keyCode - 16); // "#"
                        }
                        else {
                            chr = String.fromCharCode(keyCode); // "3"
                        }
                        break;
                    case (52):
                        if (isShifted === true) {
                            chr = String.fromCharCode(keyCode - 16); // "$"
                        }
                        else {
                            chr = String.fromCharCode(keyCode); // "4"
                        }
                        break;
                    // repeat for all symbols... busy work
                }
                // Add selected character to queue to be used
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
