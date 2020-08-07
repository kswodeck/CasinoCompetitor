function enablePostEdit() {
  console.log(document.getElementById('postTextArea'));
  document.getElementById('postTextArea').disabled = false;
}

function disablePostEdit() {
  console.log(document.getElementById('postTextArea'));
  document.getElementById('postTextArea').disabled = true;
}