module TSOS {

    export class MemoryManager {

        constructor() {}

        // Populate Memory with User Program Input
        public loadMemory(user_prog_input) {
            // Split user input into array of characters
            var chars_input = user_prog_input.split('');
            // Manipulate characters into an array of Hex string doubles
            var hex_memory = new Array();
            var i=0;
            for (var j=0; j<user_prog_input.length-1; j++) {
                var hex_array = [];
                var hex_value = '';
                hex_array.push(chars_input[j]);
                hex_array.push(chars_input[j+1]);
                hex_value = hex_array.join('');
                hex_memory.push(hex_value);
            }
            // Insert hex values into memory
            for (var i=0; i<chars_input.length; i++) {
                _Memory.tsosMemory[i] = hex_memory[i];
            }

            console.log("hex input : " + chars_input);
            console.log("Memory: " + _Memory.tsosMemory);

        }

        public clsMemory() {
            // to reset memory, just re-initialize to all "00"
            _Memory.init();
        }
    }
}