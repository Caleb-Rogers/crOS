/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME = "crOS"; // Seemed fitting
const APP_VERSION = "2.001"; // Wow, 2 decades under my belt
const CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
const TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ = 1;
// ...
const CONTEXT_SWITCH_IRQ = 4;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
// Hardware (host)
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory;
var _MemoryAccessor; //
// Software (OS)
var _MemoryManager = null;
//var _current_PCB_Section: number = 0; 
var _PCB;
var _PCB_Current;
var _PCB_Current_PID = 0;
var _PCB_ResidentList = [];
var _PCB_ReadyQ;
var _Scheduler = null;
// Single Step
var _enabled_Single_Step = false;
var _Next_Step = false;
// Round Robin Quantum
var _Quantum = 6;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelInputQueue = null;
var _KernelBuffers = null;
// Standard input and output
var _StdIn = null;
var _StdOut = null;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
//# sourceMappingURL=globals.js.map