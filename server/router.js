export class Router {
    _getAllEndpoint;
    _createEndpoint;
    _getOneRegExp;
    _removeOneRegExp;
    _updateOneRegExp;

    constructor() {
        this._getAllEndpoint = '/api/todos';
        this._createEndpoint = this._getAllEndpoint;
        this._getOneRegExp = /\/api\/todos\/([0-9]+)/;
        this._removeOneRegExp = this._getOneRegExp;
        this._updateOneRegExp = this._getOneRegExp;
    }

    isGetAll(req) {
        return req.url === this._getAllEndpoint && req.method === 'GET';
    }

    isCreate(req) {
        return req.url === this._createEndpoint && req.method === 'POST';
    }

    isGet(req) {
        return (
            this._isMatchToRoute(req, this._getOneRegExp) &&
            req.method === 'GET'
        );
    }

    isDelete(req) {
        return (
            this._isMatchToRoute(req, this._removeOneRegExp) &&
            req.method === 'DELETE'
        );
    }

    isUpdate(req) {
        return (
            this._isMatchToRoute(req, this._updateOneRegExp) &&
            req.method === 'PUT'
        );
    }

    _isMatchToRoute(req, regexp) {
        return req.url.match(regexp);
    }
}
