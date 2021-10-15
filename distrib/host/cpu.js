/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, IR = "", Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
        runOPcodes() {
            // retrieve op code in Memory
            var op_code = _MemoryAccessor.fetchMemory(this.PC);
            console.log("op code: " + op_code);
            /*
            switch(op_code) {
                case "A9": // LDA constant
                    // Increment Program Counter
                    this.PC ++;
                    // Update Accumulator with a constant
                    // ...
                    // Update Instruction Register with OP Code
                    this.IR = "A9";

                case "AD": // LDA memory
                    // Increment Program Counter
                    this.PC ++;
                    // Update Accumulator from Memory
                    // ...
                    // Update Instruction Register with OP Code
                    this.IR = "AD";

                case "8D": // STA
                    // get Accumulator - location and value in array
                    // ...
                    // update Memory
                    _Memory.tsosMemory[location] = String(this.Acc);
                    this.PC ++;
                    // Update Instruction Register with OP Code
                    this.IR = "8D";
            }
            */
            console.log("Program Counter: " + this.PC);
            console.log("Accumulator: " + this.Acc);
            console.log("Instruction Register: " + this.IR);
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map