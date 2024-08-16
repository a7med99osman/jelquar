// For What Appear And Disapear
function HandleUiButtons() {
    document.addEventListener('DOMContentLoaded', function() {
        let loginButton = document.querySelector('.login');
        let registerButton = document.querySelector('.register');
        let logoutButton = document.querySelector('.logOut');
        let userNameInNav = document.querySelector(".userNameInNav")
        let addPost = document.querySelector(".addPost")
        
        let token = localStorage.getItem('token');


        // FOR EDIT BUTTON //


        setTimeout(()=>{
            let AllAddCommentBtn = document.querySelectorAll(".addComment")
            AllAddCommentBtn.forEach((div) => {
                if(token){
                    div.style.display = 'flex';
                }
                else{
                    div.style.display = 'none';
                }
            })
        },700)
    
    
        if (token) {
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';
            logoutButton.style.display = 'inline-block';
            userNameInNav.style.display = 'inline-block';
            userNameInNav.style.display = 'inline-block';
            addPost.style.display = 'inline-block';
            


        } else {
            loginButton.style.display = 'inline-block';
            registerButton.style.display = 'inline-block';
            logoutButton.style.display = 'none';
            userNameInNav.style.display = 'none';
            addPost.style.display = 'none';
            

        }
    
        logoutButton.addEventListener('click', function() {
            alert("Logged Out Successfully")
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('userId');
            localStorage.removeItem('userInfo');
            
        });
    });
}
HandleUiButtons();

function getPostsUser() {
    setTimeout(()=>{
        let HeaderPostLogoAndUser = document.querySelectorAll(".logoAndUser")
        HeaderPostLogoAndUser.forEach((div)=>{
            div.addEventListener("click" , function(){
                postid = div.getAttribute("fakeid")
                localStorage.setItem("userId" , postid)
                window.location = "./profile.html"
                
            })
        })
    }, 2000)

}
getPostsUser();

    
function hideEditBtn(){
    setTimeout(()=>{
        let userIdFromLocal = JSON.parse(localStorage.getItem("userInfo"))
        let editBtns = document.querySelectorAll(".editBtn")
        editBtns.forEach((btn) => {
            let fakeId = btn.getAttribute("fakeId")
            if (userIdFromLocal === null){
                btn.style.display = "none"

            }
            else if (Number(fakeId) !== userIdFromLocal.id) {
                btn.style.display = "none"
            }
        })
        let deleteBtns = document.querySelectorAll(".deleteBtn")
        deleteBtns.forEach((btn) => {
            let fakeId = btn.getAttribute("fakeId")
        
            if (userIdFromLocal === null){
                btn.style.display = "none"

            }
            else if (Number(fakeId) !== userIdFromLocal.id) {
                btn.style.display = "none"
            }
        })

    } , 2000 )
}
hideEditBtn();

