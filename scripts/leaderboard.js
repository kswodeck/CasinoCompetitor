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
    if (searchValue.length <= 2) {
        let rows = document.getElementsByClassName('normal-row');
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = 'table-row';
        }
        return;
    }
}