var isLoggedIn = false;

function displayLoginDialog(){
    const loginDialog = document.getElementById('loginDialog');
    if (typeof loginDialog.showModal === 'function') {
      loginDialog.showModal();
      document.getElementById('mid-container').style.display = 'none';
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
}

function displayForgotDialog(newDialog){
    const loginDialog = document.getElementById(newDialog);
    if (typeof loginDialog.showModal === 'function') {
      loginDialog.showModal();
      document.getElementById('loginDialog').close();
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
}

function exitDialog(currentDialog){
    document.getElementById(currentDialog).close();
    document.getElementById('mid-container').style.display = 'block';
}

function backToLoginDialog(currentDialog){
    document.getElementById(currentDialog).close();
    document.getElementById('loginDialog').showModal();
}