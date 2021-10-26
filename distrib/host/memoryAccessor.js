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
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map