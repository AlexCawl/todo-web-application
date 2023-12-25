import {NetworkRepository} from "../../server/networkRepository.js";
import {ModalService} from "./modalService.js";
import {PageService} from "./pageService.js";
import {RenderService} from "./renderService.js";

localStorage.theme = 'light-theme';
localStorage.currentPage = -1;
localStorage.cardsOnPage = 50;

const api = new NetworkRepository();
const todoService = new PageService(api);
const modalService = new ModalService(todoService, api);
const service = new RenderService(todoService, modalService);

service.fetchFirstTodo();
