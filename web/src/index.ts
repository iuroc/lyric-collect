import { Router } from 'apee-router'
import { loadTemplate } from './template'
import { routeGet } from './route/get'
import { routeLogin, checkToken } from './route/login'
const router = new Router()
loadTemplate(router)
router.set(['home', 'search', 'login', 'user', 'add', 'get'])
router.set('get', routeGet)
router.set('login', routeLogin)
router.start()
checkToken()