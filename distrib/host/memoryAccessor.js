var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        fetchMemory(index) {
            return _Memory.tsosMemory[index];
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map