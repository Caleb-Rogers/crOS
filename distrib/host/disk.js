var TSOS;
(function (TSOS) {
    class Disk {
        constructor() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 64;
        }
    }
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=disk.js.map