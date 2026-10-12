class Patient {
    constructor(
        id,
        name,
        priority,
        priorityName,
        procedure,
        duration,
        deadline
    ) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.priorityName = priorityName;
        this.procedure = procedure;
        this.duration = duration;
        this.deadline = deadline;

        // Scheduling information
        this.room = null;
        this.doctor = null;
        this.status = "Waiting";
    }
}

module.exports = Patient;