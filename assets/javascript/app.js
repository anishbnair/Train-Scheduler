
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCblT2nfpwzw2HumOPzdQOh3tLuOvozyiE",
    authDomain: "bootcamp-learning.firebaseapp.com",
    databaseURL: "https://bootcamp-learning.firebaseio.com",
    projectId: "bootcamp-learning",
    storageBucket: "bootcamp-learning.appspot.com",
    messagingSenderId: "1031333562864"
};

firebase.initializeApp(config);

$(".trainSchedule").hide();
$(".addTrain").hide();

// Google Authentication
var provider = new firebase.auth.GoogleAuthProvider();

$(document).on("click", ".signIn", function () {
    console.log("Sign In button clicked");
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log(token);
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        $(".trainSchedule").show();
        $(".addTrain").show();

        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
    $(this).removeClass('signIn')
        .addClass('signOut')
        .html('Sign Out Of Google');
});

$(document).on('click', '.signOut', function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        $(".trainSchedule").hide();
        $(".addTrain").hide();
    }).catch(function (error) {
        // An error happened.
    });
    $(this).removeClass('signOut')
        .addClass('signIn')
        .html('Sign In with Google');
});

// Create a variable to reference the database
var database = firebase.database();

// Initial variables
var trainName;
var trainDestination;
var trainTime;
var trainFrequency;
var keyToUpdate = '';

// Function to clear form contents
function clearForm(event) {
    event.preventDefault();
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
    trainTime = $("#trainTime").val().trim();
    console.log(trainTime);
    trainFrequency = $("#trainFrequency").val().trim();
    console.log(trainFrequency);

    // Push data to database only if input fileds are not empty/blank
    if (trainName != '' && trainDestination != '' && trainTime != '' && trainFrequency != '') {

        var trainData = {
            trainName: trainName,
            trainDestination: trainDestination,
            trainTime: trainTime,
            trainFrequency: trainFrequency,
        }

        // Uploads data to firebase database

        if (keyToUpdate == '') {
            database.ref().push(trainData);

        } else {
            database.ref(keyToUpdate).update(trainData);
        }
        keyToUpdate == '';

    } else {
        return;
    }

    // clearForm();
    $("#trainName").val('');
    $("#trainDestination").val('');
    $("#trainTime").val('');
    $("#trainFrequency").val('');
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

    // First Time
    var firstTimeConverted = moment(trainTime, "HH:mm");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");

    // $(".table>tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>" + "</td></tr>");
    $(".table>tbody").append(`
    <tr>
        <td>${trainName}</td>
        <td>${trainDestination}</td>
        <td>${trainFrequency}</td>
        <td>${nextTrain}</td>
        <td>${tMinutesTillTrain}</td>
        <td>${"<button class='updateTrainBtn btn-primary' data-train=" + trainKey + ">Update</button>"}</td>
        <td>${"<button class='deleteTrainBtn btn-danger' data-train=" + trainKey + ">Delete</button>"}</td>
    </tr>
    `);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function deleteTrain() {
    // Store data attribute (i.e. key) to a variable
    var keyToDelete = $(this).attr("data-train");
    // console.log("ket to delete is" + keyToDelete);
    database.ref(keyToDelete).remove();
    $(this).closest('tr').remove();
}

function updateTrain() {
    // Store data attribute (i.e. key) to a variable
    keyToUpdate = $(this).attr("data-train");
    console.log("key to update is" + keyToUpdate);

    database.ref(keyToUpdate).once('value').then(function (childSnapshot) {
        $("#trainName").val(childSnapshot.val().trainName);
        $("#trainDestination").val(childSnapshot.val().trainDestination);
        $("#trainTime").val(childSnapshot.val().trainTime);
        $("#trainFrequency").val(childSnapshot.val().trainFrequency);
    })
}

// Calls clearForm function when user click on Clear button to remove/delete form input data in the html page
$(document).on("click", ".clearButton", clearForm);
// Calls deleteTrain function when user click on Delete button to delete train
$(document).on("click", ".deleteTrainBtn", deleteTrain);
// Calls updateTrain function when user click on Update button to update train info
$(document).on("click", ".updateTrainBtn", updateTrain);

