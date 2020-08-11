import './common.js';

const postTextArea = document.getElementById('postTextArea');
const editPostButton = document.getElementById('editPostButton');
const textAreaInput = document.getElementsByClassName('postTextInput');
const postInvalidList = document.getElementById('invalid-post-list');
let postTextVal = postTextArea.value;

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

function handleContent(user) {
  setTimeout(() => {
    postTextArea.style.height = 'auto';
    postTextArea.style.height = postTextArea.scrollHeight + 'px';
    postTextArea.blur()
    postTextArea.focus()
    if (postTextVal == postTextArea.value && user != 'false') {
      editPostButton.disabled = true;
    } else if (postTextVal != postTextArea.value && user != 'false') {
      editPostButton.disabled = false;
    }
  }, 50);
}

function validateBlogEdit(user) {
  if (user && user != 'false' && postTextArea.disabled == false) {
    disablePostEdit(user);
    return validateInputs(postInvalidList,  textAreaInput, 'editPostButton')
  }
}

window.enablePostEdit = enablePostEdit; window.handleContent = handleContent;
window.validateBlogEdit = validateBlogEdit;

export * from './posts.js';