class Room {
    constructor(id, roomNumber, type) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.type = type;
        this.status = "Available";
        this.patient = null;
    }

    assignPatient(patient) {
        this.status = "Occupied";
        this.patient = patient;
    }

    releaseRoom() {
        this.status = "Available";
        this.patient = null;
    }

    getDetails() {
        return {
            id: this.id,
            roomNumber: this.roomNumber,
            type: this.type,
            status: this.status,
            patient: this.patient
        };
    }
}

module.exports = Room;