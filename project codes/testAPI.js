const http = require("http");

const patient = JSON.stringify({
    name: "Test Patient",
    priority: 1,
    priorityName: "Emergency",
    procedure: "Emergency Surgery",
    duration: 60,
    deadline: "14:00"
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/patients",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(patient)
    }
};

const request = http.request(options, response => {
    let data = "";

    response.on("data", chunk => {
        data += chunk;
    });

    response.on("end", () => {
    console.log("Status:", response.statusCode);
    console.log("Response:");

    try {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (error) {
        console.log(data);
    }
});
});

request.on("error", error => {
    console.error("Request failed:", error.message);
});

request.write(patient);
request.end();