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

function searchLeaderboard(page) {
  const searchValue = document.getElementById('tableSearch').value;
  if (searchValue.length > 0) {
    startLoading();
    window.location.href = '/leaderboard?search=' + searchValue;
      return true;
  } else {
    return false;
  }
}

function restoreLeaderboard(page) {
  const searchValue = document.getElementById('tableSearch').value;
  if (searchValue.length < 1 && (page != 1 || window.location.href.includes('search='))) {
    startLoading();
    window.location.href = '/leaderboard';
    return true;
  } else {
    return false;
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
    window.location.href = '/leaderboard?page=' + page + '&search=' + search;
  } else {
    window.location.href = '/leaderboard?page=' + page;
  }
  startLoading();
}