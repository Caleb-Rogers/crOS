module TSOS {

    export class PCB {

        constructor(public PID: number = 0,                 // ProcessID
                    public PC: number = 0,                  // ProcessCounter
                    public Acc: number = 0,                 // Accumulator
                    public Xreg: number = 0,                // X Register
                    public Yreg: number = 0,                // Y Register 
                    public Zflag: number = 0,               // Z Flag
                    public isExecuting: boolean = false     // PCB state
                    ) {
        }

        public init(): void {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
    }
}