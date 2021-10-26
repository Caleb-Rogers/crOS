var TSOS;
(function (TSOS) {
    class Memory {
        constructor(mem_used = 0) {
            this.mem_used = mem_used;
            this.tsosMemory = new Array(256);
        }
        init() {
            this.mem_used = 0;
            for (var i = 0; i < this.tsosMemory.length; i++) {
                this.tsosMemory[i] = "00";
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map