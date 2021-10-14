module TSOS {

    export class MemoryManager {

        constructor() {}

        // Populate Memory with User Program Input
        public loadMemory(user_prog_input) {

            // TODO: split into string groupings of two

            // Split user input into array of characters
            var chars_input = user_prog_input.split('');
            // Insert hex values into memory
            for (var i=0; i<chars_input.length; i++) {
                _Memory.tsosMemory[i] = chars_input[i];
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