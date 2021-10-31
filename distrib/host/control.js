/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // Create and initialize Memory, also part of hardware
            _Memory = new TSOS.Memory();
            _Memory.init();
            // and a way to access it
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
            // Set initial host display upon starting system 
            var today = new Date().toLocaleDateString();
            var runningTime = new Date().toLocaleTimeString();
            var currentStat = "We have tip off!";
            document.getElementById("date").innerHTML = today;
            document.getElementById("time").innerHTML = runningTime;
            document.getElementById("status").innerHTML = currentStat;
        }
        static hostBtnHaltOS_click(btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(); // true in parameters?
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        static dynamicHostTime() {
            var runningTime = new Date().toLocaleTimeString();
            document.getElementById("time").innerHTML = runningTime;
        }
        static BSOD(msg) {
            document.getElementById("display").style.background = "lightblue";
            document.getElementById("backdrop").style.background = "blue";
            _Console.clearScreen();
            _Console.resetXY();
            _StdOut.putText("[BSOD ERROR]: " + msg);
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
        }
        static updateGUI_Memory_() {
            var memory_table = document.getElementById("tblMem");
            var mem_input = "";
            var row_length = 8;
            var mem_location = 0;
            var hex_value = 0;
            var k = 0;
            for (let i = 0; i < _Memory.tsosMemory.length; i++) {
                if (hex_value == 0 || hex_value == 8) {
                    mem_input += "<tr><td> 0x00" + String(hex_value) + "</td>";
                    hex_value += 8;
                }
                else if (hex_value > 248) {
                    mem_input += "<tr><td> 0x" + String(hex_value) + "</td>";
                    hex_value += 8;
                }
                else {
                    mem_input += "<tr><td> 0x0" + String(hex_value) + "</td>";
                    hex_value += 8;
                }
                for (let j = 0; j < row_length; j++) {
                    if (k < _Memory.tsosMemory.length) {
                        mem_input += "<td>" + _Memory.tsosMemory[k] + "</td>";
                        mem_location = mem_location + 1;
                        k = k + 1;
                    }
                    else {
                        mem_input += "<td>" + "00" + "</td>";
                    }
                }
                mem_input += "</tr>";
            }
            memory_table.innerHTML = mem_input;
            console.log("[Memory Updated]");
        }
        static updateGUI_PCB_() {
            var processTable = document.getElementById("tblPCB");
            // clear PCB table
            for (var i = processTable.rows.length; i > 1; i--) {
                processTable.deleteRow(i - 1);
            }
            // insert rows for every process stored
            for (var i = 0; i < _PCBList.length; i++) {
                // Insert a row
                var row = processTable.insertRow(i + 1);
                // Insert PCB values
                var pid_cell = row.insertCell(0);
                pid_cell.innerHTML = String(_PCBList[i].PID);
                var pc_cell = row.insertCell(1);
                pc_cell.innerHTML = String(_PCBList[i].PC);
                var ir_cell = row.insertCell(2);
                ir_cell.innerHTML = _PCBList[i].IR;
                var acc_cell = row.insertCell(3);
                acc_cell.innerHTML = String(_PCBList[i].Acc);
                var x_cell = row.insertCell(4);
                x_cell.innerHTML = String(_PCBList[i].Xreg);
                var y_cell = row.insertCell(5);
                y_cell.innerHTML = String(_PCBList[i].Yreg);
                var z_cell = row.insertCell(6);
                z_cell.innerHTML = String(_PCBList[i].Zflag);
                var priority_cell = row.insertCell(7);
                priority_cell.innerHTML = String(_PCBList[i].Priority);
                var state_cell = row.insertCell(8);
                state_cell.innerHTML = _PCBList[i].State;
                var location_cell = row.insertCell(9);
                location_cell.innerHTML = _PCBList[i].Location;
            }
        }
        static updateGUI_CPU_() {
            document.getElementById("cpuPC").innerHTML = String(_CPU.PC);
            document.getElementById("cpuIR").innerHTML = String(_CPU.IR);
            document.getElementById("cpuACC").innerHTML = String(_CPU.Acc);
            document.getElementById("cpuX").innerHTML = String(_CPU.Xreg);
            document.getElementById("cpuY").innerHTML = String(_CPU.Yreg);
            document.getElementById("cpuZ").innerHTML = String(_CPU.Zflag);
            console.log("[CPU Updated]");
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map