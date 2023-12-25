import {NetworkRepository} from '../../server/networkRepository.js';
import {ModalService} from './modalService.js';
import {PageService} from './pageService.js';
import {RenderService} from './renderService.js';

localStorage.currentPage = -1;
localStorage.cardsOnPage = 50;

const api = new NetworkRepository();
const pageService = new PageService(api);
const modalService = new ModalService(pageService, api);
const service = new RenderService(pageService, modalService);

service.fetchFirstTodo();
