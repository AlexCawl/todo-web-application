export class RenderService {
    constructor(todoService, modalService) {
        this.modalService = modalService;
        this.todoService = todoService;
        document.getElementsByClassName('app');
        this.btn = document.getElementById('addBtn');
        this.btn.addEventListener('click', (e) => this._onOpenModal(e));
    }

    fetchFirstTodo() {
        this.todoService.loadTodos();
    }

    _onOpenModal() {
        if (
            (+localStorage['currentPage'] + 1) * +localStorage['cardsOnPage'] <
            100
        ) {
            console.log(
                +localStorage['currentPage'] * +localStorage['cardsOnPage']
            );
            alert('Load all cards!');
        } else {
            this.modalService.open();
        }
    }
}
