module TSOS {

    export class MemoryAccessor {

        constructor() {}

        
        public fetchMemory(index) {
            return _Memory.tsosMemory[index];
        }

        public fetchAllMemory() {
            return _Memory.tsosMemory;
        }

        public littleEndianAddress() {
            var lowOrderByte = parseInt(this.fetchMemory(_CPU.PC+1), 16);
            var highOrderByte = parseInt(this.fetchMemory(_CPU.PC+2), 16);
            var machine_instruction_loc = lowOrderByte + highOrderByte;
            return machine_instruction_loc;
        }
    }
}
