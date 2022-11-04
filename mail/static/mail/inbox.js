document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send);

  // By default, load the inbox
  load_mailbox('inbox');
});

function send(event) {
  event.preventDefault();

  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(() => load_mailbox('sent'))
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<hr><h3 class="my-3">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><hr>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      emails.forEach(email => {
        const emailView = document.createElement('div');
        emailView.className = "border";
        email.read ? emailView.className = "email-card read" : emailView.className = "email-card unread"
        emailView.innerHTML = 
        `
        <h6>${email.sender}</h6>
        <h5>${email.subject}</h5>
        <p>${email.timestamp}</p>
        `;
        emailView.addEventListener('click', function() {
            view_email(email.id)
        });
        document.querySelector('#emails-view').append(emailView);
      });
  });
}

function view_email(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  div = document.querySelector('#email-content');

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);
      div.innerHTML = 
      `
      <div class="email-container" id="email-container">
      <h6>From: ${email.sender}</h6>
      <h6>To: ${email.recipients}</h6>
      <h5>Subject: ${email.subject}</h5>
      <p>${email.timestamp}</p>
      <hr>
      <p class="email-body">${email.body}</p>
      <hr>
      </div>
      `;

      //If did not send the email
      if (JSON.parse(document.getElementById('user_email').textContent) != email.sender){
        //Reply Button
        const replyBtn = document.createElement('button');
        replyBtn.id = "reply-btn";
        replyBtn.className = "btn btn-sm mx-2 btn-outline-primary";
        replyBtn.innerHTML = "Reply";
        replyBtn.addEventListener('click', function() {
          //Send reply
          compose_email();
          document.querySelector('#compose-recipients').value = email.sender;
          email.subject.startsWith("Re:") ? document.querySelector('#compose-subject').value = email.subject : document.querySelector('#compose-subject').value = "Re: " + email.subject;
          document.querySelector('#compose-body').value = "\n\n    On: " + email.timestamp + ", " + email.sender + " wrote: \n\n         "  + email.body; 
        });
        document.querySelector('#email-container').append(replyBtn)

        //Archive Button
        const archiveBtn = document.createElement('button');
        archiveBtn.id = "archive-btn";
        archiveBtn.className = "btn btn-sm mx-2 btn-outline-primary";
        archiveBtn.innerHTML = email.archived ? "Unarchive" : "Archive";
        archiveBtn.addEventListener('click', function() {
          fetch(`/emails/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: !email.archived
            })
          })
          .then(() => load_mailbox('inbox'))
        });
        document.querySelector('#email-container').append(archiveBtn)
      }
      
  });
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  div.style.display = 'block';
}
