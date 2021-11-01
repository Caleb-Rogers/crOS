var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        fetchMemory(index) {
            return _Memory.tsosMemory[index + _current_PCB_Section];
        }
        fetchAllMemory() {
            return _Memory.tsosMemory;
        }
        littleEndianAddress() {
            var first_val = parseInt(this.fetchMemory(_CPU.PC + 1), 16);
            var second_val = parseInt(this.fetchMemory(_CPU.PC + 2), 16);
            var machine_instruction_loc = first_val + second_val;
            return machine_instruction_loc;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map