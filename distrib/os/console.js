/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, oldCommandsArr, oldCommandsIndex) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (oldCommandsArr === void 0) { oldCommandsArr = [""]; }
            if (oldCommandsIndex === void 0) { oldCommandsIndex = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.oldCommandsArr = oldCommandsArr;
            this.oldCommandsIndex = oldCommandsIndex;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.backspace = function (buffer) {
            var x_distance = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, buffer.charAt(buffer.length - 1));
            var y_distance = this.currentYPosition - _DefaultFontSize;
            _DrawingContext.clearRect(x_distance, y_distance, this.currentXPosition, this.currentYPosition + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
            this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, buffer.charAt(buffer.length - 1));
            buffer = buffer.slice(0, -1);
            return buffer;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // add to command history
                    this.oldCommandsArr.push(this.buffer);
                    this.oldCommandsIndex = this.oldCommandsArr.length;
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { // handle backspace
                    if (this.buffer) {
                        this.buffer = this.backspace(this.buffer);
                    }
                }
                else if (chr === String.fromCharCode(38)) { // command history - up arrow
                    // Validate old command list for if isn't full and reset index if needed
                    if (this.oldCommandsArr.length > 0) {
                        if (this.oldCommandsIndex == 0) {
                            this.oldCommandsIndex = this.oldCommandsArr.length;
                        }
                        while (this.buffer.length > 0) {
                            this.buffer = this.backspace(this.buffer);
                        }
                        this.oldCommandsIndex--;
                        console.log(this.oldCommandsArr[this.oldCommandsIndex]);
                        this.putText(this.oldCommandsArr[this.oldCommandsIndex]);
                        this.buffer = this.oldCommandsArr[this.oldCommandsIndex];
                    }
                }
                else if (chr === String.fromCharCode(40)) { // command history - down arrow
                    // Validate old command list for if isn't full and reset index if needed
                    if (this.oldCommandsArr.length > 0) {
                        if (this.oldCommandsIndex == this.oldCommandsArr.length) {
                            this.oldCommandsIndex = 0;
                            this.oldCommandsArr[this.oldCommandsIndex] = "";
                        }
                        while (this.buffer.length > 0) {
                            this.buffer = this.backspace(this.buffer);
                        }
                        this.oldCommandsIndex++;
                        console.log(this.oldCommandsArr[this.oldCommandsIndex]);
                        this.putText(this.oldCommandsArr[this.oldCommandsIndex]);
                        this.buffer = this.oldCommandsArr[this.oldCommandsIndex];
                    }
                }
                else if (chr === String.fromCharCode(9)) { // handle tab
                    //var existingSimilarCommands = [_OsShell.commandList];
                    var similarCommands = [];
                    var y = 0;
                    if (this.buffer.length > 0) {
                        // Iterate through cmd list and save every matching cmd
                        for (var x = 0; x < _OsShell.commandList.length; x++) {
                            if (_OsShell.commandList[x].command[0] == this.buffer[0]) {
                                similarCommands[y] = _OsShell.commandList[x].command;
                                y++;
                            }
                        }
                        if (similarCommands.length == 0) {
                            break;
                        }
                        else if (similarCommands.length == 1) {
                            while (this.buffer.length > 0) {
                                this.buffer = this.backspace(this.buffer);
                            }
                            this.buffer = similarCommands[0];
                            this.putText(this.buffer);
                            break;
                        }
                        else if (similarCommands.length > 1) {
                            // Iterate through buffer
                            for (var j = 0; j < similarCommands.length; j++) {
                                var matchCount = 0;
                                for (var k = 0; k < this.buffer.length; k++) {
                                    console.log("cmd list: " + similarCommands[j][k]);
                                    console.log("buffer: " + this.buffer[k]);
                                    if (similarCommands[j][k] == this.buffer[k]) {
                                        matchCount++;
                                    }
                                } // inner loop ends
                                if (matchCount == this.buffer.length) {
                                    while (this.buffer.length > 0) {
                                        this.buffer = this.backspace(this.buffer);
                                    }
                                    this.buffer = similarCommands[j];
                                    this.putText(this.buffer);
                                }
                            }
                        }
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        };
        Console.prototype.putText = function (text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            // Save current Y position and check if need scrolled
            var positionY_line = this.currentYPosition;
            if (this.currentYPosition > _Canvas.height) {
                // Snapshot canvas and clear
                var console_snapshot = _DrawingContext.getImageData(0, 0, _Canvas.width, positionY_line + 1);
                this.clearScreen();
                // Post snapshot 1 index above Y position
                var positionY_difference = this.currentYPosition - _Canvas.height + 1;
                _DrawingContext.putImageData(console_snapshot, 0, -positionY_difference);
                this.currentYPosition -= positionY_difference;
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
