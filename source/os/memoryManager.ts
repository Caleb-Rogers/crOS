module TSOS {

    export class MemoryManager {

        constructor() {}

        // Populate Memory with User Program Input
        public loadMemory(user_prog_input, pcb_pid) {
            // Split user input into array of characters
            var chars_input = user_prog_input.split('');
            // Manipulate characters into an array of Hex string doubles
            var hex_memory = [];
            for (var i=0; i<user_prog_input.length-1; i+=2) {
                var hex_array = [];
                var hex_value = '';
                hex_array.push(chars_input[i]);
                hex_array.push(chars_input[i+1]);
                hex_value = hex_array.join('');
                hex_memory.push(hex_value);
            }
            if (hex_memory.length > 256) {
                _StdOut.putText("[MEMORY ALLOCATION EXCEEDED] - User Program Input was too large. Make sure only hex values are used and are less than 256 values.")
            }
            else {
                // Update how much memory is being used
                _Memory.mem_used = hex_memory.length;
                // Insert hex values into memory depending on section
                if (pcb_pid == 0) {
                    var mem_index = 0;
                    for (var i=0; i<hex_memory.length; i++) {
                        _Memory.tsosMemory[mem_index] = hex_memory[i];
                        mem_index++;
                    }
                }
                else if (pcb_pid == 1) {
                    var mem_index = 256;
                    for (var i=0; i<hex_memory.length; i++) {
                        _Memory.tsosMemory[mem_index] = hex_memory[i];
                        mem_index++;
                    }
                }
                else if (pcb_pid == 2) {
                    var mem_index = 512;
                    for (var i=0; i<hex_memory.length; i++) {
                        _Memory.tsosMemory[mem_index] = hex_memory[i];
                        mem_index++;
                    }
                }

                console.log("User Program Input, Hex formatted: " + hex_memory);
                console.log((_Memory.mem_used) + " bytes of memory are now being used")

                return hex_memory;
            }
        }

        /*
        public clearMemorySection(pcb_pid): void {
            // Update how much memory is being used
            _Memory.mem_used = 0;
            // Insert hex values into memory depending on section
            if (pcb_pid == 0) {
                var mem_index = 0;
                for (var i=0; i<256; i++) {
                    _Memory.tsosMemory[mem_index] = "00";
                    mem_index++;
                }
            }
            else if (pcb_pid == 1) {
                var mem_index = 256;
                for (var i=0; i<256; i++) {
                    _Memory.tsosMemory[mem_index] = "00";
                    mem_index++;
                }
            }
            else if (pcb_pid == 2) {
                var mem_index = 512;
                for (var i=0; i<256; i++) {
                    _Memory.tsosMemory[mem_index] = "00";
                    mem_index++;
                }
            }
            console.log((_Memory.mem_used) + " bytes of memory are now being used")
        }
        */
    }
}