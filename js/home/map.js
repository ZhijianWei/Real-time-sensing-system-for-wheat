// 初始化地图方法
function mapInit() {
    map = L.map('map').setView([35.8617, 104.1954], 4); // 中国

    var baseMaps = {
        "矢量": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        "影像": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
        "地形": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}')
    };

    // 默认加载影像作为底图
    baseMaps.影像.addTo(map);
    // L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);

    map.on('click', function (e) {
        console.log(e.latlng.lng + "," + e.latlng.lat);
    });

    // G.chinaWheatLayer = L.esri.dynamicMapLayer({
    //     url: "https://arcgis.snfarming.com:6443/arcgis/rest/services/WheatEnvironmentalPerceptionSystem/ChinaWheat10_2020_ATDG/MapServer",
    //     opacity: 1
    // }).addTo(map);
    // 加载GeoServer发布的NDVI图层
    G.chinaWheatLayer = L.tileLayer.wms('http://110.41.138.93:8888/geoserver/topp/wms?service=WMS', {
        layers: 'topp:states', // 替换为你的工作区和图层名称
        format: 'image/png',
        transparent: true,
        attribution: "NDVI data from GeoServer"
    }).addTo(map);

};

// 加载图层
function addLayer(mapObj) {
    if (mapObj.type == "dynamicMapLayer") {// 如果是动态图层
        addDynamicMapLayer(mapObj);
    } else if (mapObj.type == "tileLayer") {// 如果是瓦片图层
        addTileLayer(mapObj);
    }
}
// 加载动态图层
function addDynamicMapLayer(mapObj, index) {
    if (!mapObj.layers) mapObj.layers = [0];

    // // 使用L.esri.dynamicMapLayer来加载动态图层
    // if (!mapObj.layers) mapObj.layers = null;
    // var layer = L.esri.dynamicMapLayer({
    //     url: mapObj.url,
    //     layers: mapObj.layers,
    //     opacity: 1// 图层透明度
    // }).addTo(map);
    // 加载GeoServer发布的NDVI图层
    // if (!mapObj.layers) mapObj.layers = null;
    //获取使用Geoserver发布的图层的url
    var layer = L.tileLayer.wms('http://110.41.138.93:8888/geoserver/netcia_xjn/wms', {
        layers: mapObj.layers, // 替换为你的工作区和图层名称
        format: mapObj.format,
        transparent: true,
        attribution: "NDVI data from GeoServer"
    }).addTo(map);
    // var layer = L.tileLayer.wms('http://110.41.138.93:8888/geoserver/netcia_xjn/wms?service=WMS', {
    //     layers: mapObj.layers, // 替换为你的工作区和图层名称
    //     format: mapObj.format,
    //     transparent: true,
    //     attribution: "NDVI data from GeoServer"
    // }).addTo(map);


    // 保存到一个全局或管理的图层集合中，以便后续可以删除或更新
    G.popMenuMapLayers[mapObj.title + index] = layer;

    // 如果存在地理边界框，调整地图视图以适应该区域
    fitBounds(mapObj);

    showLegend(mapObj.url, Math.max(...mapObj.layers));
}
// 加载瓦片图层
function addTileLayer(mapObj, index) {
    // 使用L.tileLayer来加载瓦片图层
    var layer = L.tileLayer(mapObj.url, {
        maxZoom: 19
    }).addTo(map);

    // 保存到一个全局或管理的图层集合中，以便后续可以删除或更新
    G.popMenuMapLayers[mapObj.title + index] = layer;
}
// 移除图层
function removeLayer_user(layerTitle) {
    // 假设G.popMenuMapLayers是一个全局变量，存储了所有的图层
    var layer = G.popMenuMapLayers[layerTitle];
    if (layer) {
        map.removeLayer(layer); // 从地图中移除图层
        delete G.popMenuMapLayers[layerTitle]; // 从管理的图层集合中删除该图层
    }
    removeExistingLegend();
}
// 移除popMenu全部图层
function removeLayers_popMenuAll() {
    Object.keys(G.popMenuMapLayers).forEach(key => {
        removeLayer_user(key);
    });
}
// 如果存在地理边界框，调整地图视图以适应该区域
function fitBounds(mapObj) {
    // 如果存在地理边界框，调整地图视图以适应该区域
    if (mapObj.extent && mapObj.extent.length === 4) {
        var southWest = L.latLng(mapObj.extent[1], mapObj.extent[0]);
        var northEast = L.latLng(mapObj.extent[3], mapObj.extent[2]);
        var bounds = L.latLngBounds(southWest, northEast);
        map.fitBounds(bounds);
    }
}
function showLegend(url, layerId) {
    var legendUrl = url + '/legend?f=json';

    fetch(legendUrl)
        .then(response => response.json())
        .then(data => {
            // 处理并显示图例
            displayLegend(data, layerId);
        })
        .catch(error => console.error('Error fetching the legend:', error));

    function displayLegend(data, layerId) {
        // 首先移除现有的图例（如果存在）
        removeExistingLegend();

        var legend = L.control({ position: 'bottomleft' });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info-legend');

            // 过滤并显示指定图层的图例
            var layer = data.layers.find(l => l.layerId == layerId);
            if (layer) {
                layer.legend.forEach(legendItem => {
                    var imageUrl = url + '/' + layer.layerId + '/images/' + legendItem.url;
                    div.innerHTML += '<div><img src="' + imageUrl + '"> ' + legendItem.label + '</div>';
                });
            }

            return div;
        };

        legend.addTo(map);
    }
}

function removeExistingLegend() {
    var existingLegends = document.getElementsByClassName('info-legend');
    while (existingLegends[0]) {
        existingLegends[0].parentNode.removeChild(existingLegends[0]);
    }
}


// 【未使用】动态图层支持查询-需要对应的移除机制
function queryDynamicMapLayer(url) {
    var arcgisLayer = L.esri.dynamicMapLayer({
        url: url
    }).addTo(map);

    // 监听地图点击事件
    map.on('click', function (e) {
        // 使用Esri Leaflet查询功能
        L.esri.query({
            url: url + "/0"// 待完善
        })
            .nearby(e.latlng, 10) // 查询点击位置附近的对象
            .run(function (error, featureCollection) {
                if (error) {
                    console.error("查询图层失败: ", error);
                    return;
                }

                var content = "<strong>经度:</strong> " + e.latlng.lat + "<br><strong>纬度:</strong> " + e.latlng.lng + "<br><hr>";

                // 如果有查询到对象，则显示其属性
                if (featureCollection.features.length > 0) {
                    var featureProperties = featureCollection.features[0].properties;
                    for (var prop in featureProperties) {
                        content += prop + ": " + featureProperties[prop] + "<br>";
                    }
                }

                // 使用Leaflet弹窗显示属性和经纬度
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(content)
                    .openOn(map);
            });
    });
}