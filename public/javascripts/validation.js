const titleTag = document.getElementsByTagName('title')[0];
if (titleTag.innerText == 'My Account') {
  var accountInputs = document.getElementsByClassName('my-account');
  var firstNameValue = accountInputs[0].value;
  var lastNameValue = accountInputs[1].value;
  var emailValue = accountInputs[2].value;
  var usernameValue = accountInputs[3].value;
  var phoneValue = accountInputs[4].value;
  var birthdayValue = accountInputs[5].value;
}

function validateAccountCreate() {
    const inputs = document.getElementsByClassName('account-input');
    const invalidList = document.getElementById('invalid-fields-list');
    const newPassword = document.getElementById('newPassword');
    const repeatPassword = document.getElementById('repeatPassword');
    validateInputs(invalidList, inputs)
    validatePassMatch(newPassword, repeatPassword, invalidList)
}

function validateAccountLogin() {
  const inputs = document.getElementsByClassName('login-input');
  const invalidList = document.getElementById('invalid-login');
  return validateInputs(invalidList, inputs);
}

function validateAccountUpdate() {
    const invalidList = document.getElementById('invalid-fields-list');
    while (invalidList.hasChildNodes()) {
      invalidList.removeChild(invalidList.lastChild);
    }
    const item = document.createElement('li');
    if (accountInputs[0].value == firstNameValue && accountInputs[1].value == lastNameValue && accountInputs[2].value == emailValue &&
      accountInputs[3].value == usernameValue && accountInputs[4].value == phoneValue && accountInputs[5].value == birthdayValue) {
        item.className = 'invalid-list';
        item.innerText = 'Please make changes before trying to update info';
        invalidList.appendChild(item);
        return false;
      } else {
        item.className = 'valid-list';
        item.innerText = 'Account has been updated';
      }
      return validateInputs(invalidList, accountInputs);
}

function validatePasswordUpdate() {
    var inputs = document.getElementsByClassName('updatePassInput');
    var invalidList = document.getElementById('invalid-update-password');
    var oldPassword = document.getElementById('oldPassword');
    var updatePassword = document.getElementById('updatePassword');
    var repeatPassword = document.getElementById('repeatNewPassword');
    while (invalidList.hasChildNodes()) {
      invalidList.removeChild(invalidList.lastChild);
    }
    let match = true;
    let oldNewMatch = false;
    let isValid = true;
    isValid = validateInputs(invalidList, inputs);
    match = validatePassMatch(updatePassword, repeatPassword, invalidList);
    if (oldPassword.value == updatePassword.value || oldPassword.value == repeatPassword.value) {
      addToInvalidList('* old and new passwords must be different', invalidList);
      oldNewMatch = true;
    }
    if (!match) {
      return false;
    } else if (oldNewMatch) {
      return false;
    } else {
      setTimeout(function() { // good way of setting error message if there's only 1 more possible error
        addToInvalidList('* Current Password is incorrect', invalidList);
      }, 1500);
      return true;
    }
}

function validatePasswordChange() {
    let inputs = document.getElementsByClassName('changePassInput');
    let invalidList = document.getElementById('invalid-change-password');
    let updatePassword = document.getElementById('changePassword');
    let repeatPassword = document.getElementById('repeatChangePassword');
    while (invalidList.hasChildNodes()) {
      invalidList.removeChild(invalidList.lastChild);
    }
    let match = true;
    let isValid = true;
    isValid = validateInputs(invalidList, inputs);
    match = validatePassMatch(updatePassword, repeatPassword, invalidList);
    if (!match) {
      return false;
    } else {
      return true;
    }
}

function validatePreLogin(inputClass, list) {
    const inputs = document.getElementsByClassName(inputClass);
    const invalidList = document.getElementById(list);
    var empty = false;
    var valid = validateInputs(invalidList, inputs);
    for (let i = 0; i<inputs.length; i++) {
      if (!inputs[i].value) {
        console.log('empty input')
        empty=true;
        inputs[i].style.borderWidth = '0.06em';
      }
    }
    let lastInput = inputs[inputs.length-1];
    if (empty == true) {
      addToInvalidList('* please fill out all fields', lastInput, invalidList);
      return false;
    } else if (valid == false) {
      return false
    }
    return true;
}

function validateInputs(invalidList, inputs) {
  let validity = true;
    while (invalidList.hasChildNodes()) {
        invalidList.removeChild(invalidList.lastChild);
      }
    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].checkValidity()) {
            validity = false;
        }
        inputs[i].style.borderWidth = '0.06em';
    }
    return validity;
}

function addToInvalidList(str, el, invalidList) {
  console.log('adding as invalid');
  const item = document.createElement('li');
  item.className = 'invalid-list';
  item.innerText = str;
  invalidList.appendChild(item);
  el.style.borderWidth = '0.06em';
}

function validateKeys(evt, type) {
  var theEvent = evt || window.event;
  if (theEvent.type === 'paste') {     // Handle paste
      key = event.clipboardData.getData('text/plain');
  } else {
      var key = theEvent.keyCode || theEvent.which; // Handle key press
      key = String.fromCharCode(key);
  }
  var regex = /[0-9]|\./;
  if (type == 'tel') {
      regex = /[0-9]|[-]|[+]|[(]|[)]|[ ]/;
  }
  if(!regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function validatePassMatch(password, repeatPassword, invalidList) {
    if (password.value != repeatPassword.value) {
        addToInvalidList('* passwords must match', password, invalidList);
        repeatPassword.style.borderWidth = '0.06em';
        return false;
    }
}