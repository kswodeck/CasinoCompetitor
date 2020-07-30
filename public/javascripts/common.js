/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function restoreContainer() {
  if (event.code == 'Escape') {
    document.getElementById('mid-container').style.display = 'block';
  }
}

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
    if (message && message != 'false') {
      let invalidLogin = document.getElementById('invalid-login');
      if (invalidLogin.childNodes.length == 0) {
        const item = document.createElement('li');
        item.innerText = message;
        invalidLogin.appendChild(item);
        if (message.includes('new') || message.includes('updated')) {
          item.className = 'valid-list';
        } else {
          item.className = 'invalid-list';
        }
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
    }
    container.style.display = 'none';
    setTimeout(() => window.location.reload(), 8000);
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
      }
      document.getElementById('loginDialog').close();
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
    if (pageTitle.innerText == 'Forgot Password') {
      invalidList = document.getElementById('invalid-forgot-password');
    }
    if (message && message != false) {
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
  }
}

function togglePasswordVisibility(passwordId, iconId){
  const passwordInput = document.getElementById(passwordId);
  const passwordIcon = document.getElementById(iconId);
  if (event.type == 'click' || event.code == 'Enter') {
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
}

function displayDialog(dialog) {
  const curDialog = document.getElementById(dialog);
  if (event.type == 'click' || event.code == 'Enter') {
    if (typeof curDialog.showModal == 'function') {
      curDialog.showModal();
      if (document.getElementsByClassName('backdrop')[0]) {
        curDialog.style.cssText = '';
        document.getElementsByClassName('backdrop')[0].style.cssText = '';
      }
      document.getElementById('mid-container').style.display = 'none';
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
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
    }
    document.getElementById('mid-container').style.display = 'none';
    setTimeout(() => {
      if (dialog.hasAttribute('open')) {
        document.getElementById('mid-container').style.display = 'block';
        window.location.reload();
      }
    }, 10000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  if (streak == '1' || streak == 1) {
    streakHeading.innerText = "You visited us " + streak + " day in a row!";
  } else {
    streakHeading.innerText = "You visited us " + streak + " days in a row!";
  }
  loginCoinSpan.innerText = "You earned " + streak*10 + " ";
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
  let link = window.location.origin + '/forgotpass/' + id;
  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "kswodeck@yahoo.com",
    Password : "F4382D25C5C4A0AA224EFC64D8C120EC5082",
    To : email,
    From : "kmswodeck@gmail.com",
    Subject : "Forgotten Password Recovery",
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 250px; max-width: 800px; padding: 3% 0; margin: auto"><h1 style="color: #be0b2f; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><p>Hi <strong>' + username + '!</strong> You requested to recover a misplaced password<br>Click the link below to create a new password for your account</p><a style="color: darkblue; font-size: 20px" href="' + link + '">Create New Password</a></div></html>'
  }).then(message => console.log('Email sent: ' + message));
}

const titleTag = document.getElementsByTagName('title')[0];
if (titleTag.innerText == 'My Account') {
  var accountInputs = document.getElementsByClassName('my-account');
  var firstNameValue = accountInputs[0].value;
  var lastNameValue = accountInputs[1].value;
  var emailValue = accountInputs[2].value;
  var usernameValue = accountInputs[3].value;
  var phoneValue = accountInputs[4].value;
  var birthdayValue = accountInputs[5].value;
  var imageValue = accountInputs[6].value;
  setTimeout(() => highlightUserAvatar(), 200);
}

function validateAccountCreate() {
  const inputs = document.getElementsByClassName('account-input');
  const invalidList = document.getElementById('invalid-fields-list');
  let cookieNames = ['firstName', 'lastName', 'email', 'username', 'phone', 'birthday', 'profileImage'];
  let cookieValues = ["firstName", "lastName", "newEmail", "createUsername", "createPhone", "newBirthday", 'profileImage'];
  let isValid = validateInputs(invalidList, inputs, 'accountCreate', 1300, cookieNames, cookieValues);
  const newPassword = document.getElementById('newPassword');
  const repeatPassword = document.getElementById('repeatPassword');
  if (!isValid) {
    return false;
  }
  return validatePassMatch(newPassword, repeatPassword, invalidList);
}

function validateAccountUpdate() {
  const invalidList = document.getElementById('invalid-fields-list');
  let cookieNames = ['firstName', 'lastName', 'email', 'username', 'phone', 'birthday', 'profileImage'];
  let cookieValues = ["updateFirstName", "updateLastName", "updateEmail", "updateUsername", "updatePhone", "updateBirthday", 'profileImage'];
  let isValid = validateInputs(invalidList, accountInputs, 'accountUpdateButton', 1200, cookieNames, cookieValues);
  const item = document.createElement('li');
  if (accountInputs[0].value == firstNameValue && accountInputs[1].value == lastNameValue && accountInputs[2].value == emailValue &&
    accountInputs[3].value == usernameValue && accountInputs[4].value == phoneValue && accountInputs[5].value == birthdayValue  && accountInputs[6].value == imageValue) {
      item.className = 'invalid-list';
      item.innerText = 'Please make changes before trying to update info';
      invalidList.appendChild(item);
      return false;
    } else {
      item.className = 'valid-list';
      item.innerText = 'Account has been updated';
    }
  return isValid;
}

function validatePasswordUpdate() {
  const inputs = document.getElementsByClassName('updatePassInput');
  const invalidList = document.getElementById('invalid-update-password');
  let cookieNames = [], cookieValues = [];
  let isValid = validateInputs(invalidList, inputs, 'passwordUpdateButton', 1000, cookieNames, cookieValues);
  const oldPassword = document.getElementById('oldPassword');
  const updatePassword = document.getElementById('updatePassword');
  const repeatPassword = document.getElementById('repeatNewPassword');
  if (!isValid) {
    return false;
  }   
  let match = validatePassMatch(updatePassword, repeatPassword, invalidList);
  if (!match) {
    return false;
  } else if (oldPassword.value == updatePassword.value || oldPassword.value == repeatPassword.value) {
    addToInvalidList('* old and new passwords must be different', updatePassword, invalidList);
    return false;
  } else {
    setTimeout(() => { // if there's only 1 more possible error, display it after timeout
      addToInvalidList('* current password is incorrect', oldPassword, invalidList);
      oldPassword.style.borderColor = '#be0b2f';
    }, 1000);
    return true;
  }
}

function validatePasswordChange() {
  const inputs = document.getElementsByClassName('changePassInput');
  const invalidList = document.getElementById('invalid-change-password');
  let cookieNames = [], cookieValues = [];
  let isValid = validateInputs(invalidList, inputs, 'passwordChangeButton', 1000, cookieNames, cookieValues);
  const changePassword = document.getElementById('changePassword');
  const repeatPassword = document.getElementById('repeatChangePassword');
  if (!isValid) {
    return false;
  } 
  let match = validatePassMatch(changePassword, repeatPassword, invalidList);
  if (!match) {
    return false;
  }
  return true;
}

function validatePreLogin(inputClass, list, form) {
  let cookieNames = ['email', 'phone', 'birthday'];
  let cookieValues = ['loginUsername'];
  let disableButton = 'loginButton';
  if (document.getElementById('forgotPWDialog').open) {
    disableButton = 'forgotPWButton';
    cookieValues = ['forgotPWEmail', 'forgotPWPhone', 'forgotPWBirthday'];
  } else if (document.getElementById('forgotUserDialog').open) {
    disableButton = 'forgotUserButton';
    cookieValues = ['forgotUserEmail', 'forgotUserPhone', 'forgotUserBirthday'];
  } else {
    cookieNames = ['username'];
  }
  const inputs = document.getElementsByClassName(inputClass);
  const invalidList = document.getElementById(list);
  let isValid = validateInputs(invalidList, inputs, disableButton, 1200, cookieNames, cookieValues);
  if (!isValid) {
    return false;
  }
  document.getElementById(form).submit();
  return true;
}

function validateAccountDelete() {
  let invalidList = document.getElementById('invalid-verify-password');
  let inputs = document.getElementsByClassName('verifyPassInput');
  let cookieNames = [], cookieValues = [];
  let isValid = validateInputs(invalidList, inputs, 'passwordVerifyDeleteButton', 1000, cookieNames, cookieValues);
  if (isValid == false) {
    return false;
  }
  return true;
}

function validateContactUs() {
  let invalidList = document.getElementById('invalid-fields-list');
  let inputs = document.getElementsByClassName('account-input');
  let cookieNames = [], cookieValues = [];
  let isValid = validateInputs(invalidList, inputs, 'contactUsButton', 1000, cookieNames, cookieValues);
  if (isValid == false) {
    return false;
  } else {
    sendContactEmail();
  }
}

function validateInputs(invalidList, inputs, button, disableTime, cookieNames, cookieValues) {
  disableAfterSubmit(button, disableTime);
  removeWhiteSpace(inputs);
  clearValidityMessages();
  let validity = true;
  let empty = false;
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].checkValidity()) {
      if (!inputs[i].value) {
        empty = true;
      }
      validity = false;
    } else if (inputs[i].type == 'email') {
      if (!emailIsValid(inputs[i].value)) {
        inputs[i].style.borderColor = '#be0b2f';
        validity = false;
      }
    }
    inputs[i].style.borderWidth = '0.06em';
  }
  addCookies(cookieNames, cookieValues);
  if (empty == true) {
    addToInvalidList('* please fill out all fields', inputs[inputs.length-1], invalidList);
    return false;
  } else if (!validity) {
    addToInvalidList('* all fields must be valid', inputs[inputs.length-1], invalidList);
    return false;
  }
  return validity;
  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function disableAfterSubmit(button, time) {
    let element = document.getElementById(button);
    setTimeout(() => element.disabled = true, 50);
    setTimeout(() => element.disabled = false, time);
  }
  function removeWhiteSpace(inputs) {
    for (let i = 0; i < inputs.length; i++) {
      let inputType = inputs[i].getAttribute('type');
      while (inputs[i].value.startsWith(' ') && inputType != 'password') {
        inputs[i].value = inputs[i].value.substr(1);
      }
      while (inputs[i].value.endsWith(' ') && inputType != 'password') {
        inputs[i].value = inputs[i].value.replace(inputs[i].value.slice(-1),'');
      }
    }
  }
  function addCookies(inputs, values) {
    for (let i = 0; i < inputs.length; i++) {
      let value = document.getElementById(values[i]).value;
      document.cookie = inputs[i] + '=' + value + '; max-age=2600000; path=/; domain=casinocompetitor.com; secure';
    }
  }
}

