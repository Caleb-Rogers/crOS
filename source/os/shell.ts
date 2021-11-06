/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.
module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public hostStatus = "";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                "date",
                "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhere,
                "whereami",
                "- Displays the users current location");
            this.commandList[this.commandList.length] = sc;

            // pie
            sc = new ShellCommand(this.shellPie,
                "pie",
                "<number> - Hungry for math?");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Sets the status in host display.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "<number> - Verifies values entered in the User Program Input");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Run a program from Memory");
            this.commandList[this.commandList.length] = sc;

            // BSOD
            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "- Tread lightly... you're playing with fire");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;

            // runall
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- executes all programs from Memory");
            this.commandList[this.commandList.length] = sc;

            // ps
            sc = new ShellCommand(this.shellPS,
                "ps",
                "- displays the PID and state of all stored processes");
            this.commandList[this.commandList.length] = sc;

            // kill <pid>
            sc = new ShellCommand(this.shellKill,
                "kill",
                "<pid> - kills a specified process");
            this.commandList[this.commandList.length] = sc;

            // killall
            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "- kills all processes");
            this.commandList[this.commandList.length] = sc;

            // quantum <int>
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "<int> - sets the Round Robin quantum");
            this.commandList[this.commandList.length] = sc;


            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            if (buffer.slice(0, 6) != "status") { // Allows status command to remain uppercase
                buffer = buffer.toLowerCase();
            }

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args: string[]) {
            let dateTime = new Date()
            _StdOut.putText("Current date and time: " + dateTime);
        }

        public shellWhere(args: string[]) {
            _StdOut.putText("Wayne's World, Wayne's World");
        }

        public shellPie(args: string[]) {
            if (args.length > 0) {
                var attemptPi:String = args[0];
                if (attemptPi == "3.14159265") {
                    _StdOut.putText("CONGRATS!! You knew the beginning of Pi. You're reward...");
                    _StdOut.advanceLine();
                    _StdOut.putText("MORE PI!!... 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679...");
                } else {
                    _StdOut.putText("Boooo you got Pi WRONG. No Pie for you :(");
                }
            } else {
                _StdOut.putText("Please supply pi after pie");
            }
        }

        public shellStatus(args: string[]) {
            if (args.length > 0) {
                var i = 0;
                while (args[i] != null) {
                    _OsShell.hostStatus = _OsShell.hostStatus + args[i] + " ";
                    i++
                }
                document.getElementById("status").innerHTML = _OsShell.hostStatus;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }

            console.log("Host Status: " + _OsShell.hostStatus + ", or " + String(_OsShell.hostStatus) + ", or " + document.getElementById("status").innerHTML); // works on manual entry
        }

        public shellLoad() {
            // Retrieve user input and remove whitespace
            var user_input = document.getElementById("taProgramInput")["value"];
            var condensed_input = user_input.replace(/ +/g, "").toUpperCase();
            // Validate that string only contains hex characters
            var isHexTrue:boolean = true;
            for (var i=0; i<condensed_input.length; i++) {
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

                /* Create and Populate New Process Control Block */
                if (_PCB_Current_PID < 3) {
                    // create new PCB
                    var PCB = new TSOS.PCB();
                    // assign & increment Process ID
                    PCB.PID = _PCB_Current_PID;
                    _PCB_Current_PID++;
                    // assign PCB state & location & priority
                    PCB.State = "Resident";
                    PCB.Location = "Memory";
                    PCB.Priority = 32;
                    // add New PCB to Resident List
                    _PCB_ResidentList.push(PCB);

                    /* Load user program into Memory and update GUI */
                    // load memory
                    _MemoryManager.loadMemory(condensed_input, PCB.PID);
                    // update GUI
                    Control.updateGUI_Memory_();
                    Control.updateGUI_PCB_(); 
                    
                    // Console logging & Shell output
                    console.log("[shellLoad] - PCB (" + String(PCB.PID) + ") was added. There are currently " + String(_PCB_ResidentList.length) + " PCB's in Resident List.")
                    _StdOut.putText("Process ID Number: " + String(PCB.PID));
                }
                else {
                    _StdOut.putText("[MEMORY ALLOCATION EXCEEDED] - Memory already contains 3 loaded processes.");
                }
            }
            else {
                _StdOut.putText("[INPUT ERROR] - Please supply only hexadecimal values into the User Program Input");
            }
        }

        public shellRun(args: string[]) {
            // validate for appropriate user input
            if (args.length = 1) {
                var valid_pid = false;
                var pid_input = Number(args[0]);
                // loop through list of processes to find matching PID
                for (let i=0; i<_PCB_ResidentList.length; i++) {
                    if (_PCB_ResidentList[i].PID == pid_input) {
                        valid_pid = true;
                        _PCB_Current = _PCB_ResidentList[i];
                        break;
                    }
                }
                // validate the found process's state
                if (valid_pid && _PCB_ResidentList[_PCB_Current.PID].State == "Resident") {
                    // update process state
                    _PCB_Current.State = "Ready";
                    _PCB_ReadyQ.enqueue(_PCB_Current);
                    // allow process to run in CPU
                    _CPU.isExecuting = true;
                }
                else {
                    if (!valid_pid) {
                        _StdOut.putText("Process [" + pid_input + "] was NOT found. Please enter a valid <PID>.");
                    }
                    else if (_PCB_Current.State != "Resident") {
                        _StdOut.putText("Process [" + pid_input + "] is not available to be run. Make sure the specified process is Resident before running.");
                    }
                }
            }
            else {
                _StdOut.putText("Please supply a ProcessID integer to run a specified program from Memory");
            }
        }

        public shellBSOD() {
            let msg:string = "Uh oh... well, even though it was a test, you done f%$ked up";
            _Kernel.krnTrapError(msg);
            (document.getElementById("status")).innerHTML = "[BSOD ERROR]";
        }

        public shellClearMem() {
            // clear all memory partitions
            _Memory.init();
            Control.updateGUI_Memory_();
            Control.clearGUI_PCB_();
            _PCB_Current_PID = 0;
            _PCB_ResidentList.splice(0, _PCB_ResidentList.length);
            _StdOut.putText("All Memory partitions were successfully cleared");
        }
