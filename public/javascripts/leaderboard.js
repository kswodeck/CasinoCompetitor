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

function searchLeaderboard() {
  console.log(event);
  if (event.type == 'click' || event.code == 'Enter' || event.type == 'submit') {
    const searchValue = document.getElementById('tableSearch').value;
    if (searchValue.length != 0 && window.location.href != window.location.origin + '/leaderboard?search=' + searchValue) {
      startLoading();
      new Promise(resolve => {
        window.location.href = '/leaderboard?search=' + searchValue;
        resolve(5);
      }).then(() => stopLoading());
        return true;
    } else if (searchValue.length == 0) {
      restoreLeaderboard(1)
    } else {
      return false;
    }
  }
}

function restoreLeaderboard(page) {
  const searchValue = document.getElementById('tableSearch').value;
  if (searchValue.length == 0 && (page != 1 || window.location.href.includes('search='))) {
    startLoading();
    new Promise(resolve => {
      window.location.href = '/leaderboard'
      resolve(5);
    }).then(() => stopLoading());
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
  startLoading();
  if (url.includes('search')) {
    window.location.href = '/leaderboard?page=' + page + '&search=' + search;
  } else {
    window.location.href = '/leaderboard?page=' + page;
  }
}