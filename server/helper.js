export function defaultOkResponseHandler(res, data) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(data));
}

export function defaultErrorResponseHandler(res, error) {
    res.writeHead(404, {
        'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({message: error}));
}

export function getRequestDate(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    }).then((body) => JSON.parse(body));
}