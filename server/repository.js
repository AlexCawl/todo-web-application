export class Repository {
    _todos;
    _idSequence = 2;

    constructor() {
        this._todos = [
            {
                id: 1,
                title: 'Сделать практику',
                description: 'Сделать практику по dom и fetch',
            },
            {
                id: 2,
                title: 'Прочесть лекцию',
                description:
                    'Прочесть лекцию по dom promise fetch. А так же познакомиться с RegExp',
            },
        ];
    }

    create(data) {
        const {title, description} = data;

        this._idSequence = this._idSequence + 1;
        const created = {id: this._idSequence, title, description};

        this._todos.push(created);
        return created;
    }

    getAll() {
        return [...this._todos];
    }

    getById(id) {
        const todo = this._todos.find((item) => item.id === id);

        if (!todo) {
            throw new Error('Not found');
        }

        return todo;
    }

    removeById(id) {
        if (this._todos.findIndex((item) => item.id === id) === -1) {
            throw new Error('Not found');
        }

        this._todos = this._todos.filter((item) => item.id !== id);
    }

    update(id, data) {
        if (this._todos.findIndex((item) => item.id === id) === -1) {
            throw new Error('Not found');
        }

        this._todos = this._todos.map((item) => {
            if (item.id === id) {
                return {id, title: data.title, description: data.description};
            }

            return item;
        });
    }
}