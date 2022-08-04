// Js script for Admin page (Modified from youtube video) //

// Variables //
var userNo;
var userList;

var modName = document.getElementById("nameMod");
var modDisplayName = document.getElementById("displayNameMod");
var modAge = document.getElementById("ageMod");
var modEmail = document.getElementById("emailMod");
var modUID = document.getElementById("uidMod");
var modHighscore = document.getElementById("highscoreMod");

// Update/Delete variables //
var btnModUpdate = document.getElementById("updModBtn");
var btnModDelete = document.getElementById("delModBtn");

// Back button to return to game page // 
function backButton() {
  window.location = "game.html"
}

// Getting all users data from database //
function selectAllData() {
  userNo = 0;
  userList = [];
  document.getElementById("tbody1").innerHTML = "";

  firebase.database().ref(DETAILS).once("value",
    function(allRecords) {
      allRecords.forEach(
        function(currentRecord) {
          var name = currentRecord.val().private.name;
          var displayName = currentRecord.val().public.displayName;
          var age = currentRecord.val().private.age;
          var email = currentRecord.val().private.email;
          var highscore = currentRecord.val().public.userScore.highScore;
          var UID = currentRecord.val().private.uid;

          // running function to fill admin table 
          addItemsToTable(name, displayName, age, email, highscore, UID);
        }
      );
    });

}
// On window load automatically run function to get all user data from database //
window.onload = selectAllData();

// Filling admin table //
function addItemsToTable(_name, _displayName, _age, _email, _gameHs, _UID) {
  var tbody = document.getElementById("tbody1");
  var trow = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");
  var td8 = document.createElement("td");

  userList.push([_name, _displayName, _age, _email, _gameHs, _UID]);
  td1.innerHTML = ++userNo;
  td2.innerHTML = _name;
  td3.innerHTML = _displayName;
  td4.innerHTML = _age;
  td5.innerHTML = _email;
  td6.innerHTML = _gameHs;
  td7.innerHTML = _UID;

  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  trow.appendChild(td6);
  trow.appendChild(td7);

  // Button div containing other buttons when menu opened // 
  var controlDiv = document.createElement("div");
  controlDiv.innerHTML += '<button type="button" class="btn btn-primary my-2" data-toggle="modal" data-target="#exampleModalCenter" onclick="fillTBoxes(' + userNo + ')">Edit Record</button>'

  trow.appendChild(controlDiv);
  tbody.appendChild(trow);
}

// Fills boxes in the update records form // 
function fillTBoxes(_index) {
  --_index
  modName.value = userList[_index][0];
  modDisplayName.value = userList[_index][1];
  modAge.value = userList[_index][2];
  modEmail.value = userList[_index][3];
  modHighscore.value = userList[_index][4];
  modUID.value = userList[_index][5];
  modUID.disabled = true;
}

// Updating user records to firebase // 
function updUser() {
  // Update private path //
  firebase.database().ref(DETAILS + "/" + modUID.value).child(PRIVATEDETAILS).update(
    {
      name: modName.value,
      age: modAge.value,
      email: modEmail.value,
      uid: modUID.value,
    },

    (error) => {
      // If error, give failed alert
      if (error) {
        alert("Record failed to update");
      }

      else {
        // If no error found, then update data to path //
        firebase.database().ref(DETAILS + "/" + modUID.value).child(PUBLICDETAILS).update(
          {
            displayName: modDisplayName.value,
          },

          (error) => {
            // If error, give failed alert
            if (error) {
              alert("Record failed to update");
            }

            else {
              // If no error found, then update data to path //
              firebase.database().ref(DETAILS + "/" + modUID.value + "/" + PUBLICDETAILS).child(SCORES).update(
                {
                  highScore: modHighscore.value,
                },

                (error) => {
                  // If error, give failed alert //
                  if (error) {
                    alert("Record failed to update");
                  }
                  else {
                    // give successful alert and hide update screen //
                    alert("Database record successfully updated");
                    selectAllData();
                    $("#exampleModalCenter").modal("hide");
                  }
                }
              )
            }
          }
        )
      }
    }
  )
}

// Deleting user firebase records // 
function delUser() {
  // Deleting User path.
  firebase.database().ref(DETAILS + "/" + modUID.value).remove().then(
    function() {
      alert("Record was deleted");
      selectAllData();
      // Hiding delete modal 
      $("#exampleModalCenter").modal("hide");
    }
  )
}

// checks if logged in user is admin // 
function checkUserAdmin() {
  // checking userAdmin path with the key as the UID //
  firebase.database().ref("userAdmin/" + userDetails.uid).once("value", snapshot => {
    // If UID exists under userAdmin Path, display Admin Button //
    if (snapshot.exists()) {
      console.log("User is Admin");
      document.getElementById('adminBtn').style.display = 'block';
    }

    else {
      // User is not admin //
      console.log("User is not a Admin");
    }
  })
}

