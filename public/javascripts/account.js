const title = document.getElementsByTagName('title');
if (title == 'My Account') {
  const accountUpdateButton = document.getElementById('accountUpdateButton');
}

function displayLoginDialog(message){
    const loginDialog = document.getElementById('loginDialog');
    const pageTitle = document.getElementsByTagName('title')[0];
    if (pageTitle.innerText == 'Login' || pageTitle.innerText == 'Forgot Username' || pageTitle.innerText == 'Forgot Password') {
      const exitButton = document.getElementById('loginDialogExit');
      exitButton.setAttribute('onclick', "location.href='/'");
    }
    if (message != 'false' && message != undefined) {
      const item = document.createElement('li');
      item.className = 'invalid-list';
      item.innerText = message;
      document.getElementById('invalid-login').appendChild(item);
    }
    if (typeof loginDialog.showModal === 'function') {
      loginDialog.showModal();
      document.getElementById('mid-container').style.display = 'none';
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
}

function displayLogoutDialog(){
  const logoutDialog = document.getElementById('logoutDialog');
  const container = document.getElementById('mid-container');
  if (typeof logoutDialog.showModal === 'function') {
    logoutDialog.showModal();
    container.style.display = 'none';
    setTimeout(function() {
      window.location.href = '/';
    }, 8000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function displayForgotDialog(newDialog, message){
    const loginDialog = document.getElementById(newDialog);
    const pageTitle = document.getElementsByTagName('title')[0];
    if (typeof loginDialog.showModal === 'function') {
      loginDialog.showModal();
      document.getElementById('loginDialog').close();
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
    if (message != 'false' && message != undefined) {
      const item = document.createElement('li');
      if (!message.includes('Username')) {
        item.className = 'invalid-list';
      } else {
        item.className = 'valid-list';
      }
      item.innerText = message;
      document.getElementById('invalid-forgot-username').appendChild(item);
    }
    const forgotPassExit = document.getElementById('forgotPWDialogExit');
    const forgotUserExit = document.getElementById('forgotUserDialogExit');
    if (pageTitle.innerText == 'Forgot Username' || pageTitle.innerText == 'Forgot Password') {
      const exitButton = document.getElementById('loginDialogExit');
      forgotUserExit.setAttribute('onclick', "location.href='/login'");
      forgotPassExit.setAttribute('onclick', "location.href='/login'");
      exitButton.setAttribute('onclick', "location.href='/'");
    }
    if (pageTitle.innerText == 'Login') {
      forgotUserExit.setAttribute('onclick', "location.href='/'");
      forgotPassExit.setAttribute('onclick', "location.href='/'");
    }
}

function exitDialog(currentDialog){
  const invalidList = document.getElementsByClassName('invalid-fields-list');
  for (let i = 0; i < invalidList.length; i++) {
    while (invalidList[i].hasChildNodes()) {
      invalidList[i].removeChild(invalidList[i].lastChild);
    }
  }
  document.getElementById(currentDialog).close();
  document.getElementById('mid-container').style.display = 'block';
  // enableAllInputs(accountInputs);
}

function backFromDialog(currentDialog){
    document.getElementById(currentDialog).close();
    document.getElementById('loginDialog').showModal();
}

function togglePasswordVisibility(passwordId, iconId){
  const passwordInput = document.getElementById(passwordId);
  const passwordIcon = document.getElementById(iconId);
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordIcon.classList.remove('fa-eye');
    passwordIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    passwordIcon.classList.remove('fa-eye-slash');
    passwordIcon.classList.add('fa-eye');
  }
}

function displayEditPassword(updateDialog){
  const editDialog = document.getElementById(updateDialog);
  // const updatePassword = document.getElementById('updatePassword');
  if (typeof editDialog.showModal == 'function') {
    console.log(editDialog);
    editDialog.showModal();
    document.getElementById('mid-container').style.display = 'none';
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}