document.addEventListener('DOMContentLoaded', function() {
    //Initial State
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#all-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';
    //Add event listener to button
    document.querySelector('#compose-view').addEventListener('submit', post);
    load_posts('home');
    window.addEventListener('popstate', (event) => { 
        console.log(event.state);
        location.reload();
    });
  });

  //API call to new_post in urls
  function post(event) {
    //Orevent defualt button press
    event.preventDefault();
    //Get user id from index.html
    let _user = JSON.parse(document.getElementById('user_id').textContent);
    //Get content from form
    let _content = document.querySelector('#post-body').value;
    //API call
    fetch('/new_post', {
        method: 'POST',
        body: JSON.stringify({
            user: _user,
            content: _content,
        })
    })
    //API Result
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        
    });
  }

  function load_posts(user) {
    // Show the mailbox and hide other views
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#all-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';
  
    fetch(`/posts/${user}`)
    .then(response => response.json())
    .then(response => {
        response.forEach(post => {
          const postsView = document.createElement('div');
          postsView.className = "border";
          postsView.id = "post-view";
          postsView.innerHTML = 
          `
          <h6><a href="profile/${post.id}">${post.user}</a></h6>
          <h5>${post.content}</h5>
          <p>${post.timestamp}</p>
          <p>${post.likes}</p>
          `;
          console.log(response);
          document.querySelector('#all-view').append(postsView);
        });
    });
  }

