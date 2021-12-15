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
        State = "Resident", // State
        Location = "Memory", // Location
        section = 0, QuantumCounter = 0) {
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
            this.section = section;
            this.QuantumCounter = QuantumCounter;
        }
        init() {
            this.PID = _PCB_Counter;
            this.PC = 0;
            this.IR = "[empty]";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Priority = 0;
            this.State = "Resident";
            this.Location = "Memory";
            this.section = 0;
            this.QuantumCounter = 0;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map