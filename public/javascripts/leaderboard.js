/* eslint-disable no-unused-vars */
var searchForm = document.getElementById('leaderboardSearchForm');
var loader = document.getElementById("loader");
var mainContainer = document.getElementById("main-container");

function startLoading() {
  loader.classList.add('animateLoad');
  loader.style.display = 'block';  
  mainContainer.style.pointerEvents = 'none';
  mainContainer.style.opacity = 0.5;
}
function stopLoading() {
  loader.classList.remove('animateLoad');
  loader.style.display = 'none';  
  mainContainer.style.pointerEvents = 'all';
  mainContainer.style.opacity = 1;
}

function getLeaderboardResults(url) {
  startLoading();
  window.location.href = url;
}

function searchLeaderboard() {
  if (event.type == 'click' || event.code == 'Enter') {
    const searchValue = document.getElementById('tableSearch').value;
    if (searchValue.length != 0 && window.location.href != window.location.origin + '/leaderboard?search=' + searchValue) {
      getLeaderboardResults('/leaderboard?search=' + searchValue);
    } else if (searchValue.length == 0) {
      restoreLeaderboard(1, searchValue);
    }
  }
}

function restoreLeaderboard(page, val) {
  if (val.length == 0 && (page != 1 || window.location.href.includes('search='))) {
    getLeaderboardResults('/leaderboard');
  }
}

function changePage(page, search) {
  let url = window.location.href;
  if (url.includes('page='+ page + '&') || url.includes('&page='+ page) || url == window.location.origin + '/leaderboard?page=' + page) {
    return false;
  } else if (!url.includes('page=') && page == 1) {
    return false;
  }
  if (url.includes('search')) {
    url = '/leaderboard?page=' + page + '&search=' + search;
  } else {
    url = '/leaderboard?page=' + page;
  }
  getLeaderboardResults(url);
}