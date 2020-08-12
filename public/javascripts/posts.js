import './common.js';

const postTextArea = document.getElementById('postTextArea');
if (document.getElementsByTagName('title')[0].innerText != 'Create New Post') {
var editPostButton = document.getElementById('editPostButton');
var textAreaInput = document.getElementsByClassName('postTextInput');
var postTextVal = postTextArea.value;
}

function enablePostEdit(user) {
  if (user && user != 'false' && postTextArea.disabled == true) {
    postTextArea.disabled = false;
  }
}

function disablePostEdit(user) {
  if (user && user != 'false' && postTextArea.disabled == false) {
    postTextArea.disabled = true;
  }
}

function handleContent(user='new', input=postTextArea) {
  setTimeout(() => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    input.blur()
    input.focus()
    if (user != 'new') {
      if (postTextVal == input.value && user != 'false') {
        editPostButton.disabled = true;
      } else if (postTextVal != input.value && user != 'false') {
        editPostButton.disabled = false;
      }
    }
  }, 50);
}

function validatePostEdit(user) {
  if (user && user != 'false' && postTextArea.disabled == false) {
    const postInvalidList = document.getElementById('invalid-post-list');
    disablePostEdit(user);
    return validateInputs(postInvalidList, textAreaInput, 'editPostButton', 800, ['postTextArea'], [postTextArea.value]);
  }
}

window.enablePostEdit = enablePostEdit; window.handleContent = handleContent;
window.validatePostEdit = validatePostEdit;

export * from './posts.js';