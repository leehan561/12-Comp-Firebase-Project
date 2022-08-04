// Realtime database script file // 

var mainApp = {};

// Names of firebase paths
const DETAILS = "userDetails";
const ADMIN = "userAdmin"
const PUBLIC = "public";
const PRIVATE = "private";
const SCORES = "userScores";

// Objects to store user information in
// Created with format matching the firebase
var adminAccess = false;

var userDetailsPrivate = {
  name: "—",
  age: "—",
  email: "—",
};

var userDetailsPublic = {
  photoURL: "—",
  displayName: null,
};

var userDetails = {
  uid: "—"
};

var gameScores = {
  snakeScore: 0,
  ballScore: 0,
};


// variables where I will store references to database //
var usersReference = "";
var detailsReference = "";
var privateReference = "";
var publicReference = "";
var adminReference = "";
var scoresReference = "";


(function() {
  var firebase = app_firebase;
  var uid = null;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // If user is signed in, save details //
      userDetails.uid = user.uid;
      userDetailsPrivate.uid = userDetails.uid;
      userDetailsPrivate.email = user.email;
      userDetailsPrivate.name = user.displayName;
      userDetailsPublic.photoURL = user.photoURL;

      // -------------Database references-----------------------------------------------//
      detailsReference = firebase.database().ref(DETAILS);
      usersReference = detailsReference.child(userDetails.uid);
      privateReference = usersReference.child(PRIVATE);
      publicReference = usersReference.child(PUBLIC);
      scoresReference = publicReference.child(SCORES);
      //---------- END OF Database references-------------------------------------------//

      // User Details Data
      publicReference.child("displayName").once("value", snapshot => {
        // Check if the user data already exists
        if (snapshot.exists()) {
          console.log("User Is Already Registered");
        }

        else {
          // Write details to database
          publicReference.set(userDetailsPublic);
          privateReference.set(userDetailsPrivate);

          // Also display the register modal so user can register
          var profilePicture = document.getElementById("profilePic");
          profilePicture.src = userDetailsPublic.photoURL;

          document.getElementById('id01').style.display = 'block';

          scoresReference.set(gameScores);
        }
      })


      checkUserAdmin();

    }

    else {
      // Otherwise if user is not signed in, redirect to login page //
      uid = null;
      window.location.replace("login.html");
    }
  });

})();

//----------------- Registration details------------------------------------------------//

//----------------- Registration Form Validation ---------------------------------------//

// Store the userName & userAge values entered.
var userName = document.getElementById("i_username");
var userAge = document.getElementById("i_age");

//Variables that indicate if name & age is valid or not
var nameValid = false;
var ageValid = false;

// validation constants (using regex)
const userNameValidation = /^(?=[a-zA-Z0-9._]{4,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
const ageValidation = /^([8-9]|[1-7][0-9]|9[0-9])$/;

//Messages containing Invalid Entries
// Invalid name error message
var invalidNameMsg = document.getElementById("p_usernameErr");
invalidNameMsg.innerText = "Username must be between 4 and 16 characters"

// Invalid age error message
var invalidAgeMsg = document.getElementById("p_ageErr");
invalidAgeMsg.innerText = "You must be at least 8 to 99 years old  to play";


// Age Validation
userAge.addEventListener('input', function(e) {
  var currentValue = e.target.value;
  validAge = ageValidation.test(currentValue);


  if (validAge) {
    // If valid age inputted, hide error & add green border
    document.getElementById("p_ageErr").style.display = "none";
    userAge.classList.remove("w3-border-red");
    userAge.classList.add("w3-border-green");
  }

  else {
    // If age is not valid, hide green border and show error
    document.getElementById("p_ageErr").style.display = "block";
    userAge.classList.add("w3-border-red");
    userAge.classList.remove("w3-border-green");
  }
})

// Username Validation
userName.addEventListener('input', function(e) {
  var currentValue = e.target.value;
  validName = userNameValidation.test(currentValue);

  if (validName) {
    // If valid age inputted, hide error & add green border
    invalidNameMsg.style.display = "none";
    userName.classList.remove("w3-border-red");
    userName.classList.add("w3-border-green");
  }

  else {
    // If age is not valid, hide green border and show error
    invalidNameMsg.style.display = "block";
    userName.classList.add("w3-border-red");
    userName.classList.remove("w3-border-green");
  }
})

//----------------- Registration info writing to databse--------------------------------//

// Registration Details submitted
function registrationSubmit() {
  // Push the input values into registration info object
  userDetailsPublic.displayName = userName.value;
  userDetailsPrivate.age = userAge.value;

  if (validName && validAge) {
    // If validName & Valid Age = True then write user registration info to database //
    console.log("Writing registration info to database");
    publicReference.update(userDetailsPublic);
    privateReference.update(userDetailsPrivate);

    // Closing the registration modal after write to database is complete //
    document.getElementById("id01").style.display = "none";
  }

}
