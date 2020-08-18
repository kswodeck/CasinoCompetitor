/* refactored 8/3/2020 */
import {badWords} from '/javascripts/words.js';
const container = document.getElementById('mid-container');
const pageTitle = document.getElementsByTagName('title')[0];
const hamContent = document.getElementById('navbar-content');
const mainDropdown = document.getElementById('mainDropdown');
const backdrop = document.getElementsByClassName('backdrop')[0];
const loginDialog = document.getElementById('loginDialog');
const invalidList = document.getElementById('invalid-fields-list');
const avatarImage = document.getElementById('profileImage');
const createAccountNames = ['firstName', 'lastName', 'email', 'username', 'password', 'newpassword', 'birthday', 'phone'];
const accountNames = ['firstName', 'lastName', 'email', 'username', 'birthday', 'phone'];
const loginNames = ['username', 'password'];
const forgotNames = ['email', 'birthday', 'phone'];
if (pageTitle.innerText == 'My Account') {
  var accountInputs = document.getElementsByClassName('my-account');
  var firstNameValue = accountInputs[0].value;
  var lastNameValue = accountInputs[1].value;
  var emailValue = accountInputs[2].value;
  var usernameValue = accountInputs[3].value;
  var birthdayValue = accountInputs[4].value;
  var phoneValue = accountInputs[5].value;
  var imageValue = accountInputs[6].value;
  setTimeout(() => highlightUserAvatar(), 200);
}

function restoreContainer() {
  if (event.code == 'Escape') {
    container.style.display = 'block';
  }
}

