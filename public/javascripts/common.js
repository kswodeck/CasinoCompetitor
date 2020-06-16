/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function displayLoginDialog(message){
  const dialog = document.getElementById('loginDialog');
  const pageTitle = document.getElementsByTagName('title')[0];
  const hamContent = document.getElementById('navbar-content');
  const mainDropdown = document.getElementById('mainDropdown');
  hamContent.classList.remove('show');
  hamContent.classList.add('collapse');
  mainDropdown.classList.remove('show');
  mainDropdown.classList.add('collapse');
    if (pageTitle.innerText == 'Login' || pageTitle.innerText == 'Forgot Username' || pageTitle.innerText == 'Forgot Password') {
      const exitButton = document.getElementById('loginDialogExit');
      exitButton.setAttribute('onclick', "location.href='/'");
    }
    if (message && message != 'false' && message != undefined) {
      const item = document.createElement('li');
      item.innerText = message;
      document.getElementById('invalid-login').appendChild(item);
      if (message.includes('new') || message.includes('updated')) {
        item.className = 'valid-list';
      } else {
        item.className = 'invalid-list';
      }
    }
    if (typeof dialog.showModal === 'function') {
      if (!dialog.hasAttribute('open')) {
        let forgotUser = document.getElementById('forgotUserDialog');
        let forgotPW = document.getElementById('forgotPWDialog');
        if (forgotUser.hasAttribute('open')) {
          backFromDialog('forgotUserDialog');
          } else if (forgotPW.hasAttribute('open')) {
            backFromDialog('forgotPWDialog');
          } else {
          dialog.showModal();
          }
        }
      if (document.getElementsByClassName('backdrop')[0]) {
        dialog.style.cssText = '';
        document.getElementsByClassName('backdrop')[0].style.cssText = '';
        document.getElementsByClassName('backdrop')[0].style.display = 'none';
      }
      document.getElementById('mid-container').style.display = 'none';
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
}

function displayLogoutDialog(){
  const dialog = document.getElementById('logoutDialog');
  const container = document.getElementById('mid-container');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.display = 'none';
    }
    container.style.display = 'none';
    setTimeout(() => {
      window.location.href = '/';
    }, 8000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function displayForgotDialog(newDialog, message){
    const loginDialog = document.getElementById(newDialog);
    const pageTitle = document.getElementsByTagName('title')[0];
    let invalidList = document.getElementById('invalid-forgot-username');
    if (typeof loginDialog.showModal === 'function') {
      loginDialog.showModal();
      if (document.getElementsByClassName('backdrop')[0]) {
        loginDialog.style.cssText = '';
        document.getElementsByClassName('backdrop')[0].style.cssText = '';
        document.getElementsByClassName('backdrop')[0].style.display = 'none';
      }
      document.getElementById('loginDialog').close();
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
    if (pageTitle.innerText == 'Forgot Password') {
      invalidList = document.getElementById('invalid-forgot-password');
    }
    if (message && message != false && message != undefined) {
      const item = document.createElement('li');
      if (!message.includes('Username') && !message.includes('email')) {
        item.className = 'invalid-list';
      } else {
        item.className = 'valid-list';
      }
      item.innerText = message;
      invalidList.appendChild(item);
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
  clearValidityMessages();
  document.getElementById(currentDialog).close();
  document.getElementById('mid-container').style.display = 'block';
}

function backFromDialog(currentDialog){
  clearValidityMessages();
  document.getElementById(currentDialog).close();
  document.getElementById('loginDialog').showModal();
  if (document.getElementsByClassName('backdrop')[0]) {
    document.getElementsByClassName('backdrop')[0].style.cssText = '';
    document.getElementById('loginDialog').style.cssText = '';
    document.getElementsByClassName('backdrop')[0].style.display = 'none';
  }
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

function displayDialog(dialog) {
  const curDialog = document.getElementById(dialog);
  if (typeof curDialog.showModal == 'function') {
    curDialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      curDialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.display = 'none';
    }
    document.getElementById('mid-container').style.display = 'none';
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function displayStreakDialog(streak){
  const dialog = document.getElementById('loginStreakDialog');
  const streakHeading = document.getElementById('streakHeading');
  const loginCoinSpan = document.getElementById('login-streak-win');
  if (typeof dialog.showModal == 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.display = 'none';
    }
    document.getElementById('mid-container').style.display = 'none';
    setTimeout(() => {
      document.getElementById('mid-container').style.display = 'block';
      dialog.close();
      window.location.href = '/';
    }, 10000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  if (streak == '1' || streak == 1) {
    streakHeading.innerText = "You've visited us " + streak + " day in a row!";
  } else {
    streakHeading.innerText = "You've visited us " + streak + " days in a row!";
  }
  loginCoinSpan.innerText = "You earned " + streak*10 + " ";
}

function clearValidityMessages() {
  let invalidMessages = document.getElementsByClassName('invalid-list'); 
  for (let i = 0; i < invalidMessages.length; i++) {
    invalidMessages[i].remove;
    invalidMessages[i].style.display = 'none';
  }
}

function toggleHamburger(dropdown) {
  let hamContent = document.getElementById(dropdown);
  let mainDropdown = document.getElementById('mainDropdown');
  if (!hamContent.classList.contains('show')) {
    hamContent.classList.remove('collapse');
    hamContent.classList.add('show');
    mainDropdown.classList.remove('collapse');
    mainDropdown.classList.add('show');
  } else {
    hamContent.classList.remove('show');
    hamContent.classList.add('collapse');
    mainDropdown.classList.remove('show');
    mainDropdown.classList.add('collapse');
  }
}

function sendForgotPWEmail(email, id, username) {
  let link = '127.0.0.1:3000/forgotpass/' + id;
  // eslint-disable-next-line no-undef
  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "kswodeck@yahoo.com",
    Password : "F4382D25C5C4A0AA224EFC64D8C120EC5082",
    To : email,
    From : "kmswodeck@gmail.com",
    Subject : "Forgotten Password Recovery",
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 250px; max-width: 800px; padding: 3% 0; margin: auto"><h1 style="color: crimson; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><p>Hi <strong>' + username + '!</strong> You requested to recover a misplaced password<br>Click the link below to create a new password for your account</p><a style="color: darkblue; font-size: 20px" href="' + link + '">Create New Password</a></div></html>'
  }).then(message => console.log('Email sent: ' + message));
}

//API key: 127C8A03B5584FF706794EFBDEFC745F439761B7C4C738036868EC3099078E3B9553BA5FA9E7E2082A4EE16439AC77F7

// Attachments aren't working for now
  // let file = document.getElementById('contactFile').files[0];
  // let reader = new FileReader();
  // reader.readAsBinaryString(file);
  // let dataUri = "data:" + file.type + ";base64," + btoa(reader.result);
// Attachments : [
//   {
//     name : file.name,
//     data : dataUri
//   }]