document.addEventListener('DOMContentLoaded', function () { // 当文档加载完毕后
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html'; // 如果用户没有"登录"，则跳转到login页面
    }
});

function onLogout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html'; // 跳转到login页面
}