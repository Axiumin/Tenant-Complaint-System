let functions = firebase.functions();
var db = firebase.firestore();

let _user;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.

        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_div").style.display = "none";

        let user = firebase.auth().currentUser;

        if(user != null){
            let email_address = user.email;
            document.getElementById("user_para").innerHTML = "Welcome to the Tenant Complaint System! You're current signed in as " + email_address;

            _user = user;
        }

    } else {
        // No user is signed in.

        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";

        email_address = "";

    }
});

function login(){

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error : " + errorMessage);

        // ...
    });

}

var input = document.getElementById("password_field");

input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("login").click();
    }
});

function logout(){
    firebase.auth().signOut();
}

function file_complaint(){
    // TODO: Upload the data to a database and to a trello board
    if (_user == null) {
        document.getElementById("formCompleted").style.display = "block";
        document.getElementById("formCompleted").innerText = "You're not logged in!";
    }

    let name = document.getElementById("name").value;
    let unit = document.getElementById("unit").value;
    let problem = document.getElementById("issueText").value;
    let locationOfProblem = document.getElementById("locationOfProblem").value;
    let extraComments = document.getElementById("extraComments").value;
      
    db.collection("complaints").add({
        full_name: name,
        email_address: _user.email,
        complaint: problem,
        extra_comments: extraComments,
        location_of_problem: locationOfProblem,
        unit_address_and_number: unit
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("formCompleted").style.display = "block";
        document.getElementById("formCompleted").innerText = "Your complaint has been submitted!";
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        document.getElementById("formCompleted").style.display = "block";
        document.getElementById("formCompleted").innerText = "An error occured. Please try again later.";
    });
}