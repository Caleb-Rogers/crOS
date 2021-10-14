module TSOS {

    export class PCB {

        constructor(public PID: number = 0,                 // ProcessID
                    public PC: number = 0,                  // ProgramCounter
                    public IR: string = "",                 // Instruction Register    
                    public Acc: number = 0,                 // Accumulator
                    public Xreg: number = 0,                // X Register
                    public Yreg: number = 0,                // Y Register 
                    public Zflag: number = 0,               // Z Flag
                    public Priority: number = 0,            // Priority
                    public State: boolean = false,          // isRunning? State
                    public Location: string = "",           // Process Location
                    ) {
        }

        public init(): void {
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
}