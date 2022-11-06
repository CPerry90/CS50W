document.addEventListener('DOMContentLoaded', function() {
    //Initial State
    document.querySelector('#all-view').style.display = 'block';
    if (document.querySelector('#following')) {
      document.querySelector('#following').addEventListener('click', () => load_posts('following',1));
    }
    if (document.querySelector('#userProfile')){
      document.querySelector('#userProfile').addEventListener('click', () => load_posts(JSON.parse(document.getElementById('user_id').textContent),1));
    }
    document.querySelector('#all').addEventListener('click', () => load_posts('home',1));    
    document.querySelector('#compose-view').addEventListener('submit', post);
    load_posts('home',1);
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
        location.reload();
    });
  }

  function load_posts(view, page) {
    let username = JSON.parse(document.getElementById('user_username').textContent);
    // Show the mailbox and hide other views
    document.querySelector('#all-view').style.display = 'block';
    if (view == "following"){
      document.querySelector('#all-view').innerHTML = `<h3 class="my-3">Following</h3>`;
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#profile-container').style.display = "none";
      document.querySelector('#all-view').style.display = "block";
    }
    else if (view == "home") {
      document.querySelector('#all-view').innerHTML = `<h3 class="my-3"></h3>`;
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector('#profile-container').style.display = "none";
      document.querySelector('#all-view').style.display = "block";
    }
    else {
      document.querySelector('#profile-container').innerHTML = `<h3 class="my-3">Profile</h3>`;
      document.querySelector('#all-view').innerHTML = ``;
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#profile-container').style.display = "block";
      fetch(`profile/${view}`)
      .then(response => response.json())
      .then(profile => {
        console.log(profile)
        const profileView = document.createElement('div');
        profileView.className = "border";
        profileView.id = `profile-header`
        profileView.innerHTML = 
        `
        <h3>${profile.username}</h3>
        <p id="follower-count">Followers: ${profile.followers}</p>
        <p id="following-count">Following: ${profile.following}</p>
        `;
        document.querySelector('#profile-container').append(profileView);
        if (profile.loggedIn && profile.notownProfile){
          if (profile.isFollowing) {
            const followBtn = document.createElement('button');
            followBtn.id = "follow-btn";
            followBtn.className = "btn btn-primary";
            followBtn.innerHTML = "Unfollow";
            followBtn.addEventListener('click', function() { updateFollow(profile.username) })
            document.querySelector('#profile-container').append(followBtn);
          }
          else {
            const followBtn = document.createElement('button');
            followBtn.id = "follow-btn";
            followBtn.className = "btn btn-primary";
            followBtn.innerHTML = "Follow";
            followBtn.addEventListener('click', function() { updateFollow(profile.username) })
            document.querySelector('#profile-container').append(followBtn);
          }
        }
      });
    }
    fetch(`/posts/${view}/${page}`)
    .then(response => response.json())
    .then(response => {
      console.log(response.posts);
      //Load Posts
        response.posts.forEach(post => {
          const emailView = document.createElement('div');
          emailView.className = "border";
          emailView.id = `content-${post.post_id}`
          emailView.innerHTML = 
          `
          <h6><a href="#" onClick="(function(){ load_posts('${post.id}',1); return false;})();return false;" id="${post.user}-profile">${post.user}</a></h6>
          <h5 id="${post.post_id}" >${post.content}</h5>
          <p>${post.timestamp}</p>
          <p id="likesId-${post.post_id}">${post.likes}</p>
          `;
          document.querySelector('#all-view').append(emailView);

          //Edit Button
          if (response.loggedIn){
            if (post.user == username){
              const editBtn = document.createElement('button');
              editBtn.innerHTML = "Edit";
              editBtn.id = `editBtn-${post.post_id}`;
              editBtn.className = "btn btn-primary";
              editBtn.addEventListener('click', function() { edit_post(post.post_id, post.content) })
              emailView.append(editBtn);
            }
            //Like Button
            else {
              const likeBtn = document.createElement('button');
              likeBtn.innerHTML = "Like";
              likeBtn.id = `likeBtn-${post.post_id}`;
              likeBtn.className = "btn btn-success";
              likeBtn.addEventListener('click', function() { like_post(post.post_id) })
              emailView.append(likeBtn);
            }
          }
        });
        //Pagination
        if (response.num_pages > 1) {
          const paginationView = document.createElement('div');
          paginationView.className = "pagniation-view";
          paginationView.id= "pagination-view";
          //Prev Button
          if (page > 1){
            const prevView = document.createElement('div');
            prevView.innerHTML = `
            <button class="btn btn-sm btn-outline-primary" id="pageBtn">Prev</button>
            `;
            prevView.addEventListener('click', function() {
              load_posts(view,page - 1)
            });
            paginationView.append(prevView);
          }
          //Page Buttons
          for (let i = 1; i < (response.num_pages + 1); i++) {
            const numView = document.createElement('div');
            numView.innerHTML = 
            `
            <button class="btn btn-sm btn-outline-primary" id="pageBtn">${i}</button>
            `;
            numView.addEventListener('click', function() {
              load_posts(view,i)
            });
            paginationView.append(numView);
          }
          //Next Button
          if (page < response.num_pages){
            const prevView = document.createElement('div');
            prevView.innerHTML = `
            <button class="btn btn-sm btn-outline-primary" id="pageBtn">Next</button>
            `;
            prevView.addEventListener('click', function() {
              load_posts(view,page + 1)
            });
            paginationView.append(prevView);
          }
          document.querySelector('#all-view').append(paginationView);
        }
    });
  }

  function edit_post(post_id, original_content) {
    document.getElementById(`editBtn-${post_id}`).remove();
    let content_to_edit = document.getElementById(`${post_id}`);
    let container_to_edit = document.getElementById(`content-${post_id}`);
    const edit_box = document.createElement('textarea');
    edit_box.id = "post_edit";
    edit_box.innerHTML = original_content;
    const save_edit = document.createElement('button')
    save_edit.innerHTML = "Save";
    save_edit.id = "saveBtn";
    save_edit.addEventListener('click', function() {
      fetch(`/post_update/${post_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            content: document.getElementById("post_edit").value
        })
      })
      .then(response => response.json())
      .then(result => {
        if(result.msg == "Saved.") {
          let new_content = document.createElement('h5')
          new_content.id = post_id;
          new_content.innerHTML = result.new_content;
          document.getElementById("post_edit").replaceWith(new_content);
          const editBtn = document.createElement('button');
          editBtn.innerHTML = "Edit";
          editBtn.id = `editBtn-${post_id}`;
          editBtn.className = "btn btn-primary";
          editBtn.addEventListener('click', function() { edit_post(post_id, result.new_content) })
          document.getElementById("saveBtn").replaceWith(editBtn);
        }
        else {
          alert(result.msg)
        }
          console.log(result);
      });
    });
    content_to_edit.replaceWith(edit_box); 
    container_to_edit.append(save_edit); 
  }

  function like_post(post_id){
    fetch(`/like_post/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          content: JSON.parse(document.getElementById('user_id').textContent)
      })
    })
    .then(response => response.json())
    .then(result => {
      document.getElementById(`likesId-${post_id}`).innerHTML = result.like_count;
      console.log(result.like_count)
    });

  }

  function updateFollow(profile) {
    let _user = JSON.parse(document.getElementById("user_id").textContent);
    console.log("Clicked");
    fetch("/updateFollowing", {
        method: "POST",
        body: JSON.stringify({
            currentUser: _user,
            targetUser: profile,
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if (result.status == 0){
              document.getElementById(`follow-btn`).innerHTML = "Follow";
            }
            else if (result.status == 1){
              document.getElementById(`follow-btn`).innerHTML = "Unollow";
            }
            document.getElementById(`follower-count`).innerHTML = `Followers: ${result.followers}`;
            document.getElementById(`following-count`).innerHTML = `Following: ${result.following}`;
        });
}

