var test_layerGroup;  // 用于保存所有添加到地图上的图层
function generateRandomLatLngs(count) {
    var latlngs = [];

    for (var i = 0; i < count; i++) {
        // 生成随机纬度和经度
        var lat = 39.4 + Math.random() * (40.6 - 39.4);
        var lng = 115.7 + Math.random() * (117.4 - 115.7);

        latlngs.push([lat, lng]);
    }

    return latlngs;
}
function drawLatLngs(latlngs) {
    // 如果已存在图层组，则先移除
    if (test_layerGroup) {
        test_layerGroup.remove();
    }

    // 创建新的图层组
    test_layerGroup = L.layerGroup();

    // 为每个坐标点添加标记并添加到图层组
    latlngs.forEach(function (latlng, index) {  // 注意这里的 index 参数，它是数组的索引
        var marker = L.marker(latlng);
        marker.on('click', function (e) {
            var popupContent = "序号: " + index + "<br>经度: " + e.latlng.lng.toFixed(3) + "<br>纬度: " + e.latlng.lat.toFixed(3);  // 显示序号
            marker.bindPopup(popupContent).openPopup();
        });
        test_layerGroup.addLayer(marker);

        // 创建一个自定义图标来显示序号
        var label = L.divIcon({ className: 'my-div-icon', html: index.toString() }); // 'my-div-icon' 是自定义的 CSS 类
        /* 定义你的 CSS 规则 */
        // 为 .my-div-icon 类添加 font-size 以及其他必要的样式
        var styles = `
.my-div-icon {
    font-size: 20px; /* 设置字体大小为 20px */
    color: red; /* 设置文本颜色为红色 */
    background-color: white;
    border-radius: 0%;
    padding: 5px;
    width: auto !important;
    height: auto !important;
    text-align: center;
    line-height: auto; /* 与宽高一致以垂直居中文本 */
}
`;
        addStyle(styles);
        // 添加一个无图标的标记来承载这个自定义图标
        var labelMarker = L.marker(latlng, { icon: label, zIndexOffset: 1000 }).addTo(map);
        test_layerGroup.addLayer(labelMarker);
    });

    // 绘制线条并添加到图层组
    var polyline = L.polyline(latlngs, { color: 'red' });
    test_layerGroup.addLayer(polyline);

    // 将图层组添加到地图
    test_layerGroup.addTo(map);

    // 调整视图以展示所有图层
    map.fitBounds(polyline.getBounds());
}
function addStyle(styles) {
    /* 创建一个 style 元素 */
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet) {
        css.styleSheet.cssText = styles;
    } else {
        css.appendChild(document.createTextNode(styles));
    }

    /* 将 style 元素添加到 head 中 */
    document.getElementsByTagName("head")[0].appendChild(css);
}
// 生成随机坐标点并绘制
// var latlngs = generateRandomLatLngs(10);
// drawLatLngs(latlngs);
console.log("test.js");