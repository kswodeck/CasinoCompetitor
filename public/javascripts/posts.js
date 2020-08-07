function enablePostEdit(user) {
  if (user && user != 'false') {
    document.getElementById('postTextArea').disabled = false;
  }
}

function disablePostEdit(user) {
  if (user && user != 'false') {
    document.getElementById('postTextArea').disabled = true;
  }
}