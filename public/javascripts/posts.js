const postTextArea = document.getElementById('postTextArea');
const postUpdateButton = document.getElementById('postUpdateButton');
let postTextVal = postTextArea.value;

function enablePostEdit(user) {
  if (user && user != 'false' && postTextArea.disabled == true) {
    postTextArea.disabled = false;
  }
}

function disablePostEdit(user) {
  if (user && user != 'false') {
    postTextArea.disabled = true;
  }
}

function handleContent() {
  setTimeout(() => {
    postTextArea.style.height = 'auto'; 
    postTextArea.style.height = postTextArea.scrollHeight + 'px'; 
    if (postTextVal == postTextArea.value) {
      postUpdateButton.disabled = true;
      return false; //not valid
    } else {
      postUpdateButton.disabled = false;
      return true; //valid
    }
  }, 50);
}