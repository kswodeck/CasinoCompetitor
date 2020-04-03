// var app = require('../../app');
// var allUsers = app.users;
// console.log(allUsers.length);

var rowsPerPage = 50;
var rowsOfData = 0; // total number of rows of data. Get from db
var totalPages = rowsOfData/rowsPerPage; // total number of pages variable. Based on rowsOfData & rowsPerPage

// var midContainer = new Vue({
//     el: '#mid-container',
//     data: {
//       prevPrevPage: -1,
//       prevPage: 0,
//       currentPage: 1,
//       nextPage: 2,
//       nextNextPage: 3,
//     }
//   });

function loadInitialLeaderboard(users) {
    console.log("loading initial leaderboard");
    for (let i=0; i<rowsPerPage; i++) {
        let rank = 1;
        createRowOfLeaderboard(users[i], rank);
        rank++;
    }
    return users.length;
}

function createRowOfLeaderboard(user, rank) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    console.log("creating a row");
    const newRow = document.createElement('tr');
    newRow.className = 'leaderboard-row normal-row';
    const newRank = document.createElement('td');
    newRank.className = 'leaderboard-cell leaderboard-rank';
    newRank.innerText = rank;
    const newUsername = document.createElement('td');
    newRank.className = 'leaderboard-cell leaderboard-username';
    newRank.innerText = user.username;
    const newHighest = document.createElement('td');
    newRank.className = 'leaderboard-cell leaderboard-highest';
    newRank.innerText = user.highestWin;
    const newCoins = document.createElement('td');
    newRank.className = 'leaderboard-cell leaderboard-coins';
    newRank.innerText = user.coins;
    leaderboardBody.appendChild(newRow);
    newRow.appendChild(newRank);
    newRow.appendChild(newUsername);
    newRow.appendChild(newHighest);
    newRow.appendChild(newCoins);
}

function searchLeaderboard() {
    const searchValue = document.getElementById('tableSearch').value;
    const searchUsernames = document.getElementsByClassName('leaderboard-username');
    for (let i = 0; i < searchUsernames.length; i++) {
        let currentRow = document.getElementsByClassName('normal-row')[i];
        if (searchUsernames[i].innerText.includes(searchValue)) {
            currentRow.style.display = 'table-row';
        }
        else {
            currentRow.style.display = 'none';
        }
    }
}

function restoreLeaderboard() {
    const searchValue = document.getElementById('tableSearch').value;
    if (searchValue.length < 1) {
        let rows = document.getElementsByClassName('normal-row');
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = 'table-row';
        }
    }
}