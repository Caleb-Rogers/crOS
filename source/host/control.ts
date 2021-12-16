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
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }

        
        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnEnableSingleStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            
            // Create and initialize Memory, also part of hardware
            _Memory = new Memory();
            _Memory.init();
            // and a way to access it
            _MemoryAccessor = new MemoryAccessor();

            // Create and initialize Disk
            _Virtual_Disk = new Disk();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.

            // Set initial host display upon starting system 
            var today = new Date().toLocaleDateString();
            var runningTime = new Date().toLocaleTimeString();
            var currentStat = "Engines Running";
            document.getElementById("date").innerHTML=today;
            document.getElementById("time").innerHTML=runningTime;
            document.getElementById("status").innerHTML=currentStat;
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.

            location.reload(); // true in parameters?
            
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnEnableSingleStep_click(btn): void {
            // change single step to on
            _enabled_Single_Step = true;
            // disable this button
            btn.disabled = true;
            // enable the single step off button
            (<HTMLButtonElement>document.getElementById("btnDisableSingleStep")).disabled = false;
            // enable the step button
            (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = false;
        }

        public static hostBtnDisableSingleStep_click(btn): void {
            // change single step to off
            _enabled_Single_Step = false;
            // disable this button
            btn.disabled = true;
            // disable the step button
            (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = true;
            // enable the single step on button
            (<HTMLButtonElement>document.getElementById("btnEnableSingleStep")).disabled = false;
        }

        public static hostBtnNextStep_click(btn): void {
            _Next_Step = true;
        }


        /* ============ GUI Functions ============ */
        public static dynamicHostTime(): void {
            var runningTime = new Date().toLocaleTimeString();
            document.getElementById("time").innerHTML=runningTime;
        }

        public static dynamicHostStatus(): void {
            document.getElementById("status").innerHTML=status;
        }

        public static BSOD(msg): void {
            document.getElementById("display").style.background = "lightblue";
            document.getElementById("backdrop").style.background = "blue";
            _Console.clearScreen();
            _Console.resetXY();
            _StdOut.putText("[BSOD ERROR]: " + msg);
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
        }
        
        public static updateGUI_Memory_(): void {          
            var memory_table = document.getElementById("tblMem");
            var mem_input = "";
            var row_length = 8;
            var mem_location = 0;
            var hex_value = 0;   
            var k = 0;                  
            for(let i=0; i<_Memory.tsosMemory.length; i++) {
                if (hex_value == 0 || hex_value == 8) {
                    mem_input += "<tr><td> 0x00" + hex_value.toString(16).toUpperCase() + "</td>";
                    hex_value += 8;
                }
                else if(hex_value > 248) {
                    mem_input += "<tr><td> 0x" + hex_value.toString(16).toUpperCase() + "</td>";
                    hex_value += 8; 
                }
                else{
                    mem_input += "<tr><td> 0x0" + hex_value.toString(16).toUpperCase() + "</td>";
                    hex_value += 8; 
                }
                for(let j=0; j< row_length; j++) {
                    if(k < _Memory.tsosMemory.length) {
                        mem_input += "<td>" + _Memory.tsosMemory[k] + "</td>"; 
                        mem_location = mem_location + 1;
                        k = k + 1;
                    }
                    else{
                        mem_input += "<td>" + "00" + "</td>"; 

                    }
                }
                mem_input += "</tr>";
            }
            memory_table.innerHTML = mem_input;
        }

        public static updateGUI_PCB_(): void {
            // clear PCB table
            this.clearGUI_PCB_();
            // insert rows for every process stored
            var processTable = <HTMLTableElement>document.getElementById("tblPCB");
            for (var i=0; i<_PCB_ResidentList.length; i++) {
                // Insert a row
                var row = processTable.insertRow(i + 1);
                // Insert PCB values
                var pid_cell = row.insertCell(0);
                pid_cell.innerHTML = String(_PCB_ResidentList[i].PID);
                var pc_cell = row.insertCell(1);
                pc_cell.innerHTML = _PCB_ResidentList[i].PC.toString(16).toUpperCase();
                var ir_cell = row.insertCell(2);
                ir_cell.innerHTML = _PCB_ResidentList[i].IR;
                var acc_cell = row.insertCell(3);
                acc_cell.innerHTML = _PCB_ResidentList[i].Acc.toString(16).toUpperCase();
                var x_cell = row.insertCell(4);
                x_cell.innerHTML = _PCB_ResidentList[i].Xreg.toString(16).toUpperCase();
                var y_cell = row.insertCell(5);
                y_cell.innerHTML = _PCB_ResidentList[i].Yreg.toString(16).toUpperCase();
                var z_cell = row.insertCell(6);
                z_cell.innerHTML = _PCB_ResidentList[i].Zflag.toString(16).toUpperCase();
                var priority_cell = row.insertCell(7);
                priority_cell.innerHTML = String(_PCB_ResidentList[i].Priority);
                var state_cell = row.insertCell(8);
                state_cell.innerHTML = _PCB_ResidentList[i].State;
                var location_cell = row.insertCell(9);
                location_cell.innerHTML = _PCB_ResidentList[i].Location;
            }
        }

        public static clearGUI_PCB_(): void {
            // clear PCB table
            var processTable = <HTMLTableElement>document.getElementById("tblPCB");
            for (var i = processTable.rows.length; i > 1; i--){
                processTable.deleteRow(i-1);
            }
        }

        public static updateGUI_CPU_(): void {
            document.getElementById("cpuPC").innerHTML = _CPU.PC.toString(16).toUpperCase();
            document.getElementById("cpuIR").innerHTML = _CPU.IR
            document.getElementById("cpuACC").innerHTML = _CPU.Acc.toString(16).toUpperCase();
            document.getElementById("cpuX").innerHTML = _CPU.Xreg.toString(16).toUpperCase();
            document.getElementById("cpuY").innerHTML = _CPU.Yreg.toString(16).toUpperCase();
            document.getElementById("cpuZ").innerHTML = _CPU.Zflag.toString(16).toUpperCase();
        }

        public static updateGUI_Disk_(): void {
            var sessionStorageData: String[];
            var diskTblRowCount = 1;
            // clear Disk table
            this.clearGUI_Disk_();
            // get disk table
            var diskTbl = <HTMLTableElement>document.getElementById("tblDisk");

            // header info
            var diskHeader= diskTbl.insertRow(0);
            var diskHeaderTSB = diskHeader.insertCell(0);
            diskHeaderTSB.innerHTML = "T:S:B";
            var diskHeaderUsed = diskHeader.insertCell(1);
            diskHeaderUsed.innerHTML = "Used";
            var diskHeaderNext = diskHeader.insertCell(2);
            diskHeaderNext.innerHTML = "Next";
            var diskHeaderData = diskHeader.insertCell(3);
            diskHeaderData.innerHTML = "Data";

            // populate fields
            for (var i=0; i<_Virtual_Disk.tracks; i++) {
                for (var j=0; j<_Virtual_Disk.sectors; j++) {
                    for (var k=0; k<_Virtual_Disk.blocks; k++) {
                        // utilize HTML5 session storage
                        sessionStorageData = sessionStorage.getItem(i + ":" + j +":" + k).split(",");
                        // fill rows with cells
                        var diskTblRow = diskTbl.insertRow(diskTblRowCount);
                        diskTblRowCount++;
                        var diskTSBCell = diskTblRow.insertCell(0);
                        diskTSBCell.innerHTML = i + ":" + j +":" + k;
                        var diskUsedCell = diskTblRow.insertCell(1);
                        diskUsedCell.innerHTML = sessionStorageData[0].valueOf();
                        var diskNextCell = diskTblRow.insertCell(2);
                        diskNextCell.innerHTML = sessionStorageData[1] + ":" + sessionStorageData[2] + ":" + sessionStorageData[3];
                        var diskDataCell = diskTblRow.insertCell(3);
                        var diskDataInput = new String();
                        for (var x=4; x<sessionStorageData.length; x++) {  //Does someone know the commonly used letter in a 4th for loop? Ill use w cause its a pretty cool letter
                            diskDataInput += sessionStorageData[x].valueOf();
                        }
                        diskDataCell.innerHTML = diskDataInput.valueOf();
                    }
                }
            }
        }

        public static clearGUI_Disk_(): void {
            var diskTable = <HTMLTableElement>document.getElementById("tblDisk");
            for (var i=diskTable.rows.length; i>1; i--) {
                diskTable.deleteRow(i-1);
            }

        }
    }
}
