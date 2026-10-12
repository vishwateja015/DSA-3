const Patient = require("./patient");

const patients = [
    new Patient(
        1,
        "Rahul Kumar",
        1,
        "Emergency",
        "Appendix Surgery",
        120,
        "14:00"
    ),

    new Patient(
        2,
        "Ananya Sharma",
        2,
        "High",
        "Gallbladder Surgery",
        90,
        "16:00"
    ),

    new Patient(
        3,
        "Vikram Reddy",
        3,
        "Normal",
        "Knee Surgery",
        180,
        "18:00"
    ),

    new Patient(
        4,
        "Priya Singh",
        4,
        "Low",
        "Hernia Surgery",
        90,
        "19:00"
    )
];

module.exports = patients;