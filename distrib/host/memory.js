var TSOS;
(function (TSOS) {
    class Memory {
        constructor(mem_used = 0, mem_counter = 0) {
            this.mem_used = mem_used;
            this.mem_counter = mem_counter;
            this.tsosMemory = new Array(768);
        }
        init() {
            this.mem_used = 0;
            this.mem_counter = 0;
            for (var i = 0; i < this.tsosMemory.length; i++) {
                this.tsosMemory[i] = "00";
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map