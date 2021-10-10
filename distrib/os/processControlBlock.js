var TSOS;
(function (TSOS) {
    class PCB {
        constructor(PID = 0, // ProcessID
        PC = 0, // ProcessCounter
        Acc = 0, // Accumulator
        Xreg = 0, // X Register
        Yreg = 0, // Y Register 
        Zflag = 0, // Z Flag
        isExecuting = false // PCB state
        ) {
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map