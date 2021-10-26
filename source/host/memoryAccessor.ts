module TSOS {

    export class MemoryAccessor {

        constructor() {}

        public fetchMemory(index) {
            return _Memory.tsosMemory[index];
        }

        public fetchAllMemory() {
            return _Memory.tsosMemory;
        }

    }
}
