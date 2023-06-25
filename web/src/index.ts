import { Router } from 'apee-router'
import { loadTemplate } from './template'
import { routeGet } from './route/get'
import { checkToken } from './route/login'
const router = new Router()
loadTemplate(router)
router.set(['home', 'search', 'login', 'user', 'add', 'get'])
router.set('get', routeGet)
router.start()
checkToken()