function displayLoginDialog(message){
  clearValidityMessages();
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
    if (typeof loginDialog.showModal === 'function') {
      if (!loginDialog.hasAttribute('open')) {
        let forgotUser = document.getElementById('forgotUserDialog');
        let forgotPW = document.getElementById('forgotPWDialog');
        if (forgotUser.hasAttribute('open')) {
          backFromDialog('forgotUserDialog');
          } else if (forgotPW.hasAttribute('open')) {
            backFromDialog('forgotPWDialog');
          } else {
            loginDialog.showModal();
          }
        }
      if (backdrop) {
        loginDialog.style.cssText = '';
        backdrop.style.cssText = '';
      }
      container.style.display = 'none';
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
}

function displayLogoutDialog(){
  const dialog = document.getElementById('logoutDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (backdrop) {
      dialog.style.cssText = '';
      backdrop.style.cssText = '';
    }
    container.style.display = 'none';
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function displayForgotDialog(newDialog, message){
    const dialog = document.getElementById(newDialog);
    let invalidList = document.getElementById('invalid-forgot-username');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      if (backdrop) {
        dialog.style.cssText = '';
        backdrop.style.cssText = '';
      }
      loginDialog.close();
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
      document.getElementById('loginDialogExit').setAttribute('onclick', "location.href='/'");
      forgotUserExit.setAttribute('onclick', "location.href='/login'");
      forgotPassExit.setAttribute('onclick', "location.href='/login'");
    }
    if (pageTitle.innerText == 'Login') {
      forgotUserExit.setAttribute('onclick', "location.href='/'");
      forgotPassExit.setAttribute('onclick', "location.href='/'");
    }
}

function exitDialog(currentDialog){
  clearValidityMessages();
  document.getElementById(currentDialog).close();
  container.style.display = 'block';
}

function backFromDialog(currentDialog){
  clearValidityMessages();
  document.getElementById(currentDialog).close();
  loginDialog.showModal();
  if (backdrop) {
    backdrop.style.cssText = '';
    loginDialog.style.cssText = '';
  }
}

function togglePasswordVisibility(passwordId, iconId){
  if (event.type == 'click' || event.code == 'Enter') {
    const passwordInput = document.getElementById(passwordId);
    const passwordIcon = document.getElementById(iconId);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
    passwordIcon.classList.toggle('fa-eye');
    passwordIcon.classList.toggle('fa-eye-slash');
  }
}

function displayDialog(dialog, message=false) {
  const curDialog = document.getElementById(dialog);
  if (!event || event.type == 'DOMContentLoaded' || event.type == 'click' || event.code == 'Enter') {
    if (typeof curDialog.showModal == 'function') {
      curDialog.showModal();
      if (backdrop) {
        curDialog.style.cssText = '';
        backdrop.style.cssText = '';
      }
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
    if (message != false) {
      document.getElementById('generalPostText').innerText = message;
    }
  }
}

function displayStreakDialog(streak){
  const dialog = document.getElementById('loginStreakDialog');
  const streakHeading = document.getElementById('streakHeading');
  const loginCoinSpan = document.getElementById('login-streak-win');
  if (typeof dialog.showModal == 'function') {
    dialog.showModal();
    if (backdrop) {
      dialog.style.cssText = '';
      backdrop.style.cssText = '';
    }
    setTimeout(() => {
      if (dialog.hasAttribute('open')) {
        window.location.reload();
      }
    }, 10000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  if (streak == '1' || streak == 1) {
    streakHeading.innerText = `You visited us ${streak} day in a row!`;
  } else {
    streakHeading.innerText = `You visited us ${streak} days in a row!`;
  }
  loginCoinSpan.innerText = `You earned ${streak*10} `;
}

function toggleHamburger(dropdown) {
  hamContent.classList.toggle('collapse');
  hamContent.classList.toggle('show');
  mainDropdown.classList.toggle('collapse');
  mainDropdown.classList.toggle('show');
}

function validateAccountCreate() {
  const inputs = document.getElementsByClassName('account-input');
  let values = [inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value, inputs[5].value, inputs[6].value, inputs[7].value];
  const newPassword = document.getElementById('newPassword');
  const repeatPassword = document.getElementById('repeatPassword');
  if (!validateInputs(invalidList, inputs, 'accountCreate', 1300, createAccountNames, values)) {
    return false;
  }
  return validatePassMatch(newPassword, repeatPassword, invalidList);
}

function validateAccountUpdate() {
  let values = [accountInputs[0].value, accountInputs[1].value, accountInputs[2].value, accountInputs[3].value, accountInputs[4].value, accountInputs[5].value];
  const item = document.createElement('li');
  if (values[0] == firstNameValue && values[1] == lastNameValue && values[2] == emailValue && values[3] == usernameValue &&
    values[4] == birthdayValue && values[5] == phoneValue && accountInputs[6].value == imageValue) {
      item.className = 'invalid-list';
      item.innerText = 'Please make changes before trying to update info';
      invalidList.appendChild(item);
      return false;
    } else {
      item.className = 'valid-list';
      item.innerText = 'Account has been updated';
    }
  return validateInputs(invalidList, accountInputs, 'accountUpdateButton', 1200, accountNames, values);
}

function validatePasswordUpdate() {
  const inputs = document.getElementsByClassName('updatePassInput');
  const invalidList = document.getElementById('invalid-update-password');
  const oldPassword = document.getElementById('oldPassword');
  const updatePassword = document.getElementById('updatePassword');
  const repeatPassword = document.getElementById('repeatNewPassword');
  if (!validateInputs(invalidList, inputs, 'passwordUpdateButton', 1000)) {
    return false;
  }   
  if (!validatePassMatch(updatePassword, repeatPassword, invalidList)) {
    return false;
  } else if (oldPassword.value == updatePassword.value) {
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
  const changePassword = document.getElementById('changePassword');
  const repeatPassword = document.getElementById('repeatChangePassword');
  if (!validateInputs(invalidList, inputs, 'passwordChangeButton', 1000)) {
    return false;
  } 
  return validatePassMatch(changePassword, repeatPassword, invalidList);
}

function validatePreLogin(inputClass, list, form) {
  const inputs = document.getElementsByClassName(inputClass);
  const invalidList = document.getElementById(list);
  let names = forgotNames;
  let values = [inputs[0].value, inputs[1].value];
  let disableButton = 'loginButton';
  if (document.getElementById('forgotPWDialog').open) {
    disableButton = 'forgotPWButton';
    values = [inputs[0].value, inputs[1].value, inputs[2].value];
  } else if (document.getElementById('forgotUserDialog').open) {
    disableButton = 'forgotUserButton';
    values = [inputs[0].value, inputs[1].value, inputs[2].value];
  } else {
    names = loginNames;
  }
  if (!validateInputs(invalidList, inputs, disableButton, 1200, names, values)) {
    return false;
  }
  return true;
}

function validateAccountDelete() {
  let invalidList = document.getElementById('invalid-verify-password');
  let inputs = document.getElementsByClassName('verifyPassInput');
  if (!validateInputs(invalidList, inputs, 'passwordVerifyDeleteButton', 1000)) {
    return false;
  }
  return true;
}

function validateContactUs() {
  let inputs = document.getElementsByClassName('account-input');
  if (!validateInputs(invalidList, inputs, 'contactUsButton', 1000)) {
    return false;
  }
  sendContactEmail();
}

function validatePassMatch(password, repeatPassword, invalidList) {
  if (password.value != repeatPassword.value) {
    addToInvalidList('* repeat password must match password', password, invalidList);
    repeatPassword.style.border = '0.06em solid #be0b2f';
    return false;
  }
  return true;
}

function validateInputs(invalidList, inputs, button, disableTime=1000, names=[], values=[]) {
  disableAfterSubmit(button, disableTime);
  if (invalidList != document.getElementById('invalid-post-list')) {
    removeWhiteSpace(inputs);
  }
  clearValidityMessages();
  let validity = true;
  let empty = false;
  let isProfane = false;
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
    } else if ((inputs[i].getAttribute('id').includes('sername') && pageTitle.innerText.includes('Account'))
    || inputs[i].type == 'textarea' || inputs[i].getAttribute('id').includes('ostTitle') && !isProfane) {
      isProfane = checkProfanity(inputs[i].value);
    }
    inputs[i].style.borderWidth = '0.06em';
  }
  storeValues(names, values);
  if (empty) {
    addToInvalidList('* please fill out all fields', inputs[inputs.length-1], invalidList);
    return false;
  } else if (!validity) {
    addToInvalidList('* all fields must be valid', inputs[inputs.length-1], invalidList);
    return false;
  } else if (isProfane) {
    addToInvalidList("* Please don't use profanity: " + isProfane, inputs[inputs.length-1], invalidList);
    return false;
  }
  return validity;
}
function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkProfanity(word) {
  for (let i = 0; i < badWords.length; i++) { //imported badWords from words.js
    if (word.includes(badWords[i])) {
      console.log(badWords[i]);
      return badWords[i];
    }
  }
  return false;
}

function disableAfterSubmit(button, time=1000) {
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

function storeValues(inputs=[], values=[]) {
  for (let i = 0; i < values.length; i++) {
    if (localStorage.getItem(inputs[i])) {
      localStorage.removeItem(inputs[i]);
    }
    localStorage.setItem(inputs[i], values[i]);
  }
}

function getFormValues(selector, names) {
  if (localStorage.length > 0) {
    const inputs = document.getElementsByClassName(selector);
    for (let i = 0; i < inputs.length; i++) {
      let storedVal = localStorage.getItem(names[i]);
      if (storedVal != null && storedVal != undefined) inputs[i].value = storedVal;
    }
  }
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
  while(invalidMessages.length > 0) {
    invalidMessages[0].remove();
  }
  while(validMessages.length > 0) {
    validMessages[0].remove();
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
  avatarImage.value = avatar.name;
  const avatars = document.getElementsByClassName('avatarButton');
  for (i = 0; i < avatars.length; i++) {
    avatars[i].classList.remove('avatarBorder');
  }
  avatar.classList.add('avatarBorder');
}

function highlightUserAvatar() {
  let avatarValue = ".avatarButton[name=" + avatarImage.value + "]";
  document.querySelector(avatarValue).classList.add('avatarBorder');
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
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 280px; max-width: 800px; padding: 3% 0; margin: auto"><h1 style="color: #be0b2f; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><p>Hi <strong>' + username + '!</strong> You requested to recover a misplaced password<br>Click the link below to create a new password for your account</p><a style="color: darkblue; font-size: 20px" href="' + link + '">Create New Password</a></div></html>'
  });
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
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 280px; max-width: 800px; padding: 3% 0; margin: auto"><h1 style="color: #be0b2f; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><h3 style="color: darkblue; font-size: 20px; margin-bottom: 10px">From: ' + name + ' (' + email + ')</h3><p>You received a new contact us form submission:<br>' + '"' + text + '"' + '</p></div></html>'
  }).then(() => document.getElementById('contactUsForm').submit());
}

window.restoreContainer = restoreContainer; window.displayLoginDialog = displayLoginDialog;
window.displayLoginDialog = displayLoginDialog; window.displayLogoutDialog = displayLogoutDialog;
window.exitDialog = exitDialog; window.backFromDialog = backFromDialog;
window.togglePasswordVisibility = togglePasswordVisibility; window.displayDialog = displayDialog;
window.displayStreakDialog = displayStreakDialog; window.toggleHamburger = toggleHamburger;
window.validateAccountCreate = validateAccountCreate; window.validateAccountUpdate = validateAccountUpdate;
window.validatePasswordUpdate = validatePasswordUpdate; window.validatePasswordChange = validatePasswordChange;
window.validatePreLogin = validatePreLogin; window.validateAccountDelete = validateAccountDelete;
window.validateContactUs = validateContactUs; window.validateInputs = validateInputs;
window.disableAfterSubmit = disableAfterSubmit; window.removeWhiteSpace = removeWhiteSpace;
window.getFormValues = getFormValues; window.forceNumeric = forceNumeric;
window.selectAvatar = selectAvatar; window.sendForgotPWEmail = sendForgotPWEmail;
window.displayForgotDialog = displayForgotDialog;
export * from './common.js';