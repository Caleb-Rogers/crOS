module TSOS {

    export class MemoryAccessor {

        constructor() {}

        public fetchMemory(index) {
            return _Memory.tsosMemory[index];
        }
    }
}
