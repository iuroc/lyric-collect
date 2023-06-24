import { Router } from 'apee-router'

/** 加载模板 */
export function loadTemplate(router: Router) {
    navBarWithBack(router)
}

/** 带返回按钮的导航条 */
function navBarWithBack(router: Router) {
    document.querySelectorAll<HTMLDivElement>('nav-back').forEach(ele => {
        const box = document.createElement('div')
        const back = document.createElement('img')
        const title = document.createElement('div')
        ele.classList.forEach(className => box.classList.add(className))
        box.classList.add('d-flex', 'align-items-center')
        back.src = '/static/img/caret-left.svg'
        back.style.width = '40px'
        back.style.height = '40px'
        back.style.cursor = 'pointer'
        back.addEventListener('click', () => {
            if (router.hashChanged) history.back()
            else location.hash = ''
        })
        title.innerHTML = ele.innerHTML
        title.classList.add('fs-3', 'fw-bold', 'ms-2')
        box.append(back, title)
        ele.replaceWith(box)
    })
}