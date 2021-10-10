var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.tsosMemory = new Array(256);
        }
        init() {
            for (var i = 0; i < this.tsosMemory.length; i++) {
                this.tsosMemory[i] = "00";
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map