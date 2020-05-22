/* eslint-disable no-unused-vars */
var searchForm = document.getElementById('leaderboardSearchForm');
// var rowsPerPage = 50;
// var rowsOfData = 0; // total number of rows of data. Get from db
// var totalPages = rowsOfData/rowsPerPage; // total number of pages variable. Based on rowsOfData & rowsPerPage

// function loadInitialLeaderboard(users) {
//     console.log("loading initial leaderboard");
//     for (let i=0; i<rowsPerPage; i++) {
//         let rank = 1;
//         createRowOfLeaderboard(users[i], rank);
//         rank++;
//     }
//     return users.length;
// }

// function createRowOfLeaderboard(user, rank) {
//     const leaderboardBody = document.getElementById('leaderboard-body');
//     console.log("creating a row");
//     const newRow = document.createElement('tr');
//     newRow.className = 'leaderboard-row normal-row';
//     const newRank = document.createElement('td');
//     newRank.className = 'leaderboard-cell leaderboard-rank';
//     newRank.innerText = rank;
//     const newUsername = document.createElement('td');
//     newRank.className = 'leaderboard-cell leaderboard-username';
//     newRank.innerText = user.username;
//     const newHighest = document.createElement('td');
//     newRank.className = 'leaderboard-cell leaderboard-highest';
//     newRank.innerText = user.highestWin;
//     const newCoins = document.createElement('td');
//     newRank.className = 'leaderboard-cell leaderboard-coins';
//     newRank.innerText = user.coins;
//     leaderboardBody.appendChild(newRow);
//     newRow.appendChild(newRank);
//     newRow.appendChild(newUsername);
//     newRow.appendChild(newHighest);
//     newRow.appendChild(newCoins);
// }

function searchLeaderboard() {
    const searchValue = document.getElementById('tableSearch').value;
    if (searchValue.length > 0) {
      window.location.href = '/leaderboard?search=' + searchValue;
        return true;
    } else {
      return false;
    }
}

function restoreLeaderboard() {
    const searchValue = document.getElementById('tableSearch').value;
    if (searchValue.length < 1) {
      window.location.href = '/leaderboard';
      return false;
    } else {
      return true;
    }
}

function changePage(page, search) {
  if (window.location.href.includes('page='+ page)) {
    return false;
  } else if (!window.location.href.includes('page=') && page == 1) {
    return false;
  }
  if (window.location.href.includes('search')) {
    window.location.href = '/leaderboard?page=' + page + '&search=' + search;
  } else {
    window.location.href = '/leaderboard?page=' + page;
  }
}