function validatePassMatch(password, repeatPassword, invalidList) {
  if (password.value != repeatPassword.value) {
      addToInvalidList('* repeat password must match password', password, invalidList);
      repeatPassword.style.border = '0.06em solid #be0b2f';
      return false;
  }
  return true;
}

function addToInvalidList(str, el, invalidList) {
  const item = document.createElement('li');
  item.className = 'invalid-list';
  item.innerText = str;
  invalidList.appendChild(item);
  el.style.borderWidth = '0.06em';
}

function clearValidityMessages() {
  let invalidMessages = document.getElementsByClassName('invalid-list');
  let validMessages = document.getElementsByClassName('valid-list');
  for (let i = 0; i < invalidMessages.length; i++) {
    invalidMessages[i].remove;
    invalidMessages[i].style.display = 'none';
  }
  for (let i = 0; i < validMessages.length; i++) {
    validMessages[i].remove;
    validMessages[i].style.display = 'none';
  }
}

function forceNumeric(evt, type) {
  let key;
  let theEvent = evt || window.event;
  if (theEvent.type === 'paste') { // Handle paste
    key = theEvent.clipboardData.getData('text/plain');
  } else {
    key = theEvent.keyCode || theEvent.which; // Handle key press
    key = String.fromCharCode(key);
  }
  var regex = /[0-9]/;
  if(!regex.test(key) || isNaN(key)) {
    theEvent.returnValue = false;
    theEvent.preventDefault();
    return false;
  }
}

