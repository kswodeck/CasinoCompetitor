const accountInputs = document.getElementsByClassName('my-account');
const firstNameValue = accountInputs[0].value;
const lastNameValue = accountInputs[1].value;
const emailValue = accountInputs[2].value;
const usernameValue = accountInputs[3].value;
const phoneValue = accountInputs[4].value;
const birthdayValue = accountInputs[5].value;

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
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
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

  function validateAccountUpdate() { //can share some functions with AccountCreate
    const inputs = document.getElementsByClassName('my-account');
    const validitySpans = document.getElementsByClassName('valid-content');
    const invalidList = document.getElementById('invalid-fields-list');
    const accountInputs = document.getElementsByClassName('my-account');
    validateInputs(invalidList, inputs, validitySpans);
    if (accountInputs[0].value == firstNameValue && accountInputs[1].value == lastNameValue && accountInputs[2].value == emailValue &&
      accountInputs[3].value == usernameValue && accountInputs[4].value == phoneValue && accountInputs[5].value == birthdayValue) {
        const item = document.createElement('li');
        item.className = 'invalid-list';
        item.innerText = 'You must make changes before trying to update info';
        invalidList.appendChild(item); 
        return false;
      }
    enableAllInputs(inputs);
  }

  function validatePasswordUpdate() { //can share some functions with AccountCreate
    const inputs = document.getElementsByClassName('password');
    const validitySpans = document.getElementsByClassName('update-password-content');
    const invalidList = document.getElementById('invalid-update-password');
    const password = document.getElementById('updatePassword');
    const repeatPassword = document.getElementById('repeatUpdatePassword');
    validateInputs(invalidList, inputs, validitySpans);
    validatePassMatch(password, repeatPassword, validitySpans[1], validitySpans[2], invalidList)
    return;
  }

function validateInputs(invalidList, inputs, validitySpans) {
    while (invalidList.hasChildNodes()) {
        invalidList.removeChild(invalidList.lastChild);
      }
    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].checkValidity()) {
            validitySpans[i].innerText = '✖';
            validitySpans[i].style.color = 'crimson';
        } else {
            validitySpans[i].innerText = '✓';
            validitySpans[i].style.color = 'green';
        }
        validitySpans[i].style.display = 'inline-block';
    }
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