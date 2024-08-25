document.addEventListener('DOMContentLoaded', function () {
    const formBox = document.querySelector('.form-box');
    const btn = document.getElementById('btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    let members = JSON.parse(localStorage.getItem('members')) || [
        {
            fullname: "Koussay Attaya",
            position: "Président",
            password: "koussay"
        },
        {
            fullname: "Mazen Toraa",
            position: "Responsable Formation",
            password: "mazen"
        },
        {
            fullname: "Nizar Kouki",
            position: "Assistant Fighter",
            password: "123"
        }
    ];

    window.login = function() {
        formBox.classList.remove('active');
        btn.style.left = '0';
    };

    window.signup = function() {
        formBox.classList.add('active');
        btn.style.left = '110px';
    };

    if (formBox && btn && loginForm && signupForm) {

        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const position = document.getElementById('position').value;
            const password = document.getElementById('password').value;
            members.push({ fullname, position, password });
            localStorage.setItem('members', JSON.stringify(members));
            e.target.reset();
            alert('🟢 Signup succeeded');
        });


        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loginName = document.getElementById('loginName').value;
            const loginPassword = document.getElementById('loginPassword').value;
            const member = members.find(member => 
                member.fullname && 
                member.fullname.toLowerCase() === loginName.toLowerCase() && 
                member.password === loginPassword
            );
            if (member) {
                localStorage.setItem('loginName', member.fullname);
                localStorage.setItem('position', member.position);
                window.location.href = 'feed.html';
            } else {
                alert('🛑 Invalid name or password');
            }
        });
    }

    const newPostForm = document.querySelector('.newPost');
    if (newPostForm) {
        newPostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const postText = document.getElementById('new-post-text').value.trim();
            if (postText !== "") {
                const loginName = localStorage.getItem('loginName') || 'Anonymous';
                const position = localStorage.getItem('position') || 'Unknown';

                const postItem = document.createElement('div');
                postItem.className = 'post';

                postItem.innerHTML = `
                    <div class="user-info">
                        <i class="fa fa-user avatar"></i>
                        <div class="user-details">
                            <h3>${loginName}</h3>
                            <p>${position}</p>
                        </div>
                    </div>
                    <p class="post-content">${postText}</p>
                    <div class="post-actions">
                        <button class="like-button"><i class="fa-regular fa-heart"></i></button>
                        <span class="like-count">0 Likes</span>
                        <button class="comment-button"><i class="fa-regular fa-comment"></i></button>
                        <span class="comment-count">0 Comments</span>
                    </div>
                    <div class="comments-section">
                        <input type="text" class="comment-input" placeholder="Write your comment here">
                        <button class="post-comment">Post</button>
                        <ul class="comments-list"></ul>
                    </div>
                `;

                document.querySelector('.posts').prepend(postItem);
                document.getElementById('new-post-text').value = "";
            }
        });

        document.addEventListener('click', function (event) {
            const target = event.target;
            const post = target.closest('.post');

            if (post) {
                if (target.classList.contains('like-button') || target.closest('.like-button')) {
                    handleLike(post);
                } else if (target.classList.contains('comment-button') || target.closest('.comment-button')) {
                    focusCommentInput(post);
                } else if (target.classList.contains('post-comment') || target.closest('.post-comment')) {
                    handleComment(post);
                }
            }
        });

        document.addEventListener('keypress', function (event) {
            if (event.target.classList.contains('comment-input') && event.key === 'Enter') {
                event.preventDefault();
                const post = event.target.closest('.post');
                handleComment(post);
            }
        });
    }

    function handleLike(post) {
        const likeBtn = post.querySelector('.like-button');
        const likeCountElem = post.querySelector('.like-count');
        var likeCount = parseInt(likeCountElem.innerText) || 0;
        var isLiked = likeBtn.querySelector('i').classList.contains('fa-solid');

        likeBtn.querySelector('i').className = isLiked ? 'fa-regular fa-heart' : 'fa-solid fa-heart';
        likeCount = isLiked ? likeCount - 1 : likeCount + 1;
        likeCountElem.innerText = `${likeCount} Likes`;
    }

    function focusCommentInput(post) {
        const commentInput = post.querySelector('.comment-input');
        commentInput.focus();
    }

    function handleComment(post) {
        const commentInput = post.querySelector('.comment-input');
        const commentText = commentInput.value.trim();

        if (commentText !== "") {
            const commentItem = document.createElement('li');
            commentItem.className = 'comment-item';

            const userInfoDiv = document.createElement('div');
            userInfoDiv.className = 'comment-user-info';

            const avatar = document.createElement('i');
            avatar.className = 'fa-solid fa-user comment-avatar';

            const userDetailsDiv = document.createElement('div');
            userDetailsDiv.className = 'comment-user-details';

            const userName = document.createElement('h3');
            userName.innerText = localStorage.getItem('loginName') || 'Anonymous';

            const userPosition = document.createElement('p');
            userPosition.innerText = localStorage.getItem('position') || 'Unknown';

            userDetailsDiv.appendChild(userName);
            userDetailsDiv.appendChild(userPosition);
            userInfoDiv.appendChild(avatar);
            userInfoDiv.appendChild(userDetailsDiv);

            const commentContent = document.createElement('p');
            commentContent.className = 'comment-content';
            commentContent.innerText = commentText;

            commentItem.appendChild(userInfoDiv);
            commentItem.appendChild(commentContent);

            const commentsList = post.querySelector('.comments-list');
            commentsList.appendChild(commentItem);

            commentInput.value = "";

            const commentCountElem = post.querySelector('.comment-count');
            var commentCount = parseInt(commentCountElem.innerText) || 0;
            commentCount++;
            commentCountElem.innerText = `${commentCount} Comments`;
        }
    }

    
    const membersList = document.getElementById('membersList');
    const searchInput = document.getElementById('searchUser');

    function renderMembers(filteredMembers) {
        membersList.innerHTML = '';
        filteredMembers.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';

            const memberInfo = document.createElement('div');
            memberInfo.className = 'member-info';

            const avatar = document.createElement('i');
            avatar.className = 'fa fa-user member-avatar';

            const memberDetails = document.createElement('div');
            memberDetails.className = 'member-details';

            const name = document.createElement('h3');
            name.textContent = member.fullname;

            const position = document.createElement('p');
            position.textContent = member.position;

            memberDetails.appendChild(name);
            memberDetails.appendChild(position);
            memberInfo.appendChild(avatar);
            memberInfo.appendChild(memberDetails);
            memberItem.appendChild(memberInfo);

            membersList.appendChild(memberItem);
        });
    }

    if (membersList && searchInput) {
        renderMembers(members);

        searchInput.addEventListener('input', function(e) {
            const searchText = e.target.value.toLowerCase();
            const filteredMembers = members.filter(member => 
                member.fullname.toLowerCase().includes(searchText)
            );
            renderMembers(filteredMembers);
        });
    }

    const eventBtn = document.getElementById('addEventBtn');
    eventBtn.addEventListener('click', function(){
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('date').value;
        const eventsList = document.getElementById('eventsList');
        newEvent = document.createElement('li');
        newEvent.className = 'event';
        newEvent.innerHTML = `
            <h4>${eventName}</h4>
            <p>${eventDate}</p>
        `;
        eventsList.appendChild(newEvent);

    })
});
