import '../../node_modules/normalize.css/normalize.css';
import '../css/style.css';

export class PageService {
    toDoList;
    card;

    constructor(api) {
        this.api = api;
        this.toDoList = window.document.querySelector('.todo-list');
        this._handleRemove = this._handleRemove.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this.openUpd = this.openUpd.bind(this);
        this.openDel = this.openDel.bind(this);

        this.overlay = document.querySelector('.overlay');
        this.updateForm = document.querySelector('.updateForm');
        this.deleteForm = document.querySelector('.deleteForm');

        this.updListener = this.closeUpd.bind(this);
        this.delListener = this.closeDel.bind(this);
        this.themeListener = this.changeTheme.bind(this);
        this.loadListener = this.loadTodos.bind(this);

        document
            .querySelector('.updateForm svg')
            .addEventListener('click', this.updListener);

        document
            .querySelector('.deleteForm svg')
            .addEventListener('click', this.delListener);

        document
            .getElementById('themeBtn')
            .addEventListener('click', this.themeListener);

        document
            .getElementById('loadBtn')
            .addEventListener('click', this.loadListener);

        this.submitUpdBtn = document.querySelector('.submit-upd-btn');
        this.submitUpdBtn.addEventListener('click', this._onUpdate.bind(this));

        this.confirmDelBtn = document.querySelector('.confirm-btn');
        this.confirmDelBtn.addEventListener(
            'click',
            this._handleRemove.bind(this)
        );

        this.denyDelBtn = document.querySelector('.deny-btn');
        this.denyDelBtn.addEventListener('click', this.closeDel.bind(this));

        this.initTheme();
    }

    addTodo(number, userId, title, description) {
        this.toDoList.append(
            this._createTodo(number, userId, title, description)
        );
    }

    loadTodos() {
        this.api.fetchAllTodos().then((todos) => {
            todos.forEach((todo) => {
                if (
                    todo.id >
                        +localStorage['currentPage'] *
                            +localStorage['cardsOnPage'] &&
                    todo.id <=
                        (+localStorage['currentPage'] + 1) *
                            +localStorage['cardsOnPage'] &&
                    +localStorage['currentPage'] *
                        +localStorage['cardsOnPage'] <=
                        100
                ) {
                    this.addTodo(todo.id, todo.userId, todo.title, todo.body);
                }
            });
        });
        localStorage['currentPage'] = +localStorage['currentPage'] + 1;
        console.log(localStorage['currentPage']);
    }

    _createTodo(number, userId, title, description) {
        const container = document.createElement('div');
        const currentTheme = localStorage['theme'];
        container.classList.add('todo-list__item');
        container.classList.add('card');
        container.classList.add(localStorage.getItem('theme'));

        container.cardId = number;
        container.userId = userId;
        localStorage[container.cardId] = 0;

        const header = document.createElement('div');
        header.classList.add('card__header');

        const numberEl = document.createElement('h3');
        numberEl.append(document.createTextNode(number));
        numberEl.classList.add('card__number');

        const btnStar = document.createElement('button');
        btnStar.classList.add('star__button');
        btnStar.classList.add(currentTheme);
        btnStar.classList.add('fa');
        btnStar.classList.add('fa-star');

        const numberStar = document.createElement('div');
        numberStar.append(btnStar);
        numberStar.append(numberEl);
        numberStar.classList.add('number__container');

        const titleEl = document.createElement('h3');
        titleEl.append(document.createTextNode(title));
        titleEl.classList.add('card__title');

        const btnDel = document.createElement('button');
        btnDel.append(document.createTextNode('x'));
        btnDel.classList.add('card__remove');
        btnDel.classList.add('main-btn');
        btnDel.classList.add(currentTheme);

        header.append(numberStar);
        header.append(titleEl);
        header.append(btnDel);

        const content = document.createElement('div');
        content.classList.add('card__description');

        content.append(document.createTextNode(description));
        const footer = document.createElement('div');
        footer.classList.add('card__footer');

        const authorEl = document.createElement('i');
        this.api
            .fetchUser(userId)
            .then((res) =>
                authorEl.append(
                    document.createTextNode(`Author: ${res.username}`)
                )
            );
        authorEl.classList.add('card__author');

        const btnUpd = document.createElement('button');
        btnUpd.append(document.createTextNode('Edit'));
        btnUpd.classList.add('card__update');
        btnUpd.classList.add('main-btn');
        btnUpd.classList.add(currentTheme);

        footer.append(authorEl);
        footer.append(btnUpd);

        container.append(header);
        container.append(content);
        container.append(footer);

        btnDel.addEventListener('click', this._handleDelete);
        btnStar.addEventListener('click', this.starUpd);
        btnUpd.addEventListener('click', this.openUpd);
        return container;
    }

    starUpd(event) {
        this.card = event.target.parentElement.parentElement.parentElement;
        this.toDoList = this.card.parentElement;
        const cardId = this.card.cardId;
        localStorage[cardId] = localStorage[cardId] === '1' ? 0 : 1;
        localStorage[cardId] === '1'
            ? event.target.classList.add('button__active')
            : event.target.classList.remove('button__active');

        let sortedArray = Array.prototype.slice.call(this.toDoList.children, 0);
        sortedArray.sort(function (a, b) {
            return localStorage[a.cardId] === localStorage[b.cardId]
                ? a.cardId - b.cardId
                : localStorage[b.cardId] - localStorage[a.cardId];
        });
        this.toDoList.innerHTML = '';
        sortedArray.forEach((item) => this.toDoList.append(item));
    }

