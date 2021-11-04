/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.hostStatus = "";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhere, "whereami", "- Displays the users current location");
            this.commandList[this.commandList.length] = sc;
            // pie
            sc = new TSOS.ShellCommand(this.shellPie, "pie", "<number> - Hungry for math?");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status in host display.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<number> - Verifies values entered in the User Program Input");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Run a program from Memory");
            this.commandList[this.commandList.length] = sc;
            // BSOD
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Tread lightly... you're playing with fire");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- executes all programs from Memory");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- displays the PID and state of all stored processes");
            this.commandList[this.commandList.length] = sc;
            // kill <pid>
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - kills a specified process");
            this.commandList[this.commandList.length] = sc;
            // killall
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "- kills all processes");
            this.commandList[this.commandList.length] = sc;
            // quantum <int>
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - sets the Round Robin quantum");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            if (buffer.slice(0, 6) != "status") { // Allows status command to remain uppercase
                buffer = buffer.toLowerCase();
            }
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("The VERsion command displays the current version of the currently running browser-based OS");
                        break;
                    case "shutdown":
                        _StdOut.putText('"Safe" Shutdown stops the browser-based OS but leaves the system processing the browser to be untouched');
                        break;
                    case "cls":
                        _StdOut.putText("The cls command clears the browser-based OS terminal, leaving a clean slate for new commands");
                        break;
                    case "man":
                        _StdOut.putText('The MANual command requires a "topic" string, like help, to receive further description of a command');
                        break;
                    case "trace":
                        _StdOut.putText("The host log of the running OS is constantly idling while Trace is on. Turn Trace off to save CPU consumption");
                        break;
                    case "rot13":
                        _StdOut.putText("rot13 is a Caesar cipher that replaces each letter of an entered string with a letter 13 letters down the alphabet. Enter a random string and then enter the command again with the output of the first command and sse what happens ;) (26 letters in the alphabet)");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt uses an entered string and displays that value before every command thereafter");
                        break;
                    case "date":
                        _StdOut.putText("What time is it? Time to get a watch... or just use this command");
                        break;
                    case "whereami":
                        _StdOut.putText("Someone's lost. Try out this command and then you'll know! Maybe...");
                        break;
                    case "pie":
                        _StdOut.putText("Enter 9 digits and a decimal that looks like this: '3.14159265'...");
                        _StdOut.advanceLine();
                        _StdOut.putText("Help too specific? Eh, just have some pie, you'll feel better");
                        break;
                    case "status":
                        _StdOut.putText("See that 'Status' up top? The one next to the 'Date' and 'Time'? Yeah you can change that");
                        break;
                    case "load":
                        _StdOut.putText("This one validates what you enter into the 'User Program Input' to your right. Only hex values (A-F, 0-9) will be allowed.");
                        break;
                    case "run":
                        _StdOut.putText("This will run the user program specified by the entered PID. Ensure a program was entered in valid hex and processed into Memory by the load command.");
                        break;
                    case "bsod":
                        _StdOut.putText("This tests the Blue Screen Of Death. Pretty cool to see, but kinda need to reset your system afterwards.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid argument.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate(args) {
            let dateTime = new Date();
            _StdOut.putText("Current date and time: " + dateTime);
        }
        shellWhere(args) {
            _StdOut.putText("Madison Square Garden");
        }
        shellPie(args) {
            if (args.length > 0) {
                var attemptPi = args[0];
                if (attemptPi == "3.14159265") {
                    _StdOut.putText("CONGRATS!! You knew the beginning of Pi. You're reward...");
                    _StdOut.advanceLine();
                    _StdOut.putText("MORE PI!!... 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679...");
                }
                else {
                    _StdOut.putText("Boooo you got Pi WRONG. No Pie for you :(");
                }
            }
            else {
                _StdOut.putText("Please supply pi after pie");
            }
        }
        shellStatus(args) {
            if (args.length > 0) {
                _OsShell.hostStatus = "";
                var i = 0;
                while (args[i] != null) {
                    _OsShell.hostStatus = _OsShell.hostStatus + args[i] + " ";
                    i++;
                }
                document.getElementById("status").innerHTML = _OsShell.hostStatus;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        shellLoad() {
            // Retrieve user input and remove whitespace
            var user_input = document.getElementById("taProgramInput")["value"];
            var condensed_input = user_input.replace(/ +/g, "").toUpperCase();
            // Validate that string only contains hex characters
            var isHexTrue = true;
            for (var i = 0; i < condensed_input.length; i++) {
                if (condensed_input[i] == "A" || condensed_input[i] == "B" || condensed_input[i] == "C" || condensed_input[i] == "D"
                    || condensed_input[i] == "E" || condensed_input[i] == "F" || condensed_input[i] == "0" || condensed_input[i] == "1"
                    || condensed_input[i] == "2" || condensed_input[i] == "3" || condensed_input[i] == "4" || condensed_input[i] == "5"
                    || condensed_input[i] == "6" || condensed_input[i] == "7" || condensed_input[i] == "8" || condensed_input[i] == "9"
                    && (condensed_input.length % 2 == 0) && (condensed_input.length != 0)) {
                    isHexTrue = true;
                }
                else {
                    isHexTrue = false;
                    break;
                }
            }
            if (isHexTrue) {
                _StdOut.putText("[SUCCESS] - Appropriate hex values were entered");
                _StdOut.advanceLine();
                // reset CPU
                _CPU.init();
                /* Create and Populate New Process Control Block */
                if (_current_PCB_PID < 3) {
                    // create new PCB
                    var PCB = new TSOS.PCB();
                    // assign & increment Process ID
                    PCB.PID = _current_PCB_PID;
                    _current_PCB_PID++;
                    // assign PCB state & memory
                    PCB.State = "Resident";
                    PCB.Location = "Memory";
                    // add New PCB to Process List
                    _PCBList.push(PCB);
                    /* Load user program into Memory and update GUI */
                    // load memory
                    _MemoryManager.loadMemory(condensed_input, PCB.PID);
                    // update GUI
                    TSOS.Control.updateGUI_Memory_();
                    TSOS.Control.updateGUI_PCB_();
                    TSOS.Control.updateGUI_CPU_();
                    // Output
                    console.log("PCB (" + String(PCB.PID) + ") was added. There are currently " + String(_PCBList.length) + " stored processes.");
                    _StdOut.putText("Process ID Number: " + String(PCB.PID));
                }
                else {
                    _StdOut.putText("[MEMORY ALLOCATION EXCEEDED] - Memory already contains 3 loaded processes.");
                }
            }
            else {
                _StdOut.putText("Please supply only hexadecimal values into the User Program Input");
            }
        }
        shellRun(args) {
            // validate for appropriate user input
            if (args.length = 1) {
                var valid_pid = false;
                var pid_input = Number(args[0]);
                // loop through list of processes to find matching PID
                for (let i = 0; i < _PCBList.length; i++) {
                    if (_PCBList[i].PID == pid_input) {
                        valid_pid = true;
                        _current_PCB_PID = _PCBList[i].PID;
                        break;
                    }
                }
                // validate the found process's state
                if (valid_pid && _PCBList[_current_PCB_PID].State == "Resident") {
                    // determine processes section
                    if (pid_input == 0) {
                        _current_PCB_Section = 0;
                    }
                    else if (pid_input == 1) {
                        _current_PCB_Section = 256;
                    }
                    else if (pid_input == 2) {
                        _current_PCB_Section = 512;
                    }
                    // update isExecuting
                    _CPU.isExecuting = true;
                    // update process state
                    _PCBList[_current_PCB_PID].State = "Running";
                    // disables next stepping
                    _Next_Step = false;
                }
                else {
                    if (!valid_pid) {
                        _StdOut.putText("Process [" + pid_input + "] was NOT found. Please enter a valid <PID>.");
                    }
                    else if (_PCBList[_current_PCB_PID].State != "Resident") {
                        _StdOut.putText("Process [" + pid_input + "] is not available to be ran. Make sure the specified process is Resident before running.");
                    }
                }
            }
            else {
                _StdOut.putText("Please supply a ProcessID integer to run a specified program from Memory");
            }
        }
        shellBSOD() {
            let msg = "Uh oh... well, even though it was a test, you done f%$ked up";
            _Kernel.krnTrapError(msg);
            (document.getElementById("status")).innerHTML = "[BSOD ERROR]";
        }
        shellClearMem() {
            // clear all memory partitions
            _Memory.init();
            TSOS.Control.updateGUI_Memory_();
            TSOS.Control.clearGUI_PCB_();
            _current_PCB_PID = 0;
            _PCBList.splice(0, _PCBList.length);
            _StdOut.putText("All Memory partitions were successfully cleared");
        }
        shellRunAll() {
            // execute all programs at once
            for (var i = 0; i < _PCBList.length; i++) {
                if (_PCBList[i].State = "Resident") {
                    if (_CPU.isExecuting == false) {
                        // update Resident processes to Running
                        _PCBList[i].State = "Running";
                        // update isExecuting
                        _CPU.isExecuting = true;
                        // disables next stepping
                        _Next_Step = false;
                    }
                }
            }
        }
        shellPS() {
            // display the PID and state of all processes
            for (var i = 0; i < _PCBList.length; i++) {
                _StdOut.putText("Process ID: " + _PCBList[i].PID + " - State: " + _PCBList[i].State);
                _StdOut.advanceLine();
            }
        }
        shellKill(args) {
            // kill one process
            if (args.length = 1) {
                var pid_input = Number(args[0]);
                var found = false;
                for (var i = 0; i < _PCBList.length; i++) {
                    if (_PCBList[i] == _PCBList[pid_input]) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    _PCBList[pid_input].State = "Terminated";
                    _CPU.isExecuting = false;
                    TSOS.Control.updateGUI_PCB_();
                    _StdOut.putText("Successfully Terminated Process [" + pid_input + "]");
                }
                else {
                    _StdOut.putText("Process [" + pid_input + "] was NOT found. Please enter a valid <PID>.");
                }
            }
            else {
                _StdOut.putText("Please supply a ProcessID integer to kill a specified process");
            }
        }
        shellKillAll() {
            // kill all process
            if (_PCBList.length > 0) {
                for (var i = 0; i < _PCBList.length; i++) {
                    _PCBList[i].State = "Terminated";
                }
                _CPU.isExecuting = false;
                TSOS.Control.updateGUI_PCB_();
                _StdOut.putText("Successfully Terminated All Loaded Processes");
            }
            else {
                _StdOut.putText("[ERROR] - There are no loaded processes. Please enter a User Program and load it into memory before terminating.");
            }
        }
        shellQuantum(args) {
            // let the user set the Round Robin quantum 
            if (args.length = 1) {
                _Quantum = parseInt(args[0]);
            }
            else {
                _StdOut.putText("Supplied <Quantum> was not valid. Please supply an integer that will act as the Quantum and measured in CPU cycles.");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map