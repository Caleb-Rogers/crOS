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
        fetchSectionBase(section) {
            switch (String(section)) {
                case "0": return 0;
                case "1": return 256;
                case "2": return 512;
                default:
                    console.log("Section [" + section + "] is not valid");
            }
        }
        fetchSectionLimit(section) {
            switch (String(section)) {
                case "0": return 255;
                case "1": return 511;
                case "2": return 767;
                default:
                    console.log("Section [" + section + "] is not valid");
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map