// =====FOR GET POSTS FROM API =====//
let page = 1 ;
let currentPage = 0 ;
let lastPage = 0  ;
function getPosts (page) {  
    axios.get(`https://tarmeezacademy.com/api/v1/posts?page=${page}&limit=${2}`)
.then(function(res){
    posts = res.data.data
    // FOR CURRENT AND LAST PAGES
        currentPage = res.data.meta.current_page;
        lastPage = res.data.meta.last_page;
    // 
    let divPosts = document.querySelector(".divPosts")
    let userNameInNav = document.querySelector(".userNameInNav")

for (let post of posts) {
    let name = localStorage.getItem("name")
    userNameInNav.innerHTML =`@${name}` ;
    // For Null Title
    let title = ""
    if (post.title === null){
        title = "NoTitle"
    } else {title = post.title }
    // /////////////////////////////////////
    setTimeout(() => {
        

        divPosts.innerHTML += ` 
    <div class="post">
        <div class="headerPost">
        <div class="logoAndUser" fakeid="${post.author.id}">
            <img style="cursor: pointer;" src="${post.author.profile_image}" alt=""> <span style="cursor: pointer;" >${post.author.name}</span>
            </div>
                    <div  class="postBtns">
                    <button class="editBtn" fakeid="${post.author.id}"  onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    <button class="deleteBtn" fakeid="${post.author.id}" onclick="deletePost(${post.id})">Delete</button>
                    </div>
            </div>
            <hr>
        <div class="content">
            <img src="${post.image}" alt="">
            <p>${post.created_at}</p>
            <h2>${title}</h2>
            <p>${post.body}</p>
            <hr>
            <div class="footerPost">
                <div class="commentsHeader">
                    <img  src="./comment.svg" alt="">
                    <span >${post.comments_count} Comments</span>
                </div>
            </div> 
        
                    <div class="comments active" fakeid="${post.id}">
                            <div class="forComment" id="${post.id}">

                            </div>
                            <div class="addComment">
                                <input placeholder="Add Your Comment..." type="text">
                                <button class="AddCommentBtn" >Add Comment</button>
                            </div>
                            </div> 
                            </div>                   
                    </div>
        </div>
        </div>`
        
        
        axios.get(`https://tarmeezacademy.com/api/v1/posts/${post.id}`)
        .then((res) => {
        comments = res.data.data.comments     
        for (let comment of comments){
            
            let divContainer = document.getElementById(post.id)
            divContainer.innerHTML += `<div class="ForEachComment">
                                <div class="forLogoAndUser">
                                    <img src="${comment.author.profile_image}" alt="">
                                    <p>${comment.author.name}</p>
                                </div>
                            <p class="body">${comment.body}</p>
                            `
        }
            
                
    }
    )

        
        
            //  ===== FOR SHOW AND HIDE COMMENTS ====== //
             //  ===== FOR SHOW AND HIDE COMMENTS ====== //
                const commentDivs = document.querySelectorAll('.commentsHeader');
                commentDivs.forEach(div => {
                    div.addEventListener('click', (e) => {
                        const commentDivChild = document.querySelectorAll('.comments');
                        commentDivChild.forEach (div => {
                            div.classList.toggle("active")
                        })
                    
                    });
                });
    } , 1000)
    

}
})
}
getPosts();
// =====[FOR REACH BOTTOM & PAGIATION] ===== //
if (document.getElementById('home')) {
    window.onscroll = function() {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) {
                page = page + 1
                hideEditBtn();
                getPostsUser();
                
            if (currentPage === lastPage){
            }
            else{
                commentsShow();
                getPosts(page);
            }  
        }
    }
}


// For go to Login Page
function goToLogin() {
    window.open("./login.html")
}
// For go to Register page
function goToRegister() {
    window.open("./Register.html")
}
// For Login Page
function login() {
        let username = document.querySelector("#username")
        let password = document.querySelector("#password")
    let prams = {
    username : username.value,
    password : password.value
    }
    axios.post(("https://tarmeezacademy.com/api/v1/login"),prams)
    .then(function(response){
        localStorage.setItem("token" , response.data.token )
        localStorage.setItem("name" , response.data.user.name )
        localStorage.setItem("userId" , response.data.user.id )
        localStorage.setItem("userInfo" , JSON.stringify(response.data.user) )
        alert("LOGGED IN SUCCESSFULY")
        window.location = "./index.html"
    })
    .catch(Error => alert(Error.response.data.message))
    
}

// For Register Page
function Register() {
    let username = document.querySelector("#username")
    let password = document.querySelector("#password")
    let name = document.querySelector("#name")
    let image = document.querySelector("#ResgiterImage")

    let formData = new FormData()
        formData.append("username" , username.value )
        formData.append("password" , password.value )
        formData.append("name" , name.value )
        formData.append("image" , image.files[0] )

axios.post(("https://tarmeezacademy.com/api/v1/register"), formData )
.then(function(response){
    localStorage.setItem("token" , response.data.token )
    localStorage.setItem("name" , response.data.user.name )
    localStorage.setItem("userId" , response.data.user.id )
    localStorage.setItem("userInfo" , JSON.stringify(response.data.user) )
    alert("NEW USER REGISTER SUCCESSFULY")
    window.location = "./index.html"
})
.catch(Error => alert(Error.response.data.message))
}
//  For go to addPost page
function addPostPage() {
    window.open("./addpost.html")
}

