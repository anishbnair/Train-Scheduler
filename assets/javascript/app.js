
// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-B837OrtBIX6Tvi6SRsq6AijWycqqkQY",
    authDomain: "train-scheduler-faebe.firebaseapp.com",
    databaseURL: "https://train-scheduler-faebe.firebaseio.com",
    projectId: "train-scheduler-faebe",
    storageBucket: "",
    messagingSenderId: "620162093218"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial variables
var trainName;
var trainDestination;
var trainTime;
var trainFrequency;

// Function to clear form contents
function clearForm(event) {
    // event.preventDefault();
    $("#trainName").val('');
    $("#trainDestination").val('');
    $("#trainTime").val('');
    $("#trainFrequency").val('');
}

// click event when user add a new train
$(".submitButton").on("click", function (event) {

    event.preventDefault();

    trainName = $("#trainName").val().trim();
    console.log(trainName);
    trainDestination = $("#trainDestination").val().trim();
    console.log(trainDestination);
    trainTime = $("#trainTime").val();
    console.log(trainTime);
    trainFrequency = $("#trainFrequency").val().trim();
    console.log(trainFrequency);

    // Push data to database only if input fileds are not empty/blank
    if (trainName != '' && trainDestination != '' && trainTime != '' && trainFrequency != '') {
        // Call clearForm function clear input fields in the html form
        clearForm();

        var trainData = {
            trainName: trainName,
            trainDestination: trainDestination,
            trainTime: trainTime,
            trainFrequency: trainFrequency,
        }

        // Uploads data to firebase database
        database.ref().push(trainData);

    } else {
        return;
    }
})

// This event will be triggered once for each initial child at this location, and it will be triggered again every time a new child is added
database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var trainDatabaseValue = snapshot.val();
    console.log("Train database value is " + trainDatabaseValue);

    var trainName = trainDatabaseValue.trainName;
    var trainDestination = trainDatabaseValue.trainDestination;
    var trainTime = trainDatabaseValue.trainTime;
    var trainFrequency = trainDatabaseValue.trainFrequency;

    var trainKey = snapshot.key;
    console.log("Train key is" + trainKey);

    console.log("train time is " + trainTime);

    // First Time
    var firstTimeConverted = moment(trainTime, "HH:mm");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    // $(".table>tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>" + "</td></tr>");
    $(".table>tbody").append(`
    <tr>
        <td>${trainName}</td>
        <td>${trainDestination}</td>
        <td>${trainFrequency}</td>
        <td>${nextTrain}</td>
        <td>${tMinutesTillTrain}</td>
        <td>${"<button class='deleteTrainBtn btn' data-train=" + trainKey + ">Delete</button>"}</td>
    </tr>
    `);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function deleteTrain() {
    // Store data attribute (i.e. key) to a variable
    var keyToDelete = $(this).attr("data-train");
    console.log("ket to delete is" + keyToDelete);
    database.ref(keyToDelete).remove();
    $(this).closest('tr').remove();
}

// Calls clearForm function when user click on Clear button to remove/delete form input data in the html page
$(document).on("click", ".clearButton", clearForm);
// Calls deleteTrain function when user click on Delete button to delete train
$(document).on("click", ".deleteTrainBtn", deleteTrain);