s
        public shellRunAll() {
            for (var i=0; i<_PCB_ResidentList.length; i++) { // for now...
                // validate the found process's state
                if (_PCB_ResidentList[i].State == "Resident") {
                    // iterate through processes
                    _PCB_Current = _PCB_ResidentList[i];
                    // update process state
                    _PCB_Current.State = "Ready";
                    // add to ready queue
                    _PCB_ReadyQ.enqueue(_PCB_Current);
                    // allow process to run in CPU
                    _CPU.isExecuting = true;
                }
            }
            // call scheduler to run processes
            //_Scheduler.determineSchedule();
        }

        public shellPS() {
            // display the PID and state of all processes
            for (var i = 0; i < _PCB_ResidentList.length; i++){
                _StdOut.putText("Process ID: " + _PCB_ResidentList[i].PID + " - State: " + _PCB_ResidentList[i].State);
                _StdOut.advanceLine();
            }
        }

        public shellKill(args: string[]) {
            // kill one process
            if (args.length = 1) {
                var pid_input = Number(args[0]);
                var found = false;
                for (var i=0; i<_PCB_ResidentList.length; i++) {
                    if (_PCB_ResidentList[i] == _PCB_ResidentList[pid_input]) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    _PCB_ResidentList[pid_input].State = "Terminated";
                    _CPU.isExecuting = false;
                    Control.updateGUI_PCB_();
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

        public shellKillAll() {
            // kill all process
            if (_PCB_ResidentList.length > 0) {
                for (var i=0; i<_PCB_ResidentList.length; i++) {
                    _PCB_ResidentList[i].State = "Terminated";
                }
                _CPU.isExecuting = false;
                Control.updateGUI_PCB_();
                _StdOut.putText("Successfully Terminated All Loaded Processes");
            }
            else {
                _StdOut.putText("[ERROR] - There are no loaded processes. Please enter a User Program and load it into memory before terminating.");
            }
        }

        public shellQuantum(args: string[]) {
            // let the user set the Round Robin quantum 
            if ((args.length = 1) && !(isNaN(Number(args[0])))) {
                _Quantum = parseInt(args[0]);
                _StdOut.putText("Successfully Set the Round Robin Quantum to " + String(_Quantum));
            } 
            else {
                _StdOut.putText("Supplied <Quantum> was not valid. Please supply an integer that will act as the Round Robin Quantum and measured in CPU cycles.");
            }
        }
    }
}
    
