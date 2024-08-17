document.getElementById('loginButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('content').classList.add('blurred');
});

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('content').classList.remove('blurred');
});

document.getElementById('SignUpButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('SignUp-container').style.display = 'block';
    document.getElementById('content').classList.add('blurred');
});

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('SignUp-container').style.display = 'none';
    document.getElementById('content').classList.remove('blurred');
});

function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${year}/${month}/${day}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        document.getElementById('currentDate').textContent = formattedDate;
    });