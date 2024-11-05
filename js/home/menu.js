// 初始化菜单
function menuInit() {
    getMenu();
}
// 获取菜单数据
function getMenu() {
    $.ajax({
        url: '../json/menu.json',
        dataType: 'json',
        success: function (data) {
            G.menu = data;

            const menu_left = document.getElementById('menu_left');
            const menu_right = document.getElementById('menu_right');
            renderMenu(G.menu.slice(0, 5), menu_left, 1);
            renderMenu(G.menu.slice(5, 10), menu_right, 1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("菜单数据加载失败:", errorThrown);
        }
    });
}
// 构造菜单
function renderMenu(data, container, level) {
    data.forEach(item => {
        const menuItem = document.createElement('div');
        if (level === 1) {
            menuItem.className = 'menu-item-first';
        } else if (level === 2) {
            menuItem.className = 'menu-item-second';
        }
        const spanItem = document.createElement('span');
        spanItem.textContent = item.name;
        menuItem.appendChild(spanItem);
        container.appendChild(menuItem);

        let subMenu = null;
        if (item.action === "showSecond") {//if (item.children && item.children.length > 0) {
            subMenu = document.createElement('div');
            subMenu.className = 'submenu';
            subMenu.style.display = 'none';  // 默认隐藏子菜单
            menuItem.appendChild(subMenu);   // 添加子菜单到相应的菜单项下
            // 递归渲染子菜单
            renderMenu(item.children, subMenu, 2);
        } else if (item.action === "showPopMenu") {
            menuItem.addEventListener('click', () => {
                menuLayer.showPopMenu(item);
            });
        } else if (item.action === "showPop") {
            menuItem.addEventListener('click', () => {
                menuLayer.showPop(item);
            });
        } else if (item.action === "showConfirm") {
            menuItem.addEventListener('click', () => {
                menuLayer.showConfirm(item);
            });
        }

        if (level === 1) {
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();  // 阻止事件冒泡
                let show = false;// 当前二级菜单是否显示
                if (subMenu && subMenu.style.display === 'block') {
                    show = true;
                }
                $(".submenu").hide();
                if (subMenu) {
                    if (!show) {
                        subMenu.style.display = 'block';  // 显示子菜单
                    }
                }
            });
        }
    });
}
