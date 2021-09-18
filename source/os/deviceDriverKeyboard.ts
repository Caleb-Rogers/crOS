/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode == 32) || (keyCode == 13))) { // space & enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57))  { // digits & symbols...
                switch(keyCode) {
                    case(48):
                        if (isShifted === true) { 
                            chr = String.fromCharCode(keyCode - 7); // ")"
                        } else {
                            chr = String.fromCharCode(keyCode); // "0"
                        }
                        break;
                    case(49):
                        if (isShifted === true) { 
                            chr = String.fromCharCode(keyCode - 16); // "!"
                        } else {
                            chr = String.fromCharCode(keyCode); // "1"
                        }
                        break;
                    case(50):
                        if (isShifted === true) { 
                            chr = String.fromCharCode(keyCode + 14); // "@"
                        } else {
                            chr = String.fromCharCode(keyCode); // "2"
                        }
                        break;
                    case(51):
                        if (isShifted === true) { 
                            chr = String.fromCharCode(keyCode - 16); // "#"
                        } else {
                            chr = String.fromCharCode(keyCode); // "3"
                        }
                        break;
                    case(52):
                        if (isShifted === true) { 
                            chr = String.fromCharCode(keyCode - 16); // "$"
                        } else {
                            chr = String.fromCharCode(keyCode); // "4"
                        }
                        break;

                    // repeat for all symbols... busy work
                }
                // Add selected character to queue to be used
                _KernelInputQueue.enqueue(chr);
            }

            }    
    }
}
