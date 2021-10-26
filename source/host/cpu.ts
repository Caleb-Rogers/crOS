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
            this.runOPcode();

            // Update GUI
            Control.updatePCB_GUI();
            Control.updateCPU_GUI(); 

            // update Program Counter for CPU
            this.PC++;
            // update Instruction for CPU
            this.IR = _MemoryAccessor.fetchMemory(this.PC);
            
        }

        public runOPcode(): void {
            // retrieve op code from memory
            var op_code = _MemoryAccessor.fetchMemory(this.PC);
            console.log("OP Code returned from Memory: " + op_code);
            
            // determine which assembly instruction
            switch(op_code) {
                case "A9": this.LDAC();
                case "AD": this.LDAM();
                case "8D": this.STA();
                case "6D": this.ADC();
                case "A2": this.LDXC();
                case "AE": this.LDXM();
                case "A0": this.LDYC();
                case "AC": this.LDYM();
                case "EA": this.NOP();
                case "00": this.BRK();
                case "EC": this.CPX();
                case "D0": this.BNE();
                case "EE": this.INC();
                case "FF": this.SYS();

            }
        }

        /* ============ 6502 Machine Instructions ============ */
        // A9 - LDA - Load accumulator with constant
        public LDAC(): void {

        }
        // AD - LDA  - Load accumulator from memory
        public LDAM(): void {

        }
        // 8D - STA  - Store accumulator in memory
        public STA(): void {

        }
        // 6D - ADC - Add with Carry
        public ADC(): void {

        }
        // A2 - LDX - Load X register with constant
        public LDXC(): void {

        }
        // AE - LDX - Load X register from memory
        public LDXM(): void {

        }
        // A0 - LDY - Load Y register with constant 
        public LDYC(): void {

        }
        // AC - LDY - Load Y register from memory
        public LDYM(): void {

        }
        // EA - NOP - No Operation
        public NOP(): void {

        }
        // 00 - BRK - Break
        public BRK(): void {

        }
        // EC - CPX - Compare a byte in memory to X reg, sets z flag if equal
        public CPX(): void {

        }
        // D0 - BNE - Branch n bytes if Z flag = 0
        public BNE(): void {

        }
        // EE - INC - Increment value of a byte
        public INC(): void {

        }
        // FF - SYS - System Call (#$01 in X = print Y, #$02 in X = print 00-terminated string at addr in Y)
        public SYS(): void {

        }
    }
}
