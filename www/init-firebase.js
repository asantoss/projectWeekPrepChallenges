firebase.initializeApp(firebaseConfig);
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var btn = document.getElementById('login');

var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {

            modal.style.display = "none";
            return false;
        },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        updateComments();
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
        //Changes data on the document when the use is logged in.     
        document.getElementById('userName').innerHTML = `Welcome ${displayName}!`;
        btn.addEventListener('click', () => {
            firebase.auth().signOut().then(function () {
                btn.innerHTML = 'Login';
                document.getElementById('functionBody').innerHTML = ``;
                console.log('Signed Out');
            }, function (error) {
                console.error('Sign Out Error', error);
            });
        });
        btn.innerHTML = 'Sign Out';
        var submitComment = document.getElementById('submitComment')
        submitComment.addEventListener('click', () => {
            addComment(displayName, email, uid)
        })
    } else {
        btn.addEventListener('click', () => {
            modal.style.display = "block"
            ui.start('#firebaseui-auth-container', uiConfig);
        })
        // User is signed out.
        // ...
        document.getElementById('userName').innerHTML = `Javascript Project`
    }
});

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


var database = firebase.database();




function addComment(displayName, email, uid) {
    commentBox = document.getElementById('commentBox');
    postListRef = database.ref('users/')
    var postData = {
        author: displayName,
        uid: uid,
        body: commentBox.value,
    };
    if (commentBox.value.length > 1) {
        postListRef.push(
            postData, function (error) {
                if (error) {
                    // The write failed...
                    console.log(error)
                } else {
                    // Data saved successfully!
                }
            });
    }
    return updateComments();
}

var commentsRef = firebase.database().ref('users/');
// commentsRef.on('child_added', function (data) {
//     console.log(data.value)
// })

var commentsContainer = document.getElementById('commentSection');
// var commentsArray = [];
function fetchComments() {
    commentsRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            // ...
            commentHTML = `<div class="comment"><div><h5 class="comment_header">${childData.author}</h5><p class="comment_body">${childData.body}</p></div><div class="comment_links">
            <button onClick="removeComment('${childKey}')">Remove</button></div></div>`
            commentsArray.push(commentHTML);
        });
    });
}

function removeComment(commentID) {
    comment = firebase.database().ref(`users/${commentID}`)
    comment.remove();
    return updateComments();
}



function updateComments() {
    commentsArray = []
    fetchComments();
    setTimeout(() => {
        return commentsContainer.innerHTML = commentsArray.join('');
    }, 1000)
}


