document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#all-view").style.display = "block";
    if (JSON.parse(document.getElementById("loggedIn").textContent) == "True") {
      document.querySelector("#compose-view").style.display = "block";
    }
    else {
      document.querySelector("#compose-view").style.display = "none";
    }
    if (document.querySelector("#following")) {
        document.querySelector("#following").addEventListener("click", () => load_posts("following", 1));
    }
    if (document.querySelector("#userProfile")) {
        document.querySelector("#userProfile").addEventListener("click", () => load_posts(JSON.parse(document.getElementById("user_id").textContent), 1));
    }
    document.querySelector("#all").addEventListener("click", () => load_posts("home", 1));
    document.querySelector("#compose-view").addEventListener("submit", post);
    load_posts("home", 1);
});
    /*  
      API Calls send to URl, which then directs to views function. 
      Views function then sends a JSON response which is then 
      handled by network.js
    */

function post(event) {
    event.preventDefault();
    let _user = JSON.parse(document.getElementById("user_id").textContent);
    let _content = document.querySelector("#post-body").value;
    fetch("/new_post", {
        method: "POST",
        body: JSON.stringify({
            user: _user,
            content: _content,
        }),
    })
    .then((response) => response.json())
    .then((result) => {
        location.reload();
    });
}

function load_posts(view, page) {
    let username = JSON.parse(
        document.getElementById("user_username").textContent
    );
    document.querySelector("#all-view").style.display = "block";
    if (view == "following") {
        document.querySelector("#all-view").innerHTML = `<h3 class="my-3 text-center white">Following</h3>`;
        document.querySelector("#compose-view").style.display = "none";
        if (document.querySelector("#profile-header")){
          document.querySelector("#profile-header").style.display = "none";
        }        
        document.querySelector("#all-view").style.display = "block";
    } 
    else if (view == "home") {
        document.querySelector("#all-view").innerHTML = `<h3 class="my-3"></h3>`;
        if (JSON.parse(document.getElementById("loggedIn").textContent) == "True") {
          document.querySelector("#compose-view").style.display = "block";
        }
        else {
          document.querySelector("#compose-view").style.display = "none";
        }      
        if (document.querySelector("#profile-header")){
          document.querySelector("#profile-header").style.display = "none";
        }
        document.querySelector("#all-view").style.display = "block";
    } 
    else {
      if (document.querySelector("#profile-header")){
        document.querySelector("#profile-header").style.display = "block";
      }
        document.querySelector("#profile-side").innerHTML = "";
        document.querySelector("#all-view").innerHTML = ``;
        document.querySelector("#compose-view").style.display = "none";
        fetch(`profile/${view}`)
        .then((response) => response.json())
        .then((profile) => {
            const profileView = document.createElement("div");
            profileView.className = "border text-center profile-box";
            profileView.id = `profile-header`;
            profileView.innerHTML = 
            `
            <h3>${profile.username}</h3>
            <hr>
            <p id="follower-count"><strong>${profile.followers}</strong> Followers</p>
            <p id="following-count">Following <strong>${profile.following}</strong></p>

            `;
            document.querySelector("#profile-side").append(profileView);
            if (profile.loggedIn && profile.notownProfile) {
                if (profile.isFollowing) {
                    const followBtn = document.createElement("button");
                    followBtn.id = "follow-btn";
                    followBtn.className = "btn btn-success";
                    followBtn.innerHTML = "Unfollow";
                    followBtn.addEventListener("click", function () {
                        updateFollow(profile.username);
                    });
                    document.getElementById("profile-header").append(followBtn);
                } 
                else {
                    const followBtn = document.createElement("button");
                    followBtn.id = "follow-btn";
                    followBtn.className = "btn btn-success";
                    followBtn.innerHTML = "Follow";
                    followBtn.addEventListener("click", function () {
                        updateFollow(profile.username);
                    });
                    document.getElementById("profile-header").append(followBtn);
                }
            }
        });
    }
    fetch(`/posts/${view}/${page}`)
    .then((response) => response.json())
    .then((response) => {
        //Load Posts
        response.posts.forEach((post) => {
            const postView = document.createElement("div");
            postView.className = "post-container";
            postView.id = `content-${post.post_id}`;
            postView.innerHTML = 
            `
                <div class="row">
                <div class="post-view border" id="inner-post-${post.post_id}">
                    <h4><a href="#" onClick="(function(){ load_posts('${post.id}',1); return false;})();return false;" id="${post.user}-profile">${post.user}</a></h4>
                    <div class="float-right" id="editBtn-container-${post.post_id}"></div>
                    <P id="${post.post_id}" >${post.content}</p>
                    <hr>
                    <p class="float-left">${post.timestamp}</p>
                    <p class="float-right mx-2" id="likesId-${post.post_id}">${post.likes}</p>
                </div>
                </div>
            `;
            document.getElementById("all-view").append(postView);
            //Edit Button
            if (response.loggedIn) {
                if (post.user == username) {
                    const editImg = document.createElement("img");
                    editImg.src = "/static/network/84380.png";
                    editImg.id = `editBtn-${post.post_id}`;
                    editImg.className = "float-right edit-img";
                    editImg.addEventListener("click", function () {
                        edit_post(post.post_id, post.content);
                    });
                    const heartBtn = document.createElement("div");
                    heartBtn.id = `likeBtn-${post.post_id}`;
                    heartBtn.className = "heart-like-button float-right";
                    document.getElementById(`inner-post-${post.post_id}`).append(heartBtn);
                    document.getElementById(`editBtn-container-${post.post_id}`).prepend(editImg);
                    }
                //Like Button
                else {
                    const heartBtn = document.createElement("div");
                    heartBtn.id = `likeBtn-${post.post_id}`;
                    heartBtn.className = "heart-like-button float-right";
                    if (post.liked_by.length > 0){
                        for(let i = 0; i < post.liked_by.length; i++){
                            if (post.liked_by[i].username == username){
                            heartBtn.classList.add("liked");
                            }
                        }
                    }
                    heartBtn.addEventListener("click", function () {
                        like_post(post.post_id);
                        if (heartBtn.classList.contains("liked")) {
                            heartBtn.classList.remove("liked");
                        } 
                        else {
                            heartBtn.classList.add("liked");
                        }
                    });
                    document.getElementById(`inner-post-${post.post_id}`).append(heartBtn);
                }
            }
            else {
                const heartBtn = document.createElement("div");
                heartBtn.id = `likeBtn-${post.post_id}`;
                heartBtn.className = "heart-like-button float-right";
                document.getElementById(`inner-post-${post.post_id}`).append(heartBtn);
            }
        });
        //Pagination view
        if (response.num_pages > 1) {
            const paginationView = document.createElement("div");
            paginationView.className = "pagination-view text-center";
            paginationView.id = "pagination-view";
            //Prev Button
            if (page > 1) {
                const prevView = document.createElement("div");
                prevView.innerHTML = 
                `
                <button class="mx-1 btn btn-sm btn-light" id="pageBtn">Prev</button>
                `;
                prevView.addEventListener("click", function () {
                    load_posts(view, page - 1);
                });
                paginationView.append(prevView);
            }
            //Page Buttons
            for (let i = 1; i < response.num_pages + 1; i++) {
                const numView = document.createElement("div");
                numView.innerHTML = 
                `
                <button class="mx-1 btn btn-sm btn-light" id="pageBtn">${i}</button>
                `;
                numView.addEventListener("click", function () {
                    load_posts(view, i);
                });
                paginationView.append(numView);
            }
            //Next Button
            if (page < response.num_pages) {
                const prevView = document.createElement("div");
                prevView.innerHTML = 
                `
                <button class="mx-1 btn btn-sm btn-light" id="pageBtn">Next</button>
                `;
                prevView.addEventListener("click", function () {
                    load_posts(view, page + 1);
                });
                paginationView.append(prevView);
            }
            document.querySelector("#all-view").append(paginationView);
        }
    });
}

