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
                    public IR: string = "[IR]",
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {
        }

        public init(): void {
            this.PC = 0;
            this.IR = "[IR]";
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

            /* Execute a Process by Running through instructions 
            in Memory and updating CPU & PCB GUI */
            // Run next op code
            this.runOPcode();
            // Update Current PCB
            this.storePCB();
            // Update GUI
            Control.updateGUI_PCB_();
            Control.updateGUI_CPU_();
        }

        public runOPcode(): void {
            // retrieve op code from memory
            var op_code = _MemoryAccessor.fetchMemory(this.PC);
            console.log("OP Code returned from Memory: " + op_code);
            
            // determine which assembly instruction
            switch(op_code) {
                case "A9": this.LDAC();     break;
                case "AD": this.LDAM();     break;
                case "8D": this.STA();      break;
                case "6D": this.ADC();      break;
                case "A2": this.LDXC();     break;
                case "AE": this.LDXM();     break;
                case "A0": this.LDYC();     break;
                case "AC": this.LDYM();     break;
                case "EA": this.NOP();      break;
                case "00": this.BRK();      break;
                case "EC": this.CPX();      break;
                case "D0": this.BNE();      break;
                case "EE": this.INC();      break;
                case "FF": this.SYS();      break;
                default:
                    _PCBList[_current_PCB_PID].State = "Terminated";
                    _CPU.isExecuting = false;
                }
        }

        public storePCB(): void {
            if ((_CPU.isExecuting == false) && (_PCBList[_current_PCB_PID].State == "Terminated")) {
                _StdOut.advanceLine();
                _StdOut.putText("Invalid Op Code: " + _MemoryAccessor.fetchMemory(this.PC));
                _StdOut.advanceLine();
                _StdOut.putText("Process [" + _PCBList[_current_PCB_PID].PID + "] has been Terminated");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }
            else if(_CPU.isExecuting == false) {
                // update completed PCB
                _PCBList[_current_PCB_PID].PC = this.PC;
                _PCBList[_current_PCB_PID].IR = this.IR;
                _PCBList[_current_PCB_PID].Acc = this.Acc;
                _PCBList[_current_PCB_PID].Xreg = this.Xreg;
                _PCBList[_current_PCB_PID].Yreg = this.Yreg;
                _PCBList[_current_PCB_PID].Zflag = this.Zflag;
                _PCBList[_current_PCB_PID].State = "Completed";
                // output success and new line
                _StdOut.advanceLine();
                _StdOut.putText("Process [" + _PCBList[_current_PCB_PID].PID + "] Successfully Completed!");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }
            else {
                // update PCB every instruction
                _PCBList[_current_PCB_PID].PC = this.PC;
                _PCBList[_current_PCB_PID].IR = this.IR;
                _PCBList[_current_PCB_PID].Acc = this.Acc;
                _PCBList[_current_PCB_PID].Xreg = this.Xreg;
                _PCBList[_current_PCB_PID].Yreg = this.Yreg;
                _PCBList[_current_PCB_PID].Zflag = this.Zflag;
                _PCBList[_current_PCB_PID].State = "Running";
            }
        }


        /* ============ 6502 Machine Instructions ============ */
        // A9 - LDA - Load accumulator with constant
        public LDAC(): void {
            this.Acc = parseInt(_MemoryAccessor.fetchMemory(this.PC+1), 16);
            this.PC += 2;
            this.IR = "A9";
            console.log("ACC: " +  parseInt(_MemoryAccessor.fetchMemory(this.PC-1), 16));
            console.log("fetch mem: " + _MemoryAccessor.fetchMemory(this.PC-1));
            console.log("P.C.: " + (this.PC-1));
        }
        // AD - LDA  - Load accumulator from memory
        public LDAM(): void {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            this.Acc = Number(_MemoryAccessor.fetchMemory(mem_location));
            this.PC += 3;
            this.IR = "AD";
        }
        // 8D - STA  - Store accumulator in memory
        public STA(): void {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            var acc_to_mem = this.Acc.toString(16).toUpperCase();
            _Memory.tsosMemory[mem_location] = acc_to_mem;
            Control.updateGUI_Memory_();
            this.PC += 3;
            this.IR = "8D";
        }
        // 6D - ADC - Add with Carry
        public ADC(): void {
            var memory = _MemoryAccessor.fetchMemory(_MemoryAccessor.littleEndianAddress());      
            this.Acc += parseInt(memory, 16);
            this.PC += 3;
            this.IR = "6D";
        }
        // A2 - LDX - Load X register with constant
        public LDXC(): void {
            this.Xreg = parseInt(_MemoryAccessor.fetchMemory(this.PC+1), 16);
            this.PC += 2;
            this.IR = "A2";
        }
        // AE - LDX - Load X register from memory
        public LDXM(): void {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            this.Xreg = Number(_MemoryAccessor.fetchMemory(mem_location));
            this.PC += 3;
            this.IR = "AE";
        }
        // A0 - LDY - Load Y register with constant 
        public LDYC(): void {
            this.Yreg = parseInt(_MemoryAccessor.fetchMemory(this.PC+1), 16);
            this.PC += 2;
            this.IR = "A0";
        }
        // AC - LDY - Load Y register from memory
        public LDYM(): void {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            this.Yreg = Number(_MemoryAccessor.fetchMemory(mem_location));
            this.PC += 3;
            this.IR = "AC";
        }
        // EA - NOP - No Operation
        public NOP(): void {
            this.PC += 1;
            this.IR = "EA";
        }
        // 00 - BRK - Break
        public BRK(): void {
            this.IR = "00";
            this.isExecuting = false;
        }
        // EC - CPX - Compare a byte in memory to X reg, sets z flag if equal
        public CPX(): void {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            if (parseInt(_MemoryAccessor.fetchMemory(mem_location), 16) == this.Xreg) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            this.PC += 3;
            this.IR = "EC";
        }
        // D0 - BNE - Branch n bytes if Z flag = 0
        public BNE(): void {
            if(this.Zflag == 0) {
                var bytes_to_branch = parseInt(_MemoryAccessor.fetchMemory(this.PC+1), 16);
                if ((bytes_to_branch+this.PC) > 256) {
                    this.PC = (this.PC + bytes_to_branch) % 256;
                } else {
                    this.PC += bytes_to_branch;
                }
            }
            else {
                this.PC += 2;
            }
            this.IR = "D0";
        }
        // EE - INC - Increment value of a byte
        public INC(): void {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            var increment = parseInt(_MemoryAccessor.fetchMemory(mem_location), 16);
            increment += 1;
            _Memory.tsosMemory[mem_location] = increment.toString(16);
            Control.updateGUI_Memory_;
            this.PC += 3;
            this.IR = "EE";
        }
        // FF - SYS - System Call (#$01 in X = print Y, #$02 in X = print 00-terminated string at addr in Y)
        public SYS(): void {
            if(this.Xreg == 1) {
                _StdOut.putText(this.Yreg.toString(16));
            }
            else if(this.Xreg == 2) {
                var Y_location = this.Yreg;
                var print = "";
                while(_Memory.tsosMemory[Y_location] != "00") {
                    print += (String.fromCharCode(parseInt(_Memory.tsosMemory[Y_location], 16)));
                    Y_location += 1;
                }
                _StdOut.putText(print);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }
            this.PC += 1;
            this.IR = "FF";
        }
    }
}
