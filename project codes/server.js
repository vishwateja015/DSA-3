const express = require("express");
const cors = require("cors");

const Scheduler = require("./dsa/Scheduler");
const Patient = require("./dsa/Patient");
const patients = require("./dsa/patientData");
const { rooms, doctors } = require("./dsa/hospitalData");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const scheduler = new Scheduler(rooms, doctors);

function formatPatient(patient) {
    return {
        id: patient.id,
        name: patient.name,
        priority: patient.priority,
        priorityName: patient.priorityName,
        procedure: patient.procedure,
        duration: patient.duration,
        deadline: patient.deadline,
        status: patient.status,

        room: patient.room
            ? {
                id: patient.room.id,
                roomNumber: patient.room.roomNumber,
                type: patient.room.type,
                status: patient.room.status
            }
            : null,

        doctor: patient.doctor
            ? {
                id: patient.doctor.id,
                name: patient.doctor.name,
                specialization: patient.doctor.specialization
            }
            : null
    };
}

function formatAppointment(appointment) {
    return {
        id: appointment.id,
        startTime: appointment.startTime,
        duration: appointment.duration,
        status: appointment.status,

        patient: appointment.patient
            ? {
                id: appointment.patient.id,
                name: appointment.patient.name,
                priority: appointment.patient.priority,
                priorityName: appointment.patient.priorityName,
                procedure: appointment.patient.procedure
            }
            : null,

        doctor: appointment.doctor
            ? {
                id: appointment.doctor.id,
                name: appointment.doctor.name,
                specialization: appointment.doctor.specialization
            }
            : null,

        room: appointment.room
            ? {
                id: appointment.room.id,
                roomNumber: appointment.room.roomNumber,
                type: appointment.room.type
            }
            : null
    };
}

app.get("/", (req, res) => {
    res.json({
        message: "Hospital Scheduling API is running"
    });
});

app.get("/patients", (req, res) => {
    const patientList = patients.map(patient =>
        formatPatient(patient)
    );

    res.json(patientList);
});

app.post("/patients", (req, res) => {
    const {
        name,
        priority,
        priorityName,
        procedure,
        duration,
        deadline
    } = req.body;

    if (
        !name ||
        priority === undefined ||
        !procedure ||
        !duration ||
        !deadline
    ) {
        return res.status(400).json({
            message:
                "Please provide name, priority, procedure, duration and deadline."
        });
    }

    const priorityNumber = Number(priority);
    const durationNumber = Number(duration);

    if (![1, 2, 3, 4].includes(priorityNumber)) {
        return res.status(400).json({
            message: "Priority must be 1, 2, 3 or 4."
        });
    }

    if (durationNumber <= 0) {
        return res.status(400).json({
            message: "Duration must be greater than 0."
        });
    }

    const priorityLabels = {
        1: "Emergency",
        2: "High",
        3: "Normal",
        4: "Low"
    };

    const newPatient = new Patient(
        patients.length + 1,
        name,
        priorityNumber,
        priorityName || priorityLabels[priorityNumber],
        procedure,
        durationNumber,
        deadline
    );

    patients.push(newPatient);

    const result = scheduler.schedulePatient(newPatient);

    if (!result.success) {
        return res.status(409).json({
            message: result.message,
            patient: formatPatient(newPatient)
        });
    }

    res.status(201).json({
        message: "Patient added and scheduled successfully",
        patient: formatPatient(newPatient),
        appointment: formatAppointment(result.appointment)
    });
});

app.get("/rooms", (req, res) => {
    const roomList = rooms.map(room => ({
        id: room.id,
        roomNumber: room.roomNumber,
        type: room.type,
        status: room.status,
        patient: room.patient
            ? {
                id: room.patient.id,
                name: room.patient.name,
                procedure: room.patient.procedure
            }
            : null
    }));

    res.json(roomList);
});

app.put("/rooms/:id/release", (req, res) => {
    const roomId = Number(req.params.id);

    const room = rooms.find(
        r => r.id === roomId
    );

    if (!room) {
        return res.status(404).json({
            message: "Room not found"
        });
    }

    if (room.status === "Available") {
        return res.status(400).json({
            message: "Room is already available"
        });
    }

    const dischargedPatient = room.patient;

    if (dischargedPatient) {
        dischargedPatient.status = "Discharged";
        dischargedPatient.room = null;
    }

    const appointment = scheduler.appointments.find(
    a =>
        a.patient &&
        dischargedPatient &&
        a.patient.id === dischargedPatient.id
);

if (appointment) {
    appointment.status = "Completed";

    const doctor = doctors.find(
        d => d.id === appointment.doctor.id
    );

    if (doctor) {
        doctor.schedule = doctor.schedule.filter(
            a => a.id !== appointment.id
        );
    }

    scheduler.appointments = scheduler.appointments.filter(
        a => a.id !== appointment.id
    );
}

    room.releaseRoom();

    res.json({
        message: "Patient discharged successfully",

        patient: dischargedPatient
            ? formatPatient(dischargedPatient)
            : null,

        room: {
            id: room.id,
            roomNumber: room.roomNumber,
            type: room.type,
            status: room.status,
            patient: null
        }
    });
});

app.get("/doctors", (req, res) => {
    const doctorList = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        startTime: doctor.startTime,
        endTime: doctor.endTime,
        appointmentCount: doctor.schedule.length
    }));

    res.json(doctorList);
});

app.get("/doctors/:id/schedule", (req, res) => {
    const doctorId = Number(req.params.id);

    const doctor = doctors.find(
        d => d.id === doctorId
    );

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found"
        });
    }

    res.json({
        doctor: {
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
            startTime: doctor.startTime,
            endTime: doctor.endTime
        },

        schedule: doctor.schedule.map(
            appointment => formatAppointment(appointment)
        )
    });
});

app.get("/schedule", (req, res) => {
    const schedule = scheduler.appointments.map(
        appointment => formatAppointment(appointment)
    );

    res.json(schedule);
});

app.post("/schedule", (req, res) => {
    const { patientId } = req.body;

    const patient = patients.find(
        p => p.id === Number(patientId)
    );

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    if (patient.status === "Scheduled") {
        return res.status(400).json({
            message: "Patient is already scheduled."
        });
    }

    const result = scheduler.schedulePatient(patient);

    if (!result.success) {
        return res.status(409).json({
            message: result.message
        });
    }

    res.status(201).json({
        message: "Patient scheduled successfully",
        appointment: formatAppointment(result.appointment)
    });
});

app.put("/appointments/:id/status", (req, res) => {
    const appointmentId =
        Number(req.params.id);

    const { status } = req.body;

    const appointment =
        scheduler.appointments.find(
            a => a.id === appointmentId
        );

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    if (!status) {
        return res.status(400).json({
            message: "Status is required."
        });
    }

    appointment.status = status;

    res.json({
        message: "Appointment status updated successfully",
        appointment: formatAppointment(appointment)
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});