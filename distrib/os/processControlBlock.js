var TSOS;
(function (TSOS) {
    class PCB {
        constructor(PID = 0, // ProcessID
        PC = 0, // ProgramCounter
        IR = "[IR]", // Instruction Register    
        Acc = 0, // Accumulator
        Xreg = 0, // X Register
        Yreg = 0, // Y Register 
        Zflag = 0, // Z Flag
        Priority = 0, // Priority
        State = "Resident", // isRunning? State
        Location = "Memory") {
            this.PID = PID;
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.Priority = Priority;
            this.State = State;
            this.Location = Location;
        }
        init() {
            this.PID = _current_PCB_PID;
            this.PC = 0;
            this.IR = "[empty]";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Priority = 0;
            this.State = "Resident";
            this.Location = "Memory";
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map