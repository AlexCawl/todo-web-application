export class RenderService {
    constructor(pageService, modalService) {
        this.modalService = modalService;
        this.pageService = pageService;
        this.btn = document.getElementById('addBtn');
        this.btn.addEventListener('click', (e) => this._onOpenModal(e));
    }

    fetchFirstTodo() {
        this.pageService.loadTodos();
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
