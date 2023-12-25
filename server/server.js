import http from 'http';
import {Router} from './router.js';
import {LocalRepository} from './localRepository.js';
import {
    defaultErrorResponseHandler,
    defaultOkResponseHandler,
    getRequestDate,
} from './helper.js';

const todoRepository = new LocalRepository();
const router = new Router();
const server = http.createServer(async (req, res) => {
    try {
        if (router.isGetAll(req)) {
            const data = todoRepository.getAll();
            defaultOkResponseHandler(res, data);
            return;
        }

        if (router.isGet(req)) {
            const id = +req.url.split('/')[3];
            const data = todoRepository.getById(id);
            defaultOkResponseHandler(res, data);
            return;
        }

        if (router.isCreate(req)) {
            const data = await getRequestDate(req);
            const created = todoRepository.create(data);
            defaultOkResponseHandler(res, created);
            return;
        }

        if (router.isDelete(req)) {
            const id = +req.url.split('/')[3];
            const data = todoRepository.removeById(id);
            defaultOkResponseHandler(res, data);
            return;
        }

        if (router.isUpdate(req)) {
            const id = +req.url.split('/')[3];
            const data = await getRequestDate(req);
            const updated = todoRepository.update(id, data);
            defaultOkResponseHandler(res, updated);
            return;
        }
    } catch (e) {
        console.error(e);
        defaultErrorResponseHandler(res, (e && e.message) || 'Bad request');
        return;
    }

    defaultErrorResponseHandler(res, 'Route not found');
});

const PORT = process.env.PORT || 4300;
server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
    console.log(`server address: http://localhost:${PORT}`);
});
