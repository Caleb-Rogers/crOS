var TSOS;
(function (TSOS) {
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            this.status = "loaded";
        }
        /* ======== Shell Command Functions ======== */
        createFile(filename) {
            var tsbName = this.fetchName();
            var tsbData = this.fetchData();
            var tsbNameSession = sessionStorage.getItem(tsbName).split(",");
            var tsbDataSession = sessionStorage.getItem(tsbData).split(",");
            // Set to 1 to represent Used
            tsbNameSession[0] = "1";
            tsbDataSession[0] = "1";
            // update name to next TSB
            tsbNameSession[1] = tsbData[0];
            tsbNameSession[2] = tsbData[2];
            tsbNameSession[3] = tsbData[4];
            for (var i = 0; i < filename.length; i++) {
                tsbNameSession[i + 4] = filename.charCodeAt(i).toString(16);
            }
            sessionStorage.setItem(tsbName, tsbNameSession.join());
            sessionStorage.setItem(tsbData, tsbDataSession.join());
            TSOS.Control.updateGUI_Disk_();
            return true;
        }
        readFile() {
        }
        writeFile() {
        }
        deleteFile() {
        }
        formatDisk() {
            var diskData = new Array(64);
            for (var i = 0; i < diskData.length; i++) {
                if (i < 4) {
                    diskData[i] = "0";
                }
                else {
                    diskData[i] = "00";
                }
            }
            for (var i = 0; i < _Virtual_Disk.tracks; i++) {
                for (var j = 0; j < _Virtual_Disk.sectors; j++) {
                    for (var k = 0; k < _Virtual_Disk.blocks; k++) {
                        sessionStorage.setItem(i + ":" + j + ":" + k, diskData.join());
                    }
                }
            }
            TSOS.Control.updateGUI_Disk_();
        }
        /* ======== helper methods ======== */
        fetchName() {
            var tsbNameSession;
            for (var j = 0; j < _Virtual_Disk.sectors; j++) {
                for (var k = 1; k < _Virtual_Disk.blocks; k++) {
                    tsbNameSession = sessionStorage.getItem("0:" + j + ":" + k).split(",");
                    if (tsbNameSession[0] == "0") {
                        return "0:" + j + ":" + k;
                    }
                }
            }
        }
        fetchData() {
            var tsbNameSession;
            for (var i = 1; i < _Virtual_Disk.tracks; i++) {
                for (var j = 0; j < _Virtual_Disk.sectors; j++) {
                    for (var k = 0; k < _Virtual_Disk.sectors; k++) {
                        tsbNameSession = sessionStorage.getItem(i + ":" + j + ":" + k).split(",");
                        if (tsbNameSession[0] == "0") {
                            return i + ":" + j + ":" + k;
                        }
                    }
                }
            }
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map