import './common.js';

// const postTextArea = document.getElementById('postTextArea');
var postTitle = document.getElementById('postTitle');
var postTextArea = document.getElementById('editor-container');
if (document.getElementsByTagName('title')[0].innerText != 'Create New Post') {
  var editPostButton = document.getElementById('editPostButton');
  var postTextVal = postTextArea.innerText; //.value
  var postTitleVal = postTitle.value;
  }

function enablePostEdit(user='false') {
  if (user !='false' && document.getElementsByClassName('ql-editor').length < 1) {
    var quill = new Quill('#editor-container', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'blockquote', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }]
        ]
      },
      placeholder: 'type your post content here...',
      theme: 'snow'
    });
    var form = document.getElementById('postForm');
    form.onsubmit = function() { // Populate hidden form on submit
      var textInput = document.getElementById('textInput');
      textInput.value = JSON.stringify(quill.getContents());
      console.log("Submitted", form.serialize(), form.serializeArray());
      alert('Open the console to see the submit data!')
    return false;
    };
  }
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      postTextArea.setAttribute('onkeydown', handleContent(event, this, user));
    }, 200);
  }, false);
    postTitle.disabled = false;
}

function handleContent(evt=null, el=postTextArea, user='false', input1=postTextArea, input2=postTitle) {
  let theEvent = evt || window.event;
  setTimeout(() => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    el.blur();
    if (evt && theEvent.code != 'Tab') {
      el.focus();
    }
    if (user != 'new' && user != 'false') {
      if (postTextVal == input1.innerText && postTitleVal ==  input2.value) {
        editPostButton.disabled = true;
      } else if (postTextVal != input1.innerText || postTitleVal !=  input2.value) {
        editPostButton.disabled = false;
      }
    }
  }, 150);
}

window.enablePostEdit = enablePostEdit; window.handleContent = handleContent;

export * from './posts.js';