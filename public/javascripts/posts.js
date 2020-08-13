import './common.js';

const postTitle = document.getElementById('postTitle');
const postTextArea = document.getElementById('postTextArea');
if (document.getElementsByTagName('title')[0].innerText != 'Create New Post') {
var editPostButton = document.getElementById('editPostButton');
var textAreaInput = document.getElementsByClassName('postTextInput');
var postTextVal = postTextArea.value;
var postTitleVal = postTitle.value;
}

function enablePostEdit(user='false') {
  if (user && user != 'false') {
    postTextArea.disabled = false;
    postTitle.disabled = false;
  }
}

function disablePostEdit(user='false') {
  if (user && user != 'false') {
    postTextArea.disabled = true;
    postTextArea.disabled = true;
  }
}

function handleContent(el=postTextArea, user='false', input1=postTextArea, input2=postTitle) {
  setTimeout(() => {
    input1.style.height = 'auto';
    input1.style.height = input1.scrollHeight + 'px';
    el.blur()
    el.focus()
    if (user != 'new' && user != 'false') {
      if (postTextVal == input1.value && postTitleVal ==  input2.value) {
        editPostButton.disabled = true;
      } else if (postTextVal != input1.value || postTitleVal !=  input2.value) {
        editPostButton.disabled = false;
      }
    }
  }, 100);
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