    updateTodo(title, content, userId) {
        this.card.userId = userId;
        this.card.getElementsByClassName('card__title')[0].innerText = title;
        this.card.getElementsByClassName('card__description')[0].innerText =
            content;
        this.api.fetchUser(userId).then((res) => {
            this.card.getElementsByClassName(
                'card__author'
            )[0].innerText = `Author: ${res.username}`;
        });
    }

    openDel() {
        this.deleteForm.classList.add('active');
        this.overlay.classList.add('active');
    }

    closeDel() {
        this.deleteForm.classList.remove('active');
        this.overlay.classList.remove('active');
    }

    openUpd(event) {
        this.card = event.target.parentElement.parentElement;
        this.updateForm.classList.add('active');
        this.overlay.classList.add('active');
        document.getElementById('updForm').elements['userId'].value =
            this.card.userId;
        document.getElementById('updForm').elements['title'].value =
            this.card.getElementsByClassName('card__title')[0].innerText;
        document.getElementById('updForm').elements['content'].value =
            this.card.getElementsByClassName('card__description')[0].innerText;
    }

    closeUpd() {
        document.getElementsByClassName('formUpd-errors')[0].innerHTML = '';
        this.updateForm.classList.remove('active');
        this.overlay.classList.remove('active');
    }

    setTheme(oldTheme, newTheme) {
        localStorage.theme = newTheme;
        document.body.className = newTheme;
        document.querySelectorAll('.main-btn').forEach((item) => {
            item.classList.add(newTheme);
            item.classList.remove(oldTheme);
        });
        document.querySelectorAll('.todo-list__item').forEach((item) => {
            item.classList.add(newTheme);
            item.classList.remove(oldTheme);
            item.children[0].children[0].children[0].classList.add(newTheme); // Button Star
            item.children[0].children[0].children[0].classList.remove(oldTheme); // Button Star
        });
        document.querySelectorAll(`.label_${oldTheme}`).forEach((item) => {
            console.log(item);
            item.classList.add(`label_${newTheme}`);
            item.classList.remove(`label_${oldTheme}`);
        });
        document.querySelectorAll(`.modal_${oldTheme}`).forEach((item) => {
            item.classList.add(`modal_${newTheme}`);
            item.classList.remove(`modal_${oldTheme}`);
        });
    }

    initTheme() {
        let oldTheme, newTheme;
        if (localStorage.theme === 'dark-theme') {
            oldTheme = 'light-theme';
            newTheme = 'dark-theme';
        } else {
            oldTheme = 'dark-theme';
            newTheme = 'light-theme';
        }
        this.setTheme(oldTheme, newTheme);
    }

    changeTheme() {
        let oldTheme, newTheme;
        if (localStorage.theme === 'dark-theme') {
            oldTheme = 'dark-theme';
            newTheme = 'light-theme';
        } else {
            oldTheme = 'light-theme';
            newTheme = 'dark-theme';
        }
        this.setTheme(oldTheme, newTheme);
    }

    _onUpdate(e) {
        e.preventDefault();
        const formData = {};
        const form = document.getElementById('updForm');

        Array.from(form.elements)
            .filter((item) => !!item.name)
            .forEach((element) => {
                formData[element.name] = element.value;
            });

        if (!this._validateForm(form, formData)) {
            return;
        }

        this.api.update(this.card.userId, formData).then((data) => {
            this.updateTodo(data.title, data.content, data.userId);
        });

        this.closeUpd();
    }

    _validateForm(form, formData) {
        const errors = [];
        if (!formData.title.length) {
            errors.push('Поле наименование должно быть заполнено');
        }
        if (!formData.content.length) {
            errors.push('Поле описание должно быть заполнено');
        }
        if (formData.userId > 10 || formData.userId < 1) {
            errors.push(
                'Поле автор должно иметь значения в диапазоне от 1 до 10'
            );
        }
        if (errors.length) {
            const errorEl = form.getElementsByClassName('formUpd-errors')[0];
            errorEl.innerHTML = errors.map((er) => `<div>${er}</div>`).join('');
            return false;
        }
        return true;
    }

    _handleRemove(event) {
        if (this.card === undefined) {
            this.card = event.target.parentElement.parentElement;
        }
        this.api.remove(this.card.cardId).then((res) => {
            if (res.status >= 200 && res.status <= 300) {
                event.target.removeEventListener('click', this._handleDelete);
                this.card.remove();
            }
        });
        this.closeDel();
    }

    _handleDelete(event) {
        this.card = event.target.parentElement.parentElement;
        localStorage[this.card.cardId] === '1'
            ? this.openDel()
            : this._handleRemove(event);
    }

    _getLastId() {
        let result =
            Array.prototype.slice
                .call(this.toDoList.children)
                .reduce((a, b) => (a.cardId > b.cardId ? a : b)).cardId + 1;
        return result ? result : 1;
    }
}
