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
    const validitySpans = document.getElementsByClassName('valid-content');
    const invalidList = document.getElementById('invalid-fields-list');
    const newPassword = document.getElementById('newPassword');
    const repeatPassword = document.getElementById('repeatPassword');
    validateInputs(invalidList, inputs, validitySpans)
    validatePassMatch(newPassword, repeatPassword, validitySpans[4], validitySpans[5], invalidList)
}

function addToInvalidList(str, el, invalidList) {
    const item = document.createElement('li');
    item.className = 'invalid-list';
    item.innerText = str;
    invalidList.appendChild(item);
    el.innerText = '✖';
    el.style.color = 'crimson';
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

  function validateAccountUpdate() {
    const validitySpans = document.getElementsByClassName('valid-content');
    const invalidList = document.getElementById('invalid-fields-list');
    enableAllInputs(accountInputs);
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
      return validateInputs(invalidList, accountInputs, validitySpans);
  }

  function validatePasswordUpdate() {
    let validitySpans = document.getElementsByClassName('update-password-content');
    let invalidList = document.getElementById('invalid-update-password');
    let oldPassword = document.getElementById('oldPassword');
    let updatePassword = document.getElementById('updatePassword');
    let repeatPassword = document.getElementById('repeatNewPassword');
    while (invalidList.hasChildNodes()) {
      invalidList.removeChild(invalidList.lastChild);
    }
    let match = true;
    let oldNewMatch = false;
    match = validatePassMatch(updatePassword, repeatPassword, validitySpans[1], validitySpans[2], invalidList);
    if (oldPassword.value == updatePassword.value || oldPassword.value == repeatPassword.value) {
      addToInvalidList('* old and new passwords must be different', validitySpans[0], invalidList);
      validitySpans[0].innerText = '✖';
      validitySpans[0].style.color = 'crimson';
      oldNewMatch = true;
    }
    if (match == false) {
      return false;
    } else if (oldNewMatch == true) {
      return false;
    } else {
      return true;
    }
  }

function validateInputs(invalidList, inputs, validitySpans) {
  let validity = true;
    while (invalidList.hasChildNodes()) {
        invalidList.removeChild(invalidList.lastChild);
      }
    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].checkValidity()) {
            validity = false;
            validitySpans[i].innerText = '✖';
            validitySpans[i].style.color = 'crimson';
        } else {
            validitySpans[i].innerText = '✓';
            validitySpans[i].style.color = 'green';
        }
        validitySpans[i].style.display = 'inline-block';
    }
    return validity;
}

  function validatePassMatch(password, repeatPassword, passEl, repeatPassEl, invalidList) {
    if (password.value != repeatPassword.value) {
        addToInvalidList('* passwords must match', passEl, invalidList);
        repeatPassEl.innerText = '✖';
        repeatPassEl.style.color = 'crimson';
        return false;
    }
  }

function enableAllInputs(inputs) {
  for (let i=0; i< inputs.length; i++) {
    if (inputs[i].hasAttribute('disabled')) {      
      inputs[i].removeAttribute('disabled');
    }
  }
}