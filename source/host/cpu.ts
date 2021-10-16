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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public IR: string = "",
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {
        }

        public init(): void {
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            // Update PCB state to Running
            _CurrPCB.State = "Running";
            // Run next op code
            this.runOPcodes();
            // Update current PCB
            _CurrPCB.PC = this.PC;
            _CurrPCB.IR = this.IR;
            _CurrPCB.Acc = this.Acc;
            _CurrPCB.Xreg = this.Xreg; 
            _CurrPCB.Yreg = this.Yreg; 
            _CurrPCB.Zflag = this.Zflag;
            // Update GUI
            Control.updatePCB();
            Control.updateCPU(); 
            // increment PC
            this.PC++;

        }

        public runOPcodes(): void {
            // retrieve op code in Memory
            var op_code = _MemoryAccessor.fetchMemory(this.PC);
            console.log("op code: " + op_code);
            
            switch(op_code) {
                case "A9": // LDA constant
                    this.loadConstant();

                case "AD": // LDA memory
                    this.loadMemory();

                case "8D": // STA
                    this.storeACCtoMem();
            }

            console.log("Program Counter: " + this.PC);
            console.log("Accumulator: " + this.Acc);
            console.log("Instruction Register: " + this.IR);

        }


        /********** OP Code Operations **********/
        public loadConstant(): void {
            // Increment Program Counter
            this.PC ++;
            // Update Accumulator with a constant
            this.Acc = parseInt(_MemoryAccessor.fetchMemory(this.PC),16);
            // Update Instruction Register with OP Code
            this.IR = "A9";
        }

        public loadMemory(): void {
            // Increment Program Counter
            this.PC ++;
            // Update Accumulator from Memory
            this.Acc = parseInt(_MemoryAccessor.fetchMemory(this.PC),16);
            // Update Instruction Register with OP Code
            this.IR = "AD";
        }

        public storeACCtoMem():void {
            // get Location
            // get ACC value
            // insert to memory
            // update GUI?

            var mem_location = parseInt(_MemoryAccessor.fetchMemory(this.PC),16);
            var hex_value = _CurrPCB.Acc.toString(16);
            _Memory.tsosMemory[mem_location] = hex_value;
            TSOS.Control.updateMemory;

            // Increment Program Counter
            this.PC ++;
            this.PC ++;
            // Update Instruction Register with OP Code
            this.IR = "8D";
        }

        /*
        public addWithCarry(): void {

        }

        public loadXregisterConstant(): void {

        }

        public loadXregisterMemory(): void {

        }

        public loadYregisterConstant(): void {

        }

        public loadYregisterMemory(): void {

        }

        public nothin(): void {

        }

        public break(): void {

        }

        public compareToZflag(): void {

        }

        public branchIfZflag(): void {

        }

        public incrementByte(): void {

        }

        public sysCall(): void {

        }
        */
    }
}
