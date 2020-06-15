window.onload = function() {
    $buttonLoad = document.querySelectorAll('.button-load');
    $inputFilter = document.querySelector('#input-filter');
    $loading = document.querySelector('#loading');
    $message = document.querySelector('#message');
    $table = document.querySelector('table');

    $buttonLoad.forEach(element => {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            getProducts(element);
        })

    });

    document.querySelector('#register').addEventListener('click', function() {
        openForm();
    });

    document.querySelector('#close').addEventListener('click', function() {
        document.querySelector('#modal').classList.add('hidden');
    });

    document.querySelector('#action-form').addEventListener('click', async function() {
        $messageSend = document.querySelector('#message-send');
        $messageSend.innerHTML = '';
        $formulario = document.querySelector("#form");
        formulario = new FormData($formulario);
        filter = '';
        headers = {
            method: 'POST',
            body: formulario,
        };
        if (this.dataset.action === 'actualizar') {
            headers.method = 'PUT';
            dataP = new URLSearchParams(formulario);
            filter = '?id=' + this.dataset.id + '&' + dataP.toString();
        }
        response = await fetch('http://190.144.96.195:8080/api/Products/' + filter, headers);
        dataJson = await response.json();
        $messageSend.innerHTML = dataJson.message;
        if (dataJson.status == 1) {
            if (this.dataset.action === 'ingresar') {
                $formulario.reset();
            }
            getProducts()
        }

    });

    async function getProducts(element = { dataset: { param: 0 } }) {
        filter = element.dataset.param === '1' ? $inputFilter.value : '';
        $table.classList.add('hidden');
        $loading.innerHTML = 'Cargando...';
        try {
            response = await fetch('http://190.144.96.195:8080/api/Products/' + filter, {
                method: 'GET',
            });
            dataJson = await response.json();
            $loading.innerHTML = '';
            if (dataJson.length > 0) {
                [html, total] = createDataTable(dataJson);
                $table.querySelector('tbody').innerHTML = html;
                initEventIcon();
                $message.classList.add('hidden');
                $table.classList.remove('hidden');
                return true;
            }
            $message.classList.remove('hidden');
            $message.innerHTML = 'No existen datos';
        } catch (error) {
            $message.classList.remove('hidden');
            $message.innerHTML = error;
            $message.style.borderBottom = '2px red solid';
        }
        $loading.innerHTML = '';
    }

    function createDataTable($data) {
        html = ''
        total = 0.00;
        $data.forEach(element => {
            html += `<tr>
                <td>${element.id}</td>
                <td>${element.descripcion}</td>
                <td>${element.marca}</td>
                <td>${element.presentacion}</td>
                <td>${parseFloat(element.precio)}</td>
                <td style='text-align: right;'>${createIconEdit(element.id)}${createIconRemove(element.id)}</td>
            </tr>`;
            total += parseFloat(element.precio);
        });

        return [html, total];
    }

    function createIconEdit(id) {
        return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAhUlEQVRIie3TsQnAIBCF4X/JkCJZwB2EuE/GcZCkVzBFThSxy9kEDw7U4nsqHMx6ywI3sI7AHZCkI7CPwANwVmuVl2Q8AUbOcsiliSfAS0iQvdXAg6C+CXNaeP5no41HYJOzhfItx8Qn/gMcysDkIVor3H3F6wBQvnkbULca3gtQxWd16wFWK2WxLn2fzAAAAABJRU5ErkJggg=="
        class="icon-edit" data-id=${id} />`;
    }

    function createIconRemove(id) {
        return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAA3klEQVRIie2VSw7CMAxEXzkBnzUEuP85aMWGLSAg6knKoqmUVqntEiGB1JG86qSTsR0bZvwrVkAF3AFn4LvArYC1VWQJnIEmRA0cBf4OeEb8C7CxCJXRoS5epJ258G3ILzWRArglDqbExkSa8I9CExumIo4aOBg4Uqp7cIAXnI058cDeKmJxlu3kU7EupVnQxEwii9xbBKgdpmFK6r5en6w6SY/RI7e+ZTaqTqwPVnUmjSCPfQRdMTRIZRDRxNShCuk1IaViCzwivnlNQLu8StoUWIrrAvfEhMU347fwBrdXtAJ8rBmiAAAAAElFTkSuQmCC" class="icon-remove" data-id=${id} />`;
    }

    function initEventIcon() {
        document.querySelectorAll('.icon-edit').forEach(function(icon) {
            icon.addEventListener('click', async function(event) {
                id = icon.dataset.id
                response = await fetch('http://190.144.96.195:8080/api/Products/' + id, {
                    method: 'GET',
                });
                dataJson = await response.json();
                data = {
                    id: id,
                    descripcion: dataJson[0].descripcion,
                    marca: dataJson[0].marca,
                    presentacion: dataJson[0].presentacion,
                    precio: dataJson[0].precio,
                }
                openForm(data);
            });
        })

        document.querySelectorAll('.icon-remove').forEach(function(icon) {
            icon.addEventListener('click', async function(event) {
                id = 'id=' + icon.dataset.id;
                response = await fetch('http://190.144.96.195:8080/api/Products/?' + id, {
                    method: 'DELETE',
                });
                dataJson = await response.json();
                if (dataJson.status == 1) {
                    icon.parentElement.parentElement.remove();
                }
                $message.classList.remove('hidden');
                $message.innerHTML = dataJson.message;

            });
        })
    }

    function openForm(data = {}) {
        $button = document.querySelector('#action-form');
        document.querySelector('#descripcion').value = '';
        document.querySelector('#marca').value = '';
        document.querySelector('#presentacion').value = '';
        document.querySelector('#precio').value = '';
        $button.textContent = 'Ingresar';
        $button.dataset.action = 'ingresar';
        $button.dataset.id = '';
        if (Object.entries(data).length > 0) {
            document.querySelector('#descripcion').value = data.descripcion;
            document.querySelector('#marca').value = data.marca;
            document.querySelector('#presentacion').value = data.presentacion;
            document.querySelector('#precio').value = data.precio;
            $button.textContent = 'Actualizar';
            $button.dataset.action = 'actualizar';
            $button.dataset.id = data.id;
        }
        document.querySelector('#modal').classList.remove('hidden');
    }
};