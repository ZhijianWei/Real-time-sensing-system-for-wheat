const menuLayer = {
    showPopMenu: function (item) {
        G.menuSelected = item;
        if (G.popMenuLayerIndex) {
            layer.close(G.popMenuLayerIndex);
            removeLayers_popMenuAll();
        }
        G.popMenuLayerIndex = layer.open({
            type: 2 // iframe层
            , area: ['300px', '70%'] // 宽度和高度
            , title: false // 不显示标题
            , shade: 0 // 遮罩透明度
            , maxmin: false // 不允许最大化最小化
            , anim: 'slideLeft' // 动画类型
            , content: '/html/layers/popMenu.html' // URL
            , offset: ['99px', 'calc(100% - 300px)'] // 距顶部99px
            , shadeClose: true // 点击遮罩关闭层
            , closeBtn: 0 // 不显示关闭按钮
            , success: function (layero, index) {
                // layero 是弹出层的 jQuery 对象，index 是弹出层的索引
                layero.css('border-radius', '20px 0 0 20px');
            }
        });
    }, showPop: function (item) {
        // G.menuSelected = item;
        if (item.menu === 'contactUs') {
            layer.open({
                type: 2 //Page层类型
                , area: ['440px', '350px']
                , title: '联系我们'
                , shade: 0.5 //遮罩透明度
                , maxmin: false //允许全屏最小化
                , anim: 0 //0-6的动画形式，-1不开启
                , content: '/html/layers/contactUs.html'
            });
        } else if (item.menu === 'zhuanTiTu') {
            layer.open({
                type: 2 //Page层类型
                , area: ['570px', 'calc(100% - 99px)']
                , offset: ['99px', 'calc(50% - 570px / 2)'] // 距顶部99px
                , title: '专题产品'
                , shade: 0.5 //遮罩透明度
                , maxmin: false //允许全屏最小化
                , anim: 'slideDown'  //0-6的动画形式，-1不开启
                , content: '/html/layers/ZhuanTiTu.html'
            });
        } else if (item.menu === 'dataProduction') {
            layer.open({
                type: 2 //Page层类型
                , area: ['1000px', '630px']
                , offset: ['99px', 'calc(50% - 1000px / 2)'] // 距顶部99px
                , title: '数据生产日志'
                , shade: 0.5 //遮罩透明度
                , maxmin: false //允许全屏最小化
                , anim: 'slideDown' //0-6的动画形式，-1不开启
                , content: '/html/layers/dataProduction.html'
            });
        } else if (item.menu === 'dataManagement') {
            layer.open({
                type: 2 //Page层类型
                , area: ['1125px', '630px']
                , offset: ['99px', 'calc(50% - 1125px / 2)'] // 距顶部99px
                , title: '数据管理'
                , shade: 0.5 //遮罩透明度
                , maxmin: false //允许全屏最小化
                , anim: 'slideDown' //0-6的动画形式，-1不开启
                , content: '/html/layers/dataManagement.html'
            });
        } else if (item.menu === 'agricultureReport') {
            layer.open({
                type: 2 //Page层类型
                , area: ['1100px', 'calc(100% - 99px)']
                , offset: ['99px', 'calc(50% - 1100px / 2)'] // 距顶部99px
                , title: '农情报告'
                , shade: 0.5 //遮罩透明度
                , maxmin: false //允许全屏最小化
                , anim: 'slideDown' //0-6的动画形式，-1不开启
                , content: '/html/layers/agricultureReport.html'
            });
        }
    }, showConfirm: function (item) {
        // G.menuSelected = item;
        if (item.menu === 'exit') {
            layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function (index) {
                onLogout();
                layer.close(index);
            });
        }
    }
};