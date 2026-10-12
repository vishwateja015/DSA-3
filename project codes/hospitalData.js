const Room = require("./Room");
const Doctor = require("./Doctor");

// Hospital rooms
const rooms = [
    new Room(1, "R-101", "General"),
    new Room(2, "R-102", "General"),
    new Room(3, "R-103", "Private"),
    new Room(4, "R-104", "ICU"),
    new Room(5, "R-105", "General"),
    new Room(6, "R-106", "Private")
];

// Hospital doctors
const doctors = [
    new Doctor(
        1,
        "Dr. Arun",
        "General Medicine",
        "09:00",
        "17:00"
    ),

    new Doctor(
        2,
        "Dr. Priya",
        "Cardiology",
        "09:00",
        "17:00"
    ),

    new Doctor(
        3,
        "Dr. Rahul",
        "General Medicine",
        "10:00",
        "18:00"
    )
];

module.exports = {
    rooms,
    doctors
};