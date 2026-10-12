const Appointment = require("./Appointment");
const PriorityQueue = require("./PriorityQueue");

class Scheduler {
    constructor(rooms, doctors) {
        this.rooms = rooms;
        this.doctors = doctors;
        this.appointments = [];
        this.appointmentId = 1;
    }

    // Find an available room
    findAvailableRoom() {
        return this.rooms.find(room => room.status === "Available");
    }

    // Convert HH:MM to minutes
    timeToMinutes(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    // Convert minutes to HH:MM
    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }

    // Find next available time for a doctor
    findDoctorTime(doctor, duration) {
        let nextTime = this.timeToMinutes(doctor.startTime);

        if (doctor.schedule.length > 0) {
            const lastAppointment =
                doctor.schedule[doctor.schedule.length - 1];

            const lastStart =
                this.timeToMinutes(lastAppointment.startTime);

            nextTime = lastStart + lastAppointment.duration;
        }

        const endTime = this.timeToMinutes(doctor.endTime);

        // Check whether appointment fits in doctor's working hours
        if (nextTime + duration > endTime) {
            return null;
        }

        return this.minutesToTime(nextTime);
    }

    // Find doctor who can take the patient earliest
    findAvailableDoctor(duration) {
        let bestDoctor = null;
        let bestTime = Infinity;

        for (const doctor of this.doctors) {
            const availableTime = this.findDoctorTime(doctor, duration);

            if (availableTime === null) {
                continue;
            }

            const time = this.timeToMinutes(availableTime);

            if (time < bestTime) {
                bestTime = time;
                bestDoctor = doctor;
            }
        }

        return bestDoctor;
    }

    // Schedule one patient
    schedulePatient(patient) {
        const room = this.findAvailableRoom();

        if (!room) {
            return {
                success: false,
                message: "No room is currently available.",
                patient
            };
        }

        const doctor = this.findAvailableDoctor(patient.duration);

        if (!doctor) {
            return {
                success: false,
                message: `No doctor is available for ${patient.duration} minutes.`,
                patient
            };
        }

        const startTime =
            this.findDoctorTime(doctor, patient.duration);

        if (!startTime) {
            return {
                success: false,
                message: "No suitable time slot is available.",
                patient
            };
        }

        const appointment = new Appointment(
            this.appointmentId++,
            patient,
            doctor,
            room,
            startTime,
            patient.duration
        );

        // Assign room
        room.assignPatient(patient);

        // Assign doctor
        doctor.schedule.push(appointment);

        // Store appointment
        this.appointments.push(appointment);

        // Update patient
        patient.room = room;
        patient.doctor = doctor;
        patient.status = "Scheduled";

        return {
            success: true,
            appointment
        };
    }

    // Schedule all patients according to priority
    scheduleAllPatients(patients) {
        const priorityQueue = new PriorityQueue();

        // Insert patients into priority queue
        patients.forEach(patient => {
            priorityQueue.enqueue(patient);
        });

        const results = [];

        // Process highest-priority patient first
        while (!priorityQueue.isEmpty()) {
            const patient = priorityQueue.dequeue();

            const result = this.schedulePatient(patient);

            results.push(result);
        }

        return results;
    }
}

module.exports = Scheduler;