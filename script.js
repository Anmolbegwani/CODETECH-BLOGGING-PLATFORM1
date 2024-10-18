document.addEventListener('DOMContentLoaded', function () {
    const users = {};
    let isAuthenticated = false;
    let currentUser = '';
    let posts = [];
    let postIdCounter = 1; // Counter for unique post IDs

    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const authWrapper = document.getElementById('auth-wrapper');
    const createPost = document.getElementById('create-post');
    const navLinks = document.getElementById('nav-links');
    const navLinksAuth = document.getElementById('nav-links-auth');
    const blogPosts = document.getElementById('blog-posts');
    const commentSection = document.getElementById('comment-section');

    // Sign Up
    document.getElementById('signup-submit').addEventListener('click', function () {
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const dob = document.getElementById('signup-dob').value;
        const gender = document.getElementById('signup-gender').value;

        if (username && email && password && dob && gender) {
            // Check if the email is already registered
            if (users[email]) {
                alert('This email is already registered. Please log in.');
                return;
            }

            // Store user details
            users[email] = {
                username: username,
                password: password,
                dob: dob,
                gender: gender
            };
            alert('Sign up successful! Please log in.');
            signupBox.style.display = 'none';
            loginBox.style.display = 'block';
        } else {
            alert('Please fill in all the fields.');
        }
    });

    // Handle Log In
    document.getElementById('login-submit').addEventListener('click', function () {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (users[email] && users[email].password === password) {
            isAuthenticated = true;
            currentUser = users[email].username;
            authWrapper.style.display = 'none';
            createPost.style.display = 'block';
            navLinks.style.display = 'none';
            navLinksAuth.style.display = 'block';
            displayPosts();
        } else {
            alert('Invalid email or password.');
        }
    });

    // Log Out
    document.getElementById('logout-btn').addEventListener('click', function () {
        isAuthenticated = false;
        currentUser = '';
        authWrapper.style.display = 'block';
        createPost.style.display = 'none';
        navLinks.style.display = 'block';
        navLinksAuth.style.display = 'none';
        commentSection.style.display = 'none';
    });

    // Create Post
    document.getElementById('create-post-btn').addEventListener('click', function () {
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        if (title && content) {
            const post = {
                id: postIdCounter++,
                title: title,
                content: content,
                author: currentUser,
                comments: []
            };
            posts.push(post);
            displayPosts();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Display Posts
    function displayPosts() {
        blogPosts.innerHTML = ''; // Clear previous posts
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>By <strong>${post.author}</strong></p>
                <p>${post.content}</p>
                <button class="edit-post" data-id="${post.id}">Edit</button>
                <button class="delete-post" data-id="${post.id}">Delete</button>
                <button class="comment-post" data-id="${post.id}">Comments</button>
                <div class="post-comments" id="comments-${post.id}">
                    <h3>Comments:</h3>
                    <div class="comments-container" id="comments-container-${post.id}"></div>
                </div>
            `;
            blogPosts.appendChild(postElement);
        });
        addEditDeleteListeners();
        addCommentListeners();
    }

    // Edit and Delete functionality
    function addEditDeleteListeners() {
        document.querySelectorAll('.edit-post').forEach(button => {
            button.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const post = posts.find(p => p.id == postId);
                if (post.author === currentUser) {
                    const newTitle = prompt('Edit title:', post.title);
                    const newContent = prompt('Edit content:', post.content);
                    if (newTitle && newContent) {
                        post.title = newTitle;
                        post.content = newContent;
                        displayPosts();
                    }
                } else {
                    alert('You can only edit your own posts!');
                }
            });
        });

        document.querySelectorAll('.delete-post').forEach(button => {
            button.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const postIndex = posts.findIndex(p => p.id == postId);
                if (posts[postIndex].author === currentUser) {
                    if (confirm('Are you sure you want to delete this post?')) {
                        posts.splice(postIndex, 1);
                        displayPosts();
                    }
                } else {
                    alert('You can only delete your own posts!');
                }
            });
        });
    }

    // Comment functionality
    function addCommentListeners() {
        document.querySelectorAll('.comment-post').forEach(button => {
            button.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const post = posts.find(p => p.id == postId);
                commentSection.style.display = 'block';

                document.getElementById('submit-comment').onclick = function () {
                    const commentText = document.getElementById('comment-text').value;
                    const rating = document.getElementById('comment-rating').value;

                    if (commentText) {
                        post.comments.push({ user: currentUser, text: commentText, rating: rating });
                        displayComments(post);
                    } else {
                        alert('Please write a comment.');
                    }
                };
            });
        });
    }

    // Display Comments
    function displayComments(post) {
        const commentsContainer = document.getElementById(`comments-container-${post.id}`);
        commentsContainer.innerHTML = '';
        post.comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.user}</strong> (${comment.rating} Stars): ${comment.text}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }

    // Show Sign Up and Login Forms
    document.getElementById('show-signup').addEventListener('click', function () {
        loginBox.style.display = 'none';
        signupBox.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', function () {
        signupBox.style.display = 'none';
        loginBox.style.display = 'block';
    });
});
