export class ModalService {
    constructor(todoService, api) {
        this.api = api;
        this.todoService = todoService;
        this.overlay = document.querySelector('.overlay');
        this.modal = document.querySelector('.modal');
        this._createSelect();
        this.listener = this.close.bind(this);
        document
            .querySelector('.modal svg')
            .addEventListener('click', this.listener);

        this.submitBtn = document.querySelector('.submit-btn');
        this.submitBtn.addEventListener('click', this._onCreate.bind(this));

        this.loadBtn = document.getElementById('loadBtn');
        this.loadBtn.addEventListener('click', this._onLoad.bind(this));
    }

    _onLoad() {
        this.todoService._getLastId();
    }

    _createSelect() {
        document.querySelectorAll('.authorSelect').forEach((item) => {
            for (let i = 1; i < 11; i++) {
                const option = document.createElement('option');
                this.api.fetchUser(i).then((res) => {
                    option.value = i.toString();
                    option.text = res.username;
                });
                item.add(option);
            }
        });
    }

    open() {
        this.modal.classList.add('active');
        this.overlay.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
        this.overlay.classList.remove('active');
    }

    _onCreate(e) {
        e.preventDefault();

        const formData = {};
        const form = document.forms[0];

        Array.from(form.elements)
            .filter((item) => !!item.name)
            .forEach((element) => {
                formData[element.name] = element.value;
            });

        if (!this._validateForm(form, formData)) {
            return;
        }

        this.api.create(formData).then((data) => {
            this.todoService.addTodo(
                this.todoService._getLastId(),
                data.userId,
                data.title,
                data.content
            );
        });
        form.reset();
        this.close();
    }

    _validateForm(form, formData) {
        const errors = [];
        if (!formData.title.length) {
            errors.push('Поле наименование должно быть заполнено');
        }
        if (!formData.content.length) {
            errors.push('Поле описание должно быть заполнено');
        }

        if (errors.length) {
            const errorEl = form.getElementsByClassName('form-errors')[0];
            errorEl.innerHTML = errors.map((er) => `<div>${er}</div>`).join('');

            return false;
        }

        return true;
    }
}
