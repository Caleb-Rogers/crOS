module TSOS {

    export class Memory {

        public tsosMemory = new Array<string>(256);
        
        constructor() {
        
        }

        public init(): void {
            for (var i=0; i<this.tsosMemory.length; i++) {
                this.tsosMemory[i] = "00";
            }
        }
    }
}