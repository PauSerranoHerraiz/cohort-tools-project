const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model.js");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const PORT = 5005;
const studentsArr = require("./students.json");
const Student = require("./models/Student.model.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools")
  .then(x => console.log(`Connected to DB: ${x.connections[0].name}`))
  .catch(err => console.error(err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/auth", require("./routes/auth.routes"))

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
    .then(cohorts => res.json(cohorts))
    .catch(next);
});

app.get("/api/students", (req, res) => {
  Student.find()
    .then(students => res.json(students))
});


////////////////////////////////////////////////
app.post("/api/cohorts", isAuthenticated, function (req, res, next) {

    const newCohort = req.body

    Cohort.create(newCohort)
        .then((cohortFromDB) => {
            res.status(201).json(cohortFromDB)
        })
        .catch((err) => {
            console.log("Error creating a new cohort in the DB...")
            console.log(err);
            res.status(500).json({ error: "Error creating a new cohort in the DB..." })
        })
})


app.get("/api/cohorts", function (req, res, next) {

    Cohort.find(filter)
        .then((cohortFromDB) => {
            res.json(cohortFromDB)
        })
        .catch((err) => {
            console.log("Error getting cohorts from DB...")
            console.log(err)
            res.status(500).json({ error: "Failed to get list of cohorts" })
        })
})

app.get("/api/cohorts/:cohortId", (req, res, next) => {

    const { cohortId } = req.params

    Cohort.findById(cohortId)
        .then((cohortFromDB) => {
            res.json(cohortFromDB)
        })
        .catch(error => {
            console.log("Error getting cohort details from DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to get cohort details" });
        })
})

app.put("/api/cohorts/:cohortId", isAuthenticated, function (req, res, next) {

    const { cohortId } = req.params

    const newDetails = req.body


    Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
        .then((cohortFromDB) => {
            res.json(cohortFromDB)
        })
        .catch((err) => {
            console.error("Error updating cohort...");
            console.error(err);
            res.status(500).json({ error: "Failed to update a cohort" });
        })

})

app.delete("/api/cohorts/:cohortId", isAuthenticated, (req, res, next) => {

    const { cohortId } = req.params

    Cohort.findByIdAndDelete(cohortId)
        .then((response) => {
            res.json(response)
        })
        .catch((error) => {
            console.error("Error deleting cohort...");
            console.error(error);
            res.status(500).json({ error: "Failed to delete a cohort" });
        })
})


app.post("/api/students", isAuthenticated, function (req, res, next) {

    const newStudent = req.body

    Student.create(newStudent)
        .then((studentFromDB) => {
            res.status(201).json(studentFromDB)
        })
        .catch((err) => {
            console.log("Error creating a new student in the DB...")
            console.log(err);
            res.status(500).json({ error: "Error creating a new student in the DB..." })
        })
})


app.get("/api/students", function (req, res, next) {

    Student.find(filter)
        .then((studentFromDB) => {
            res.json(studentFromDB)
        })
        .catch((err) => {
            console.log("Error getting students from DB...")
            console.log(err)
            res.status(500).json({ error: "Failed to get list of students" })
        })
})

app.get("/api/students/:studentId", (req, res, next) => {

    const { studentId } = req.params

    Student.findById(studentId)
        .then((cstudentFromDB) => {
            res.json(studentFromDB)
        })
        .catch(error => {
            console.log("Error getting student details from DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to get student details" });
        })
})

app.put("/api/students/:studentId", isAuthenticated, function (req, res, next) {

    const { studentId } = req.params

    const newDetails = req.body


    Student.findByIdAndUpdate(studentId, newDetails, { new: true })
        .then((studentFromDB) => {
            res.json(studentFromDB)
        })
        .catch((err) => {
            console.error("Error updating student...");
            console.error(err);
            res.status(500).json({ error: "Failed to update a student" });
        })

})

app.delete("/api/students/:studentId", isAuthenticated, (req, res, next) => {

    const { studentId } = req.params

    Student.findByIdAndDelete(studentId)
        .then((response) => {
            res.json(response)
        })
        .catch((error) => {
            console.error("Error deleting a student...");
            console.error(error);
            res.status(500).json({ error: "Failed to delete a student" });
        })
})

const { errorHandler, notFoundHandler } = require('./middleware/error-handling');

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
