module TSOS {

    export class MemoryAccessor {

        constructor() {}

        
        public fetchMemory(index: number, section: number) {
            var location = index + this.fetchSectionBase(section);
            return _Memory.tsosMemory[location];
        }

        public fetchAllMemory() {
            return _Memory.tsosMemory;
        }

        public littleEndianAddress(index, section) {
            var lowOrderByte = parseInt(this.fetchMemory((index+1), section), 16);
            var highOrderByte = parseInt(this.fetchMemory((index+2), section), 16);
            var machine_instruction_loc = lowOrderByte + highOrderByte;
            return machine_instruction_loc;
        }

        public fetchSectionBase(section): number {
            switch (String(section)) {
                case "0": return 0;
                case "1": return 256;
                case "2": return 512;
                default:
                    console.log("Section [" + section + "] is not valid");
            }
        }

        public fetchSectionLimit(section): number {
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