function edit_post(post_id, original_content) {
    document.getElementById(`editBtn-${post_id}`).remove();
    let content_to_edit = document.getElementById(`${post_id}`);
    let container_to_edit = document.getElementById(`editBtn-container-${post_id}`);
    //Edit textarea
    const edit_box = document.createElement("textarea");
    edit_box.id = `post_edit`;
    edit_box.innerHTML = original_content;
    //Save button
    const save_edit = document.createElement("button");
    save_edit.innerHTML = "Save";
    save_edit.id = "saveBtn";
    save_edit.className = "my-1 btn btn-outline-success btn-sm"
    save_edit.addEventListener("click", function () {
        fetch(`/post_update/${post_id}`, {
            method: "PUT",
            body: JSON.stringify({
                content: document.getElementById("post_edit").value,
            }),
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.msg == "Saved.") {
                let new_content = document.createElement("p");
                new_content.id = post_id;
                new_content.innerHTML = result.new_content;
                document.getElementById("post_edit").replaceWith(new_content);
                const editImg = document.createElement("img");
                editImg.src = "/static/network/84380.png";
                editImg.id = `editBtn-${post_id}`;
                editImg.className = "float-right edit-img";
                editImg.addEventListener("click", function () {
                    edit_post(post_id, result.new_content);
                });
                document.getElementById("saveBtn").replaceWith(editImg);        
            } 
            else {
                alert(result.msg);
            }
        });
    });
    //Replace elements
    content_to_edit.replaceWith(edit_box);
    container_to_edit.append(save_edit);
}

function like_post(post_id) {
    fetch(`/like_post/${post_id}`, {
        method: "PUT",
        body: JSON.stringify({
            content: JSON.parse(document.getElementById("user_id").textContent),
        }),
    })
    .then((response) => response.json())
    .then((result) => {
        document.getElementById(`likesId-${post_id}`).innerHTML =
            result.like_count;
    });
}

function updateFollow(profile) {
    let _user = JSON.parse(document.getElementById("user_id").textContent);
    fetch("/updateFollowing", {
        method: "POST",
        body: JSON.stringify({
            currentUser: _user,
            targetUser: profile,
        }),
    })
    .then((response) => response.json())
    .then((result) => {
        if (result.status == 0) {
            document.getElementById(`follow-btn`).innerHTML = "Follow";
        } else if (result.status == 1) {
            document.getElementById(`follow-btn`).innerHTML = "Unfollow";
        }
        document.getElementById(`follower-count`).innerHTML = `<strong>${result.followers}</strong> Followers`;
        document.getElementById(`following-count`).innerHTML = `Following <strong>${result.following}</strong>`;
    });
}
