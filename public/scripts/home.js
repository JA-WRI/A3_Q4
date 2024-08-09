//diplaying the current date and time
function getCurrentDate() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date();
    document.getElementById("datetime").innerHTML = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + "\n" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
setInterval(getCurrentDate, 1000);


//will automatically get called when submit button is pressed
document.getElementById('form').addEventListener("submit",
    function (event) {
        let form = document.forms["form"];
        for (let i = 0; i < form.elements.length; i++) {
            if (form.elements[i].tagName === 'INPUT') {
                if (!form.elements[i].value.trim()) {
                    event.preventDefault(); // Prevent form submission
                    return alert('Cannot submit the form with an empty field ');
                }
            }
        }
        if (checkBoxValidation() === 0) {
            event.preventDefault(); // Prevent form submission
        }
        if (ValidateSelectedRadio() === 0) {
            event.preventDefault(); // Prevent form submission
        }
    });

function checkBoxValidation() {
    const formData = new FormData(document.getElementById('form'));
    const checkedOptions = formData.getAll('GetAlongWith[]');
    if (checkedOptions.length === 0) {
        document.getElementById('errorMessage5').innerHTML = 'Please select at least one option.';
        return 0;
    }
    else {
        return true;
    }

}

function ValidateSelectedRadio() {
    let selected = document.querySelector('input[name="gender"]:checked');
    let selected2 = document.querySelector('input[name="animal"]:checked');
    let val = true;
    if (!selected) {
        document.getElementById('errorMessage4').innerHTML = 'Please select one option.';
        val = 0;
    }
    if (!selected2) {
        document.getElementById('errorMessage3').innerHTML = 'Please select one option.';
        val = 0;
    }
    return val;
}


//reset
document.getElementById('form').addEventListener("reset",
    function (event) {
        document.getElementById('errorMessage5').innerHTML = '';
        document.getElementById('errorMessage4').innerHTML = '';
        document.getElementById('errorMessage3').innerHTML = '';
    });

document.getElementById("createAccountForm").addEventListener("submit", (event) => validateCreation(event));
function validateCreation(event) {
    console.log("Validating creation");
    const form = document.forms['createAccountForm'];
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let isValid = true;
    if (!/^[A-Za-z0-9]+$/.test(username)) {
        alert('Invalid username format. Only letters and digits are allowed.');
        isValid = false;
    }

    if (!/(?=.*\d)(?=.*[a-zA-Z]).{4,}/.test(password)) {
        alert('Invalid password format. Must be at least 4 characters long, include at least one letter and one digit.');
        isValid = false;
    }
    if (!isValid) {
        event.preventDefault();
    }
    return isValid;
};
