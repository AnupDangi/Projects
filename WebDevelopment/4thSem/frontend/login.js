document.addEventListener('DOMContentLoaded', function() {
    const loginText = document.querySelector(".title-text .login");
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.querySelector("form .signup-link a");
    const signupForm = document.getElementById('signupForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'An error occurred during login');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userLoggedIn', 'true');
                alert(data.message);
                window.location.href = 'http://127.0.0.1:5500/frontend/index.html';
            } else {
                alert(data.message || 'Login failed. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message);
        });
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            document.getElementById('login').checked = true;
            loginForm.style.marginLeft = '0%';
            loginText.style.marginLeft = "0%";
            this.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred during signup: ' + error.message);
        });
    });

    signupBtn.onclick = function() {
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
    };

    loginBtn.onclick = function() {
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
    };

    signupLink.onclick = function() {
        signupBtn.click();
        return false;
    };   

});