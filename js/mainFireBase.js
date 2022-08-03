var mainApp = {};

// Names of firebase paths
const DETAILS = "userDetails";
const ROLES = "userRoles"
const PUBLIC = "public";
const PRIVATE = "private";
const SCORES = "userScores";

// Objects to store user information in
// Created with format matching the firebase
var userDetailsPrivate = {
  name: "—",
  age: "—",
  email: "—",
};

var userDetailsPublic = {
  photoURL: "—",
  displayName: "—",
};

var userDetails = {
  uid: "—"
};

var gameScores = {
  snakeScore: 0,
  ballScore: 0,
};

var adminAccess = false;

// Creating variables where I will store references to my database
var detailsRef = "";
var usersRef = "";
var publicRef = "";
var privateRef = "";
var scoresRef = "";
var adminRef = "";

// Wrapping a function in parentheses to create a namespace
// So functions don't clash with outer function
(function() {
  var firebase = app_firebase;
  var uid = null;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is Signed In, save details
      userDetails.uid = user.uid;
      userDetailsPrivate.uid = userDetails.uid;
      userDetailsPrivate.email = user.email;
      userDetailsPrivate.name = user.displayName;
      userDetailsPublic.photoURL = user.photoURL;

      // Database references <===== IMPORTANT --------------------------------------------------
      detailsRef = firebase.database().ref(DETAILS);
      usersRef = detailsRef.child(userDetails.uid);
      publicRef = usersRef.child(PUBLIC);
      privateRef = usersRef.child(PRIVATE);
      scoresRef = publicRef.child(SCORES);
      // END OF Database references <===== IMPORTANT ------------------------------------------




      // User Details Data
      usersRef.once("value", snapshot => {
        // Check if the user data already exists
        if (snapshot.exists()) {
          console.log("User has already Registered");
        }

        else {
          // Write details to database
          publicRef.set(userDetailsPublic);
          privateRef.set(userDetailsPrivate);

          // Also display the register modal so user can register
          var profilePicture = document.getElementById("profilePic");
          profilePicture.src = userDetailsPublic.photoURL;

          document.getElementById('id01').style.display = 'block';

          // Only set game scores if not already registered
          scoresRef.set(gameScores);
        }
      })


      checkUserAdmin();



      

    }

    else {
      // Redirected to Login Page
      uid = null;
      window.location.replace("login.html");
    }
  });

})();

// Registration Info (When registration details are submitted)
function registrationSubmit() {
  // Push the input values into registration info object
  userDetailsPublic.displayName = userName.value;
  userDetailsPrivate.age = userAge.value;

  if (nameValid && ageValid) {
    // Write registration to database
    console.log("Registration info upload to  database success");
    publicRef.update(userDetailsPublic);
    privateRef.update(userDetailsPrivate);

    // Close registration modal
    document.getElementById("id01").style.display = "none";
  }

}