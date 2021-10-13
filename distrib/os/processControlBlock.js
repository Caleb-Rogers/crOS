var TSOS;
(function (TSOS) {
    class PCB {
        constructor(PID = 0, // ProcessID
        PC = 0, // ProcessCounter
        IR = "", // Instruction Register    
        Acc = 0, // Accumulator
        Xreg = 0, // X Register
        Yreg = 0, // Y Register 
        Zflag = 0, // Z Flag
        Priority = 0, // Priority
        State = false, // isRunning? State
        Location = "") {
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
            this.PID = 0;
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Priority = 0;
            this.State = true;
            this.Location = "";
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map