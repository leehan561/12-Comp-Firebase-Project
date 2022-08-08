// Realtime database script file // 

var mainApp = {};

// Names of firebase paths // 
const DETAILS = "userDetails";
const ADMIN = "userAdmin"
const PUBLICDETAILS = "public";
const PRIVATEDETAILS = "private";
const SCORES = "userScore";

// variable references to database //
var usersReference = "";
var detailsReference = "";
var privateReference = "";
var publicReference = "";
var adminReference = "";
var scoresReference = "";

// Variables to store user information //

var userDetailsPrivate = {
  name: " ",
  age: 0,
  email: "",
};

var userDetailsPublic = {
  photoURL: "",
  displayName: null,
};

var userDetails = {
  uid: ""
};

var gameScore = {
  highScore: 0,
};


(function() {
  var firebase = app_firebase;
  var uid = null;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // If user is signed in, save their details //
      userDetails.uid = user.uid;
      userDetailsPrivate.uid = userDetails.uid;
      userDetailsPrivate.email = user.email;
      userDetailsPrivate.name = user.displayName;
      userDetailsPublic.photoURL = user.photoURL;

      // -------------Database references-----------------------------------------------//
      detailsReference = firebase.database().ref(DETAILS);
      usersReference = detailsReference.child(userDetails.uid);
      privateReference = usersReference.child(PRIVATEDETAILS);
      publicReference = usersReference.child(PUBLICDETAILS);
      scoresReference = publicReference.child(SCORES);
      //---------- END OF Database references-------------------------------------------//

      // User Details Data, Checking if display name exists in database //
      publicReference.child("displayName").once("value", snapshot => {
        //if the user data already exists run console.log //
        if (snapshot.exists()) {
          console.log("User Registration already complete");
        }

        else {
          // Otherwise display register form so the user can register //
          var profilePicture = document.getElementById("profilePic");
          profilePicture.src = userDetailsPublic.photoURL;
          document.getElementById('id01').style.display = 'block';
          scoresReference.set(gameScore);

          // Save details to database //
          publicReference.set(userDetailsPublic);
          privateReference.set(userDetailsPrivate);
        }
      })

      // Check if the user is admin
      checkUserAdmin();

    }

    else {
      // Otherwise if user is not signed in, redirect to login page //
      uid = null;
      window.location.replace("login.html");
    }
  });

})();

//----------------- Registration from user details--------------------------------------//

//----------------- Registration Form Validation ---------------------------------------//

// Store the userName & userAge values entered.
var userName = document.getElementById("i_username");
var userAge = document.getElementById("i_age");

// Variables that indicate if name & age is valid or not//
var nameValid = false;
var ageValid = false;

// validation constants (using regex)
// name validation allowed from 4-16 characters 
const userNameValidation = /^(?=[a-zA-Z0-9._]{4,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
// age validation allowed from age 8-99 years old // 
const ageValidation = /^([8-9]|[1-7][0-9]|9[0-9])$/;

//variables which carry invalid error msg // 
// Invalid name error message
var invalidNameMsg = document.getElementById("p_usernameErr");
invalidNameMsg.innerText = "Username must be between 4 and 16 characters"

// Invalid age error message
var invalidAgeMsg = document.getElementById("p_ageErr");
invalidAgeMsg.innerText = "You must be at least 8 to 99 years old  to play";


// Age Validation.
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
    // If age is invalid, hide green border and show error
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
    // If valid name inputted, hide error & add green border
    invalidNameMsg.style.display = "none";
    userName.classList.remove("w3-border-red");
    userName.classList.add("w3-border-green");
  }

  else {
    // If name is invalid, hide green border and show error
    invalidNameMsg.style.display = "block";
    userName.classList.add("w3-border-red");
    userName.classList.remove("w3-border-green");
  }
})

//----------------- Registration info writing to database------------------------------//

// Registration Details submitted
function registrationSubmit() {
  // write the name and age into registration info variable
  userDetailsPrivate.age = userAge.value;
  userDetailsPublic.displayName = userName.value;

  if (validName & validAge) {
    // If validName & Valid Age = True then write user registration info to database and close registration form //
    console.log("Writing registration info to database");
    publicReference.update(userDetailsPublic);
    privateReference.update(userDetailsPrivate);
    document.getElementById("id01").style.display = "none";
  }

}

// writing / updating highscore to database // 
function checkHighscore(_currentScore, _gameScore) {
  firebase.database().ref(DETAILS + "/" + userDetails.uid + "/" + PUBLICDETAILS + "/" + SCORES + "/" + _gameScore).on("value", function(snapshot) {
    highscore = snapshot.val();
  })

  if (_currentScore > highscore) {
    return true;
  }

  else {
    return false;
  }
}

function getHighscore(_gameScore) {
  firebase.database().ref(DETAILS + "/" + userDetails.uid + "/" + PUBLICDETAILS + "/" + SCORES + "/" + _gameScore).on("value", function(snapshot) {
    highscore = snapshot.val();
  })

  return highscore;
}