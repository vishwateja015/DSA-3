class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(patient) {
        this.queue.push(patient);

        // Sort based on priority
        // 1 = Emergency
        // 2 = High
        // 3 = Normal
        // 4 = Low
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue[0];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }

    display() {
        return this.queue;
    }
}

module.exports = PriorityQueue;