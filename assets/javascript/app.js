
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

    var trainData = {
        trainName: trainName,
        trainDestination: trainDestination,
        trainTime: trainTime,
        trainFrequency: trainFrequency,
    }

    // Uploads data to firebase database
    database.ref().push(trainData);
})

// This event will be triggered once for each initial child at this location, and it will be triggered again every time a new child is added
database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var trainDatabaseValue = snapshot.val();

    // Console.loging the last user's data
    console.log(trainDatabaseValue.trainName);
    console.log(trainDatabaseValue.trainDestination);
    console.log(trainDatabaseValue.trainTime);
    console.log(trainDatabaseValue.trainFrequency);

    var trainName = trainDatabaseValue.trainName;
    var trainDestination = trainDatabaseValue.trainDestination;
    var trainTime = trainDatabaseValue.trainTime;
    var trainFrequency = trainDatabaseValue.trainFrequency;

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

    $(".table>tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