function selectAvatar(avatar) {
  document.getElementById('profileImage').value = avatar.name;
  const avatars = document.getElementsByClassName('avatarButton');
  for (i = 0; i < avatars.length; i++) {
    avatars[i].classList.remove('avatarBorder');
  }
  avatar.classList.add('avatarBorder');
}

function highlightUserAvatar() {
  let avatarValue = ".avatarButton[name=" + document.getElementById('profileImage').value + "]";
  document.querySelector(avatarValue).classList.add('avatarBorder');
}

function sendContactEmail() {
  let name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
  let email = document.getElementById('contactEmail').value;
  let subject = document.getElementById('contactSubject').value;
  let text = document.getElementById('contactTextArea').value;
  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "kswodeck@yahoo.com",
    Password : "F4382D25C5C4A0AA224EFC64D8C120EC5082",
    To : "kristofferswodeck@live.com",
    From : "kmswodeck@gmail.com",
    Subject : "Contact Us Submission - " + subject,
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 250px; max-width: 800px; padding: 3% 0; margin: auto"><h1 style="color: #be0b2f; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><h3 style="color: darkblue; font-size: 20px; margin-bottom: 10px">From: ' + name + ' (' + email + ')</h3><p>You received a new contact us form submission:<br>' + '"' + text + '"' + '</p></div></html>'
  }).then(() => document.getElementById('contactUsForm').submit());
}