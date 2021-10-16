module TSOS {

    export class MemoryManager {

        constructor() {}

        // Populate Memory with User Program Input
        public loadMemory(user_prog_input) {
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
            // Insert hex values into memory
            for (var i=0; i<hex_memory.length; i++) {
                _Memory.tsosMemory[i] = hex_memory[i];
            }

            console.log("hex input : " + hex_memory);
            console.log("Memory: " + _Memory.tsosMemory);

            return hex_memory;

        }

        public clsMemory() {
            // to reset memory, just re-initialize to all "00"
            _Memory.init();
        }
    }
}