// For Add post
function CreatePost() {
    let image = document.querySelector("#image")
    let body = document.querySelector("#body")
    let title = document.querySelector("#title")
    let token = localStorage.getItem("token")
    

    let formData = new FormData()
    formData.append("image" , image.files[0])
    formData.append("body" , body.value)
    formData.append("title" , title.value)

    let headers = {
        "authorization" : `Bearer ${token}`
    }

    axios.post("https://tarmeezacademy.com/api/v1/posts" , formData ,{
            headers: headers
    })
    .then(function(response){
        alert("Post Has Been Created")
        setTimeout(()=>{
            window.location= "./index.html"
        }, 1000)
    })
    .catch((error) => {
        alert(error.response.data.message)
    })
}

// For Add Comment
function commentsShow(){
    setTimeout(() => {
        let allbtns = document.querySelectorAll(".addComment button") ;

        allbtns.forEach((btn) => {
        
            btn.addEventListener("click" , () => {
            //  Prametrs To Add Comments
            let bodyContent = btn.previousElementSibling.value
            let id = btn.parentElement.parentElement.getAttribute("fakeid")
            let token = localStorage.getItem("token")
    
            let prams = {
                body : bodyContent
            }
            let headers = {
                "authorization" : `Bearer ${token}`
            }
    
            axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments` , prams ,{
                headers: headers
            })
            .then((response) => {
                alert("Comment Added")
                location.reload()
                
            })
                })
        })
    
    } , 1500)
}
commentsShow();


// For Edit Post
function editPost(postObject){
    // For Modal
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        }}
    //  ===========MODAL=========== //
    
    let post = JSON.parse(decodeURIComponent(postObject))
        modal.innerHTML = `  <div class="loginDiv">
                <h2>Edit Post</h2>
                <form action="">
        
                    <label for="title">Title :</label>
                    <input id="title" type="text" value="${post.title}">
        
                    <label for="body">Body :</label>
                    <textarea name="" id="body">${post.body}</textarea>
        
                    <label for="image">Image :</label>
                    <input id="image" type="file" value=${post.image} > 
        
                </form>
                <button type="button" id="btn2">Edit Post</button>
            </div>
            
        </div>`

    
            document.getElementById("btn2").addEventListener("click" , function(){
                
                let body = document.querySelector("#body")
                let title = document.querySelector("#title")
                let token = localStorage.getItem("token")
                
                let formData = new FormData()
                formData.append("body" , body.value)
                formData.append("title" , title.value)
                formData.append("_method" , "put")
                let headers = {
                    "authorization" : `Bearer ${token}`
                }
                axios.post(`https://tarmeezacademy.com/api/v1/posts/${post.id} ` , formData ,{
                        headers: headers
                })
                .then(function(response){
                    alert("Post Has Been Updated")
                    setTimeout(()=>{
                        window.location= "./index.html"
                    }, 1000)
                })
                .catch((error) => {
                    alert(error.response.data.message)
                })
            })
                    

        

    
}

// For Profile Page
function profilePage(){
    
    // =========For Header========= //
    let logoutButton = document.querySelector('.logOut');
    logoutButton.addEventListener("click" , function(){
        localStorage.clear()
        window.location = ("./index.html")
    })
    let userId = localStorage.getItem("userId")
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`)
    .then((response) => {
        userInfo = response.data.data

        
        if (userInfo.email === null){
            userInfo.email = "No Email"
        }
        setTimeout(()=>{
            document.querySelector(".userInfo").innerHTML = `
            <div class="userImage">
            <img src="${userInfo.profile_image}" alt="User Has No Image">
        </div>
        <div class="userInfos">
            <p>${userInfo.email}</p>
            <p>${userInfo.name}</p>
            <p>${userInfo.username}</p>
        </div>
        <div class="usersNums">
            <p>${userInfo.posts_count}<span>posts</span></p>
            <p>${userInfo.comments_count}<span>Comments</span></p>
        </div>
    ` 
        },1000)
    })




    


    


    // =========End Header========= //


    // ==========For User Posts============//
    let postsId = localStorage.getItem("userId") 

    axios.get(`https://tarmeezacademy.com/api/v1/users/${postsId}/posts`)
    .then((res) => {
        posts = res.data.data
        for (let post of posts) {
            
            // For Null Title
            let title = ""
            if (post.title === null){
                title = "NoTitle"
            } else {title = post.title }
            // /////////////////////////////////////
            setTimeout(() => {
                HandleUiButtons();
        
                document.querySelector(".userPosts").innerHTML += `
        
                <div class="post">
                    <div class="headerPost">
                <div class="logoAndUser"  fakeid="${post.author.id}">
                    <img src="${post.author.profile_image}" alt=""> <span>${post.author.name}</span>
                    </div>

                    <div  class="postBtns">
                    <button class="editBtn" fakeid="${post.author.id}"  onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    <button class="deleteBtn" fakeid="${post.author.id}" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                    </div>
                    <hr>
                <div class="content">
                    <img src="${post.image}" alt="">
                    <p>${post.created_at}</p>
                    <h2>${title}</h2>
                    <p>${post.body}</p>
                    <hr>
                    <div class="footerPost">
                        <div class="commentsHeader">
                            <img  src="./comment.svg" alt="">
                            <span >${post.comments_count} Comments</span>
                        </div>
                    </div> 
                
                            <div class="comments active" fakeid="${post.id}">
                                    <div class="forComment" id="${post.id}">
        
                                    </div>
                                    <div class="addComment">
                                        <input placeholder="Add Your Comment..." type="text">
                                        <button class="AddCommentBtn" >Add Comment</button>
                                    </div>
                                    </div> 
                                    </div>                   
                            </div>
                </div>
                    </div>
            
            `
                
                
                
                axios.get(`https://tarmeezacademy.com/api/v1/posts/${post.id}`)
                .then((res) => {
                comments = res.data.data.comments     
                for (let comment of comments){
                    
                    let divContainer = document.getElementById(post.id)
                    divContainer.innerHTML += `<div class="ForEachComment">
                                        <div class="forLogoAndUser">
                                            <img src="${comment.author.profile_image}" alt="">
                                            <p>${comment.author.name}</p>
                                        </div>
                                    <p class="body">${comment.body}</p>
                                    `
                }
                    
                        
            }
            )
        
                
                
                    //  ===== FOR SHOW AND HIDE COMMENTS ====== //
                const commentDivs = document.querySelectorAll('.commentsHeader');
                commentDivs.forEach(div => {
                    div.addEventListener('click', (e) => {
                        const commentDivChild = document.querySelectorAll('.comments');
                        commentDivChild.forEach (div => {
                            div.classList.toggle("active")
                        })
                    
                    });
                });
            } , 1000)
            
        
        }
    })

    function getPostsUser() {
        setTimeout(()=>{
            let HeaderPostLogoAndUser = document.querySelectorAll(".logoAndUser")
            HeaderPostLogoAndUser.forEach((div)=>{
            })
        }, 2000)
    
    }
    getPostsUser()


    
}

profilePage();

// ======ForProfileUser //
function clicked(){
    let realUserId = JSON.parse(localStorage.getItem("userInfo"))
    localStorage.setItem("userId" , realUserId.id)
    window.location ="./profile.html"
    HandleUiButtons();
}

// For Delete Post 
function deletePost(postid){
    let token = localStorage.getItem("token")
    let headers = {
        "authorization" : `Bearer ${token}`
    }
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postid}` , {
        headers: headers
})
    .then((response) => {
        alert("POST DELETED")
        setTimeout(()=>{
            window.location= "./index.html"
        }, 700)
    })
}





























