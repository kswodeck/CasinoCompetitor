import './common.js';

// const postTextArea = document.getElementById('postTextArea');
var documentIsReady = new Promise(resolve => {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      resolve(5);
    }
  }
});

var postTitle = document.getElementById('postTitle');
var postTextArea = document.getElementById('editor-container');
var editors = document.querySelectorAll('.postEditor');
if (document.getElementsByTagName('title')[0].innerText != 'Create New Post') {
  var editPostButton = document.getElementById('editPostButton');
  var postTextVal = postTextArea.innerText; //.value
  var postTitleVal = postTitle.value;
  }

function renderTextHtml(htmlText, parentEl, user='false', sameCommenter='NA') {
  documentIsReady.then(() => {
    let el = parentEl;
    if (sameCommenter == 'NA' && sameUser == 'true') {
      el = el.childNodes[0]; //not working for not sameuser textarea. Make sure text shows up
    }
    el.innerHTML = htmlText;
    el.innerHTML = el.innerText;
  }).then(() => {
    handleContent(null, parentEl, user, parentEl);
  })
}
  
function enablePostEdit(user='false', elId='editor-container') {
  let editorId = '#' + elId;
  let editor = document.querySelector(editorId);
  let placeholdText = 'type your comment here...';
  var form = editor.parentNode;
  var textInput = document.getElementById('commentTextInput' + elId.slice(15)); //uses the comment number from id
  if (editor.id.includes('addComment')) {
    textInput = document.getElementById('addCommentTextInput');
  }
  if (!editor.className.includes('Comment')) {
    textInput = document.getElementById('textInput');
    placeholdText = 'type your post content here...';
    form = form.parentNode;
    postTitle.disabled = false;
  }
  if (user !='false') {
      var quill = new Quill(editorId, {
        modules: {
          toolbar: [
            [{header: [2, 3, 4, 5, 6, false]}, [{'size': ['small', false, 'large', 'huge']}]],
            ['bold', 'italic', 'underline', 'strike', {'script': 'sub'}, {'script': 'super'}, 'link'],
            ['blockquote', { 'indent': '+1'}, {'direction': 'rtl'}, {list: 'ordered'}, {list: 'bullet'}],
            [{'color': []}, {'background': []}, {'align': []}, ['clean']]
          ]
        },
        placeholder: placeholdText,
        theme: 'snow'
      });
      documentIsReady.then(() => {
        form.onsubmit = function() { // Populate hidden form on submit
          textInput.value = editor.childNodes[0].innerHTML;
        };
      });
  }
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
  }, 100);
}

window.enablePostEdit = enablePostEdit; window.handleContent = handleContent;
window.renderTextHtml = renderTextHtml;

export * from './posts.js';