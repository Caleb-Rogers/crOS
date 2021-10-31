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
        constructor(PC = 0, IR = "[IR]", Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
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
            this.IR = "[IR]";
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
            if (_Memory.mem_counter == _Memory.mem_used - 1) {
                _CPU.isExecuting = false;
            }
            _Memory.mem_counter++;
            // Run next op code
            this.runOPcode();
            // Update Current PCB
            this.storePCB();
            // Update GUI
            TSOS.Control.updateGUI_PCB_();
            TSOS.Control.updateGUI_CPU_();
        }
        runOPcode() {
            // retrieve op code from memory
            var op_code = _MemoryAccessor.fetchMemory(this.PC);
            console.log("OP Code returned from Memory: " + op_code);
            // determine which assembly instruction
            switch (op_code) {
                case "A9":
                    this.LDAC();
                    break;
                case "AD":
                    this.LDAM();
                    break;
                case "8D":
                    this.STA();
                    break;
                case "6D":
                    this.ADC();
                    break;
                case "A2":
                    this.LDXC();
                    break;
                case "AE":
                    this.LDXM();
                    break;
                case "A0":
                    this.LDYC();
                    break;
                case "AC":
                    this.LDYM();
                    break;
                case "EA":
                    this.NOP();
                    break;
                case "00":
                    this.BRK();
                    break;
                case "EC":
                    this.CPX();
                    break;
                case "D0":
                    this.BNE();
                    break;
                case "EE":
                    this.INC();
                    break;
                case "FF":
                    this.SYS();
                    break;
                default:
                    _StdOut.putText("Invalid Op Code" + _PCBList[_current_PCB_PID]);
                    _StdOut.advanceLine();
            }
        }
        storePCB() {
            if (_CPU.isExecuting == false) {
                _PCBList[_current_PCB_PID].PC = this.PC;
                _PCBList[_current_PCB_PID].IR = this.IR;
                _PCBList[_current_PCB_PID].Acc = this.Acc;
                _PCBList[_current_PCB_PID].Xreg = this.Xreg;
                _PCBList[_current_PCB_PID].Yreg = this.Yreg;
                _PCBList[_current_PCB_PID].Zflag = this.Zflag;
                _PCBList[_current_PCB_PID].State = "Completed";
            }
            else {
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
        LDAC() {
            this.PC += 2;
            this.IR = "A9";
            this.Acc = parseInt(_MemoryAccessor.fetchMemory(this.PC + 1), 16);
        }
        // AD - LDA  - Load accumulator from memory
        LDAM() {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            this.PC += 3;
            this.IR = "AD";
            this.Acc = Number(_MemoryAccessor.fetchMemory(mem_location));
        }
        // 8D - STA  - Store accumulator in memory
        STA() {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            var decToHex = this.Acc.toString(16).toUpperCase();
            _Memory.tsosMemory[mem_location] = decToHex;
            TSOS.Control.updateGUI_Memory_();
            this.PC += 3;
            this.IR = "8D";
        }
        // 6D - ADC - Add with Carry
        ADC() {
            var memory = _MemoryAccessor.fetchMemory(_MemoryAccessor.littleEndianAddress());
            this.PC += 3;
            this.IR = "6D";
            this.Acc += parseInt(memory, 16);
        }
        // A2 - LDX - Load X register with constant
        LDXC() {
            this.PC += 2;
            this.IR = "A2";
            this.Xreg = parseInt(_MemoryAccessor.fetchMemory(this.PC + 1), 16);
        }
        // AE - LDX - Load X register from memory
        LDXM() {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            this.PC += 3;
            this.IR = "AE";
            this.Xreg = Number(_MemoryAccessor.fetchMemory(mem_location));
        }
        // A0 - LDY - Load Y register with constant 
        LDYC() {
            this.PC += 2;
            this.IR = "A0";
            this.Yreg = parseInt(_MemoryAccessor.fetchMemory(this.PC + 1), 16);
        }
        // AC - LDY - Load Y register from memory
        LDYM() {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            this.PC += 3;
            this.IR = "AC";
            this.Yreg = Number(_MemoryAccessor.fetchMemory(mem_location));
        }
        // EA - NOP - No Operation
        NOP() {
            this.PC += 1;
            this.IR = "EA";
        }
        // 00 - BRK - Break
        BRK() {
            this.IR = "00";
            this.isExecuting = false;
        }
        // EC - CPX - Compare a byte in memory to X reg, sets z flag if equal
        CPX() {
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
        BNE() {
            /*
            ...
            */
        }
        // EE - INC - Increment value of a byte
        INC() {
            var mem_location = _MemoryAccessor.littleEndianAddress();
            var increment = parseInt(_MemoryAccessor.fetchMemory(mem_location), 16);
            increment += 1;
            _Memory.tsosMemory[mem_location] = increment.toString(16);
            TSOS.Control.updateGUI_Memory_;
            this.PC += 3;
            this.IR = "EE";
        }
        // FF - SYS - System Call (#$01 in X = print Y, #$02 in X = print 00-terminated string at addr in Y)
        SYS() {
            if (this.Xreg == 1) {
                _StdOut.putText(this.Yreg.toString(16));
            }
            else if (this.Xreg == 2) {
                var Y_location = this.Yreg;
                var print = "";
                while (_Memory.tsosMemory[Y_location] != "00") {
                    print += (String.fromCharCode(parseInt(_Memory.tsosMemory[Y_location], 16)));
                    Y_location += 1;
                }
                _StdOut.putText(print);
            }
            this.IR = "FF";
            this.PC += 1;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map