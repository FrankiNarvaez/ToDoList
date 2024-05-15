var add = document.getElementById('addToDo');
var input = document.getElementById('inputField');
var toDoContainer = document.getElementById('toDoContainer');
const filterTasks = document.getElementById('filter-task');

add.addEventListener('click', addItem);
input.addEventListener('keypress',function(e){
    if(e.key=="Enter"){
        addItem();
    }
});

filterTasks.addEventListener('change', function() {
    const value = this.value;
    const allTasks = document.querySelectorAll('.item');

    allTasks.forEach(task => {
        switch(value) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'done':
                if (task.querySelector('input[type="checkbox"]').checked) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
            case 'todo':
                if (!task.querySelector('input[type="checkbox"]').checked) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
        }
    });
});

function addItem(e){
    if (input.value == '') {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You must write something!"
          });
    } else {
        const item_value  = input.value;
        const item = document.createElement('div');
        item.classList.add('item');

        const item_content = document.createElement('div');
        item_content.classList.add('content');

        item.appendChild(item_content);

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox-wrapper-12');

        const cbx = document.createElement('div');
        cbx.classList.add('cbx');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'cbx-12';

        const label = document.createElement('label');
        label.setAttribute('for', 'cbx-12');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('viewBox', '0 0 15 14');
        svg.setAttribute('height', '14');
        svg.setAttribute('width', '15');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M2 8.36364L6.23077 12L13 2');

        svg.appendChild(path);
        cbx.appendChild(checkbox);
        cbx.appendChild(label);
        cbx.appendChild(svg);
        checkboxWrapper.appendChild(cbx);

        checkbox.addEventListener('change', function(e) {
			e.stopPropagation(); // Detiene la propagación del evento
			if (this.checked) {
				input_item.classList.add('completed'); // Agregar la clase 'completed' al texto
			} else {
				input_item.classList.remove('completed'); // Eliminar la clase 'completed' del texto
			}
		});

        item_content.appendChild(checkboxWrapper);

        const input_item = document.createElement('input');
        input_item.classList.add('text');
        input_item.type = 'text';
        input_item.value = item_value;
        input_item.setAttribute('readonly', 'readonly');

        // Agregar el evento 'mouseover' al input
        input_item.addEventListener('mouseover', function() {
            this.style.textOverflow = 'clip';
            if (this.scrollWidth > this.offsetWidth) { // Solo aplica la animación si el texto es más largo que el input
                this.style.animation = 'scroll 5s linear infinite';
            }
        });

        // Agregar el evento 'mouseout' al input
        input_item.addEventListener('mouseout', function() {
            this.style.textOverflow = 'ellipsis';
            this.style.animation = '';
        });

        item_content.appendChild(input_item);

        const item_action = document.createElement('div');
        item_action.classList.add('actions');

        const edit_item = document.createElement('button');
        edit_item.classList.add('edit','button','button-success');
        edit_item.type="button";
        edit_item.innerText = 'Edit';

        // Crear el botón de eliminar
        const delete_item = document.createElement('button');
        delete_item.classList.add('delete','button','button-danger','fa','fa-trash');

        // Agregar la imagen al botón de eliminar
        delete_item.style.background = `url(${imageDelete}) no-repeat`;
        delete_item.style.backgroundSize = 'cover'; // Asegúrate de que la imagen cubra todo el botón
        delete_item.textContent = ''; // Eliminar el texto del botón

        // Agregar el botón de eliminar a la acción del ítem
        item_action.appendChild(delete_item);

        item_action.appendChild(edit_item);
        item_action.appendChild(delete_item);

        item.appendChild(item_action);

		if (filterTasks.value === 'done') {
            item.style.display = 'none';
        }

        toDoContainer.appendChild(item);

        input.value = '';
        edit_item.addEventListener('click', (e) => {
            if (edit_item.innerText.toLowerCase() == "edit") {
                edit_item.innerText = "Save";
                input_item.removeAttribute("readonly");
                input_item.focus();
            } else {
                edit_item.innerText = "Edit";
                input_item.setAttribute("readonly", "readonly");
            }
        });

        delete_item.addEventListener('click', function(e) {
			e.stopPropagation();
			toDoContainer.removeChild(item);
		});
        // Crear la tarea en la base de datos
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/create_task/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.onload = function() {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
        xhr.send(`title=${encodeURIComponent(item_value)}&completed=false`);
    }
}

// Función para obtener el valor de una cookie
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
