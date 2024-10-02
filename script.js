// Firebase configuration (पहले से सेव किया हुआ)

const firebaseConfig = {

    apiKey: "AIzaSyAYQAK-c5-EBGDN2fuBiAWK17HnqSg058E",

    authDomain: "voting-app-f5d8b.firebaseapp.com",

    databaseURL: "https://voting-app-f5d8b-default-rtdb.firebaseio.com",

    projectId: "voting-app-f5d8b",

    storageBucket: "voting-app-f5d8b.appspot.com",

    messagingSenderId: "572075489115",

    appId: "1:572075489115:web:30e506ae04806e8a128c7e"

};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let totalVotes = 0;

let rameshVotes = 0;

let kevalchandVotes = 0;

// Function to vote and store data in Firebase

function vote(candidate) {

    const userId = localStorage.getItem('userId') || generateUserId(); // Generate unique user id

    // Check if user already voted

    database.ref('votes/' + userId).get().then((snapshot) => {

        if (snapshot.exists()) {

            alert("आप पहले ही वोट कर चुके हैं।");

        } else {

            // Record vote in Firebase

            if (candidate === 'ramesh') {

                rameshVotes++;

                document.getElementById('light1').style.backgroundColor = 'green';

            } else if (candidate === 'kevalchand') {

                kevalchandVotes++;

                document.getElementById('light2').style.backgroundColor = 'green';

            }

            totalVotes++;

            // Save vote in database

            database.ref('votes/' + userId).set({

                votedFor: candidate

            });

            // Calculate percentage

            updateResults();

        }

    });

}

// Function to generate unique user ID

function generateUserId() {

    const userId = 'user-' + new Date().getTime();

    localStorage.setItem('userId', userId);

    return userId;

}

// Function to update results and show percentage

function updateResults() {

    const rameshPercent = ((rameshVotes / totalVotes) * 100).toFixed(2);

    const kevalchandPercent = ((kevalchandVotes / totalVotes) * 100).toFixed(2);

    document.getElementById('rameshPercent').innerText = rameshPercent;

    document.getElementById('kevalchandPercent').innerText = kevalchandPercent;

    // Update the vote counts in Firebase

    database.ref('results').set({

        ramesh: rameshVotes,

        kevalchand: kevalchandVotes,

        total: totalVotes

    });

}

// Function to load results from Firebase

function loadResults() {

    database.ref('results').on('value', (snapshot) => {

        const data = snapshot.val();

        if (data) {

            rameshVotes = data.ramesh || 0;

            kevalchandVotes = data.kevalchand || 0;

            totalVotes = data.total || 0;

            updateResults();

        }

    });

}

// Load the results on page load

window.onload = function() {

    loadResults();

};