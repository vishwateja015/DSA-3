class Doctor {
    constructor(id, name, specialization, startTime, endTime) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.startTime = startTime;
        this.endTime = endTime;
        this.schedule = [];
    }
}

module.exports = Doctor;