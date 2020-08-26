/* refactored 8/3/2020 */
var documentIsReady = new Promise(resolve => {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      resolve(5);
    }
  };
});

import {badWords} from '/javascripts/words.js';
const container = document.getElementById('mid-container');
const pageTitle = document.getElementsByTagName('title')[0];
const hamContent = document.getElementById('navbar-content');
const mainDropdown = document.getElementById('mainDropdown');
const backdrop = document.getElementsByClassName('backdrop')[0];
const loginDialog = document.getElementById('loginDialog');
const invalidList = document.getElementById('invalid-fields-list');
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
  var avatarImage = document.getElementById('profileImage');
  documentIsReady.then(() => {
    selectAvatar(avatarImage);
  });
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
      if (pageTitle.innerText == 'My Account') {
        container.style.display = 'none';
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

function toggleHamburger() {
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
  clearValidityMessages();
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
    if (inputs[i].tagName != 'DIV' && !inputs[i].checkValidity()) {
      if (!inputs[i].value) {
        empty = true;
      }
      validity = false;
    } else if (inputs[i].tagName != 'DIV' && inputs[i].type == 'email') {
      if (!emailIsValid(inputs[i].value)) {
        inputs[i].style.borderColor = '#be0b2f';
        validity = false;
      }
    } else if ((inputs[i].getAttribute('id').includes('sername') && pageTitle.innerText.includes('Account'))
    || inputs[i].type == 'textarea' || inputs[i].getAttribute('id').includes('ostTitle') && !isProfane) {
      isProfane = checkProfanity(inputs[i].value);
    } else if (inputs[i].tagName == 'DIV' && inputs[i].className.includes('postEditor')) {
      isProfane = checkProfanity(inputs[i].innerHTML);
    }
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

function checkProfanity(text) {
  for (let i = 0; i < badWords.length; i++) { //goes through imported badWords string array from words.js
    if (text.includes(badWords[i])) { // if text includes any of the defined profanities
      return badWords[i]; // returns the first profane word that was found (return is now truthy)
    }
  }
  return false; //return false (falsey) if no profanities are within the text.
}

function disableAfterSubmit(elId, time=1000) {
  let el = document.getElementById(elId);
  setTimeout(() => el.disabled = true, 50); //disable button before another click/interactiion can be made
  setTimeout(() => el.disabled = false, time); //re-enable button (after 1000 ms is default)
}

function removeWhiteSpace(inputs) {
  for (let i = 0; i < inputs.length; i++) { //goes through all inputs that were passed in
    let inputType = inputs[i].getAttribute('type'); //input type = password will not recieve white space trimming
    while (inputs[i].value.startsWith(' ') && inputType != 'password') { //detects if the 1st char is a space until no spaces remain
      inputs[i].value = inputs[i].value.substr(1); //removes the space and sets new input value
    }
    while (inputs[i].value.endsWith(' ') && inputType != 'password') { //detects if the last char is a space until no spaces remain
      inputs[i].value = inputs[i].value.replace(inputs[i].value.slice(-1),''); //removes the space and sets new input value
    }
  }
}

function storeValues(inputs=[], values=[]) { //for storing user's input values into local storage to use later
  for (let i = 0; i < values.length; i++) { //goes through all input array values that were passed in
    if (localStorage.getItem(inputs[i])) { //if the input already exists
      localStorage.removeItem(inputs[i]); //remove it and its value from local storage
    }
    localStorage.setItem(inputs[i], values[i]); //set the new value for the input in local storage
  }
}

function getFormValues(selector, names) { //retrieving input values from local storage and setting as default form values
  if (localStorage.length > 0) { //goes through local storage
    const inputs = document.getElementsByClassName(selector); //gets inputs based on passed class name selector
    for (let i = 0; i < inputs.length; i++) { //goes through inputs
      let storedVal = localStorage.getItem(names[i]); //retrieves values of inputs in local storage based on passed names
      if (storedVal != null && storedVal != undefined) inputs[i].value = storedVal; //if a value exists set it for the form input
    }
  }
}

function addToInvalidList(msg, el, list) { //for showing that an input was invalid (failed validatity check)
  const item = document.createElement('li'); //create a list item
  item.className = 'invalid-list'; //list item has "invalid"/red styling
  item.innerText = msg; //set the list item message as the passed msg
  list.appendChild(item); //add the list item to the passed invalid list
  el.style.borderWidth = '0.06em'; //give the invalid input a thicker border
}

function clearValidityMessages() {
  let invalidMessages = document.getElementsByClassName('invalid-list');
  let validMessages = document.getElementsByClassName('valid-list');
  while (invalidMessages.length > 0) {
    invalidMessages[0].remove(); // clear all negative messages
  }
  while (validMessages.length > 0) {
    validMessages[0].remove(); // clear all postive message
  }
}

function forceNumeric(evt, type) { //stops non numeric chars from being used, requiring numbers
  let key;
  let theEvent = evt || window.event;
  if (theEvent.type === 'paste') { // Handle paste if a paste occured
    key = theEvent.clipboardData.getData('text/plain'); // store pasted data as key
  } else {
    key = theEvent.keyCode || theEvent.which; // Handle key press
    key = String.fromCharCode(key); // store typed data as key
  }
  var regex = /[0-9]/; //numeric regex
  if (!regex.test(key) || isNaN(key)) { //if key fails regex numeric test or is not a number
    theEvent.returnValue = false; //don't return the value of the key
    theEvent.preventDefault(); //prevent input
    return false;
  }
}

function selectAvatar(avatar=avatarImage) { //for styling of selected avatar in my account or register pages
  if (avatar == avatarImage) {
    avatar = document.querySelector('.avatarButton[name=' + avatarImage.value + ']');
  } else {
    avatarImage.value = avatar.name;
  }
  const avatars = document.getElementsByClassName('avatarButton');
  for (let i = 0; i < avatars.length; i++) {
    avatars[i].classList.remove('avatarBorder'); //remove styling of previously selected avatar
  }
  avatar.classList.add('avatarBorder'); //add styling for newly selected avatar
}

function sendForgotPWEmail(email, id, username) { //emails don't go to yahoo and likely others
  let link = window.location.origin + '/forgotpass/' + id;
  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "kswodeck@yahoo.com",
    Password : "F4382D25C5C4A0AA224EFC64D8C120EC5082",
    To : email,
    From : "kmswodeck@gmail.com",
    Subject : "Forgotten Password Recovery",
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 300px; max-width: 1000px; padding: 3% 0; margin: auto"><h1 style="color: #be0b2f; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><p>Hi <strong>' + username + '!</strong> You requested to recover a misplaced password<br>Click the link below to create a new password for your account</p><a style="color: darkblue; font-size: 20px" href="' + link + '">Create New Password</a></div></html>'
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
    Body : '<html><div style="text-align: center; background-color: #D1D7E5; width: 70%; min-width: 300px; max-width: 1000px; padding: 3% 0; margin: auto"><h1 style="color: #be0b2f; font-size: 28px; margin-bottom: 25px">Casino Competitor</h1><h3 style="color: darkblue; font-size: 20px; margin-bottom: 10px">From: ' + name + ' (' + email + ')</h3><p>You received a new contact us form submission:<br>' + '"' + text + '"' + '</p></div></html>'
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