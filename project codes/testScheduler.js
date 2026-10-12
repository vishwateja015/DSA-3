const Scheduler = require("./Scheduler");
const patients = require("./patientData");
const { rooms, doctors } = require("./hospitalData");

// Create scheduler
const scheduler = new Scheduler(rooms, doctors);

// Schedule all patients
const results = scheduler.scheduleAllPatients(patients);

// Display results
console.log("\n===== HOSPITAL SCHEDULING RESULTS =====\n");

results.forEach((result, index) => {
    if (result.success) {
        const appointment = result.appointment;

        console.log(`Patient ${index + 1}:`);
        console.log(`Name       : ${appointment.patient.name}`);
        console.log(`Priority   : ${appointment.patient.priorityName}`);
        console.log(`Procedure  : ${appointment.patient.procedure}`);
        console.log(`Doctor     : ${appointment.doctor.name}`);
        console.log(`Room       : ${appointment.room.roomNumber}`);
        console.log(`Start Time : ${appointment.startTime}`);
        console.log(`Duration   : ${appointment.duration} minutes`);
        console.log(`Status     : ${appointment.status}`);
        console.log("--------------------------------------");
    } else {
        console.log(`Scheduling failed: ${result.message}`);
        console.log("--------------------------------------");
    }
});

console.log("\n===== FINAL ROOM STATUS =====\n");

rooms.forEach(room => {
    console.log(
        `${room.roomNumber} → ${room.status}` +
        (room.patient ? ` → ${room.patient.name}` : "")
    );
});

console.log("\n===== DOCTOR SCHEDULE =====\n");

doctors.forEach(doctor => {
    console.log(`Doctor: ${doctor.name}`);

    if (doctor.schedule.length === 0) {
        console.log("  No appointments");
    } else {
        doctor.schedule.forEach(appointment => {
            console.log(
                `  ${appointment.startTime} - ` +
                `${appointment.patient.name} - ` +
                `${appointment.patient.procedure}`
            );
        });
    }

    console.log("--------------------------------------");
});