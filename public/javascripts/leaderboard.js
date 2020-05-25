/* eslint-disable no-unused-vars */
var searchForm = document.getElementById('leaderboardSearchForm');
var loading;
var loader = document.getElementById("loader");
var mainContainer = document.getElementById("main-container");
var pageBody = document.getElementById("pageBody");

function startLoading() {
  loader.classList.add('animateLoad');
  loader.style.display = 'block';  
  mainContainer.style.pointerEvents = 'none'
  mainContainer.style.opacity = 0.5;
  loading = setInterval(function() {console.log('loading content');}, 1000);
}

function clearLoading() {
  clearInterval(loading);
  loader.classList.remove('animateLoad');
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
    console.log(window.location.href);
    startLoading();
    window.location.href = '/leaderboard';
    return true;
  } else {
    return false;
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
  startLoading();
}