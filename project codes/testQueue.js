const PriorityQueue = require("./PriorityQueue");
const patients = require("./patients");

const pq = new PriorityQueue();

patients.forEach(patient => {
    pq.enqueue(patient);
});

console.log("Patients according to priority:");
console.log(pq.display());

console.log("\nNext patient:");
console.log(pq.peek());

console.log("\nScheduling patients:");

while (!pq.isEmpty()) {
    const patient = pq.dequeue();

    console.log(
        `${patient.name} - ${patient.priorityName} - ${patient.procedure}`
    );
}