module TSOS {

    export class Memory {

        public tsosMemory = new Array<string>(256);
        
        constructor( public mem_used: number = 0 ) {
        
        }

        public init(): void {
            this.mem_used = 0;
            for (var i=0; i<this.tsosMemory.length; i++) {
                this.tsosMemory[i] = "00";
            }
        }
    }
}