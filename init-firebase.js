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
        document.getElementById('functionBody').innerHTML = `            <div class="functions">
        <label for="comment">Comment (20 to 250 characters):</label>
        <textarea rows=”5” cols=”40” id="commentBox" minlength="4" maxlength="250" value=””></textarea>
        <button type="submit" id="submitComment">Comment</button>
    </div>`
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
    postListRef = database.ref(`users/-LiM8-p3Y6J4KZBTpkXO`)
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
                    submitComment.innerHTML = "Submitted"
                    // Data saved successfully!
                }
            });
    }
}

var commentsRef = firebase.database().ref(`users/-LiM8-p3Y6J4KZBTpkXO`);

function updateComments() {
    let commentsRef = database.ref('users/');
    commentsRef.on('value', function (snapshot) {
        console.log(commentsRef, snapshot.val())
    });
}
