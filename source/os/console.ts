/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public oldCommandsArr = [""],
                    public oldCommandsIndex = 0,
                    public similarCommands = []) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
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
                        // Determine distance to delete
                        var x_distance = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                        var y_distance = this.currentYPosition - _DefaultFontSize;
                        // Delete character, update x-axis and update buffer
                        _DrawingContext.clearRect(x_distance, y_distance, this.currentXPosition, this.currentYPosition + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
                        this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                        this.buffer = this.buffer.slice(0, -1);
                    }
                }
                else if (chr === String.fromCharCode(38)) { // command history - up arrow
                    // Validate old command list for if isn't full and reset index if needed
                    if (this.oldCommandsArr.length > 0) {
                        if(this.oldCommandsIndex == 0) {
                            this.oldCommandsIndex = this.oldCommandsArr.length;
                        }
                        // Clear line 
                        while (this.buffer.length > 0) {
                            var x_distance = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                            var y_distance = this.currentYPosition - _DefaultFontSize;
                            _DrawingContext.clearRect(x_distance, y_distance, this.currentXPosition, this.currentYPosition + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
                            this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                            this.buffer = this.buffer.slice(0, -1);
                        }
                        this.oldCommandsIndex--;
                        this.putText(this.oldCommandsArr[this.oldCommandsIndex]);
                        this.buffer = this.oldCommandsArr[this.oldCommandsIndex];
                    }

                }
                else if (chr === String.fromCharCode(40)) { // command history - down arrow
                    // Validate old command list for if isn't full and reset index if needed
                    if (this.oldCommandsArr.length > 0) {
                        if(this.oldCommandsIndex == this.oldCommandsArr.length) {
                            this.oldCommandsIndex = 0;
                        }
                        // Clear line                                         
                        while (this.buffer.length > 0) {
                            var x_distance = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                            var y_distance = this.currentYPosition - _DefaultFontSize;
                            _DrawingContext.clearRect(x_distance, y_distance, this.currentXPosition, this.currentYPosition + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
                            this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                            this.buffer = this.buffer.slice(0, -1);
                        }
                        this.oldCommandsIndex++;
                        this.putText(this.oldCommandsArr[this.oldCommandsIndex]);
                        this.buffer = this.oldCommandsArr[this.oldCommandsIndex];
                    }
                }
                else if (chr === String.fromCharCode(9)) { // handle tab
                    // validate for something typed
                    if (this.buffer.length > 0) {
                        // nested loop to find all possible commands to current buffer
                        for (var j=0; j<_OsShell.commandList.length; j++) {
                            for (var i=0; i<this.buffer.length; i++) {
                                if (_OsShell.commandList[i].command[j] == this.buffer[j]) {
                                    this.similarCommands[i] = _OsShell.commandList[i].command;
                                }
                                // if no similar commands
                                if (this.similarCommands.length == 0) {
                                    break;
                                }
                                // if matching command, clear line and print
                                else if (this.similarCommands.length == 1) {
                                    // Clear line                                         
                                    while (this.buffer.length > 0) {
                                        var x_distance = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                                        var y_distance = this.currentYPosition - _DefaultFontSize;
                                        _DrawingContext.clearRect(x_distance, y_distance, this.currentXPosition, this.currentYPosition + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
                                        this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                                        this.buffer = this.buffer.slice(0, -1);
                                    }
                                    this.buffer = this.similarCommands[0].command;
                                    console.log("Buffer: " + this.buffer);
                                    this.putText(this.buffer);
                                    break;
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
        }

        public putText(text): void {
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
         }

        public advanceLine(): void {
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
        }
    }
 }
