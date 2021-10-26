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
        static updateMemory() {
            var memory_table = document.getElementById("tblMem");
            var mem_tbl_body;
            var mem_locations = ["0x00", "0x008", "0x018", "0x020", "0x028", "0x030", "0x038", "0x040", "0x048", "0x050", "0x058", "0x060", "0x068", "0x070", "0x078", "0x080", "0x088", "0x090", "0x098", "0x100", "0x0A0", "0x0A8", "0x0B0", "0x0B8", "0x0C0", "0x0C8", "0x0D0", "0x0D8", "0x0E0", "0x0E8", "0x0F0", "0x0F8", "0x100", "0x108", "0x120", "0x128", "0x130", "0x138", "0X140", "0x148", "0X150", "0x158", "0X160", "0x168", "0X170", "0x178", "0X180", "0x188", "0X190", "0x198"];
            for (var i = 0; i < _Memory.tsosMemory.length; i++) {
                mem_tbl_body += "<tr><td>0x" + mem_locations[i] + "</td><td>" + _MemoryAccessor.fetchMemory[i] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 1] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 2] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 3] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 4] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 5] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 6] + "</td><td>" + _MemoryAccessor.fetchMemory[i + 7] + "</td>";
                memory_table.innerHTML = mem_tbl_body;
            }
            console.log("[Memory Updated]");
        }
        static updateCPU_GUI() {
            document.getElementById("cpuPC").innerHTML = String(_CPU.PC);
            document.getElementById("cpuIR").innerHTML = String(_CPU.IR);
            document.getElementById("cpuACC").innerHTML = String(_CPU.Acc);
            document.getElementById("cpuX").innerHTML = String(_CPU.Xreg);
            document.getElementById("cpuY").innerHTML = String(_CPU.Yreg);
            document.getElementById("cpuZ").innerHTML = String(_CPU.Zflag);
            console.log("[CPU Updated]");
        }
        static updatePCB_GUI() {
            for (var i = 0; i < _PCBList.length; i++) {
                document.getElementById("pcbPID").innerHTML = String(_PCBList[i].PID);
                document.getElementById("pcbPC").innerHTML = String(_PCBList[i].PC);
                document.getElementById("pcbIR").innerHTML = _PCBList[i].IR;
                document.getElementById("pcbACC").innerHTML = String(_PCBList[i].Acc);
                document.getElementById("pcbX").innerHTML = String(_PCBList[i].Xreg);
                document.getElementById("pcbY").innerHTML = String(_PCBList[i].Yreg);
                document.getElementById("pcbZ").innerHTML = String(_PCBList[i].Zflag);
                document.getElementById("pcbPRI").innerHTML = String(_PCBList[i].Priority);
                document.getElementById("pcbSTA").innerHTML = _PCBList[i].State;
                document.getElementById("pcbLOC").innerHTML = _PCBList[i].Location;
            }
            console.log("[PCB Updated]");
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map