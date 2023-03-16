const passwordInput = document.getElementById('password');
const checkPasswordButton = document.getElementById('checkPassword');
const passwordStrength = document.getElementById('passwordStrength');
const myAlert = document.querySelector('.alert')
const theSvg = document.querySelector('#mysvg');
const alertDiv = document.querySelector('#alert-div')
checkPasswordButton.addEventListener('click', function() {
    const password = passwordInput.value;
    myAlert.style.display = 'inline-block'
    const strength = getPasswordStrength(password);
    passwordStrength.textContent = `${strength}`;

    // Check if the password has been breached
    checkPasswordBreached(password);
});

function getPasswordStrength(password) {
    let strength = '';
    if (password.length < 8) {
        strength = 'weak';
        myAlert.classList.remove('alert-success')
        myAlert.classList.remove('alert-warning')
        myAlert.classList.add('alert-error');
    } else if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
        strength = 'strong';
        myAlert.classList.remove('alert-error')
        myAlert.classList.remove('alert-warning')
        myAlert.classList.add('alert-success');
    } else {
        strength = 'medium';
        myAlert.classList.remove('alert-success')
        myAlert.classList.remove('alert-error')
        myAlert.classList.add('alert-warning');
    }
    return strength;
}


async function checkPasswordBreached(password) {
    const hashedPassword = sha1(password); // Hash the password using SHA-1
    const prefix = hashedPassword.slice(0, 5); // Get the first 5 characters of the hash
    const suffix = hashedPassword.slice(5); // Get the remaining characters of the hash
    const url = `https://api.pwnedpasswords.com/range/${prefix}`; // Construct the URL for the API

    try {
        const response = await fetch(url); // Make a GET request to the API
        const data = await response.text(); // Get the response as text
        const breachedPasswords = data.split('\r\n'); // Split the response by line breaks

        // Check if the password hash appears in the list of breached passwords
        for (let i = 0; i < breachedPasswords.length; i++) {
            const hash = breachedPasswords[i].split(':')[0];
            const count = breachedPasswords[i].split(':')[1];
            if (hash === suffix) {
                passwordStrength.textContent += ` (Breached ${count} times)`;
                return;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function sha1(str) {
    // Function to hash a string using SHA-1
    const buffer = new TextEncoder('utf-8').encode(str);
    return crypto.subtle.digest('SHA-1', buffer).then(hash => {
        return hex(hash);
    });
}

function hex(buffer) {
    // Function to convert a buffer to a hexadecimal string
    const hexCodes = [];
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hexCodes.push(paddedValue);
    }
    return hexCodes.join('');
}
