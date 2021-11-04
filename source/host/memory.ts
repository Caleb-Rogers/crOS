module TSOS {

    export class Memory {

        public tsosMemory = new Array<string>(768);
        
        constructor( 
            public mem_used: number = 0, 
            public mem_counter: number = 0) {    
        }

        public init(): void {
            this.mem_used = 0;
            this.mem_counter = 0;
            for (var i=0; i<this.tsosMemory.length; i++) {
                this.tsosMemory[i] = "00";
            }
        }

        public fetchSectionBase(section) {
            switch (String(section)) {
                case "0": return 0;
                case "1": return 256;
                case "2": return 512;
                default:
                    console.log("Section [" + section + "] is not valid");
            }
        }

        public fetchSectionLimit(section) {
            switch (String(section)) {
                case "0": return 255;
                case "1": return 511;
                case "2": return 767;
                default:
                    console.log("Section [" + section + "] is not valid");
            }
        }
    }
}