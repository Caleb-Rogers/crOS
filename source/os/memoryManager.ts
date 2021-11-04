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
            // Validate size of User Program Input
            if (hex_memory.length > 256) {
                _StdOut.putText("[MEMORY ALLOCATION EXCEEDED] - User Program Input was too large. Make sure only hex values are used and are less than 256 values.")
            }
            else {
                // Update how much memory is being used
                _Memory.mem_used = hex_memory.length;
                // Insert hex values into memory depending on section
                for (var i=0; i<hex_memory.length; i++) {
                    _Memory.tsosMemory[i + _Memory.fetchSectionBase(pcb_pid)] = hex_memory[i];
                }
                // Console logging
                console.log("[loadMemory] - " + _Memory.mem_used + " bytes of memory loaded");
                console.log("[loadMemory] - User Program Input: " + hex_memory);

                return hex_memory;
            }
        }
    }
}