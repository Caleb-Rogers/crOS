var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        fetchMemory(index) {
            return _Memory.tsosMemory[index];
        }
        fetchAllMemory() {
            return _Memory.tsosMemory;
        }
        littleEndianAddress() {
            var lowOrderByte = parseInt(this.fetchMemory(_CPU.PC + 1), 16);
            var highOrderByte = parseInt(this.fetchMemory(_CPU.PC + 2), 16);
            var machine_instruction_loc = lowOrderByte + highOrderByte;
            return machine_instruction_loc;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map