document.getElementById('updateTaskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskId = this.dataset.taskId;
    const title = document.getElementById('inputField').value;
    const description = document.getElementById('inputDescription').value;
    const completed = document.getElementById('cbx-12').checked;

    const data = {
        title: title,
        description: description,
        completed: completed
    };

    fetch(`/update_task/${taskId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/todolist/';
        } else {
            alert('There was an error updating the task.');
        }
    })
    .catch (error => {
        console.error('Error parsing JSON:', error);
    });
});

document.getElementById('cancel').addEventListener('click', function() {
    window.location.href = '/todolist/';
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}