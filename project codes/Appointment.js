class Appointment {
    constructor(id, patient, doctor, room, startTime, duration) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.room = room;
        this.startTime = startTime;
        this.duration = duration;
        this.status = "Scheduled";
    }
}

module.exports = Appointment;