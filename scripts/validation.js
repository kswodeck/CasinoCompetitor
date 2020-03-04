const inputs = document.getElementsByClassName('create-account-input');
const validitySpans = document.getElementsByClassName('valid-content');
const invalidList = document.getElementById('invalid-fields-list');
const newEmail = document.getElementById('newEmail');
const newPassword = document.getElementById('newPassword');
const repeatPassword = document.getElementById('repeatPassword');

function validateAcccountCreate() {
    function addToInvalidList(str, el) {
        const item = document.createElement('li');
        item.className = 'invalid-list';
        item.innerText = str;
        invalidList.appendChild(item);
        el.innerText = '✖';
        el.style.color = 'crimson';
    }
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
    if (newPassword.value != repeatPassword.value) {
        addToInvalidList('* passwords must match', validitySpans[2]);
        validitySpans[3].innerText = '✖';
        validitySpans[3].style.color = 'crimson';
    }
}