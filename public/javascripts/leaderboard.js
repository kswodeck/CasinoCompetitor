var rowsPerPage = 50;
var rowsOfData = 50; // total number of rows of data. Get from db
var totalPages = rowsOfData/rowsPerPage; // total number of pages variable. Based on rowsOfData & rowsPerPage

var midContainer = new Vue({
    el: '#mid-container',
    data: {
      prevPrevPage: -1,
      prevPage: 0,
      currentPage: 1,
      nextPage: 2,
      nextNextPage: 3,
    }
  });

function searchLeaderboard() {
    const searchValue = document.getElementById('tableSearch').value;
    const searchUsernames = document.getElementsByClassName('leaderboard-username');
    for (let i = 0; i < searchUsernames.length; i++) {
        let currentRow = document.getElementsByClassName('normal-row')[i];
        if (searchUsernames[i].innerHTML.includes(searchValue)) {
            currentRow.style.display = 'table-row';
        }
        else {
            currentRow.style.display = 'none';
        }
    }
}

function restoreLeaderboard() {
    const searchValue = document.getElementById('tableSearch').value;
    if (searchValue.length <= 1) {
        let rows = document.getElementsByClassName('normal-row');
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = 'table-row';
        }
        return;
    }
}