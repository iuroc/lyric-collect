"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = void 0;
/** 加载模板 */
function loadTemplate(router) {
    navBarWithBack(router);
}
exports.loadTemplate = loadTemplate;
/** 带返回按钮的导航条 */
function navBarWithBack(router) {
    document.querySelectorAll('nav-back').forEach(function (ele) {
        var box = document.createElement('div');
        var back = document.createElement('img');
        var title = document.createElement('div');
        ele.classList.forEach(function (className) { return box.classList.add(className); });
        box.classList.add('d-flex', 'align-items-center');
        back.src = '/static/img/caret-left.svg';
        back.style.width = '40px';
        back.style.height = '40px';
        back.style.cursor = 'pointer';
        back.addEventListener('click', function () {
            if (router.hashChanged)
                history.back();
            else
                location.hash = '';
        });
        title.innerHTML = ele.innerHTML;
        title.classList.add('fs-3', 'fw-bold', 'ms-2');
        box.append(back, title);
        ele.replaceWith(box);
    });
}
