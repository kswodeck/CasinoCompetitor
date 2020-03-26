const title = document.getElementsByTagName('title');
if (title == 'My Account') {
  const accountUpdateButton = document.getElementById('accountUpdateButton');
}

function displayLoginDialog(loginPage){
    const loginDialog = document.getElementById('loginDialog');
    if (loginPage === true) {
      const exitButton = document.getElementById('loginDialogExit')
      exitButton.setAttribute('onclick', "location.href='/'");
      // exitButton.setAttribute('href', '/coin');
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
      logoutDialog.close();
      container.style.display = 'block';
    }, 8000);
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

function toggleInputDisable(input) {
  const editInput = document.getElementById(input);
  if (editInput.hasAttribute('disabled')) {      
    editInput.removeAttribute('disabled');
    if (accountUpdateButton.hasAttribute('disabled')) {
      accountUpdateButton.removeAttribute('disabled');
    }
  }
}