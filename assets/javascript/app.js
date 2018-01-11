
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


database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var trainDatabaseValue = snapshot.val();

    // Console.loging the last user's data
    console.log(trainDatabaseValue.trainName);
    console.log(trainDatabaseValue.trainDestination);
    console.log(trainDatabaseValue.trainTime);
    console.log(trainDatabaseValue.trainFrequency);


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

