const postTextArea = document.getElementById('postTextArea');
const editPostButton = document.getElementById('editPostButton');
let postTextVal = postTextArea.value;
let postLength = postTextArea.length;

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