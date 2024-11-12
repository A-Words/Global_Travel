
var map = new AMap.Map('container', {
    center: [116.397428, 39.90923],
    layers: [
        // 卫星
        new AMap.TileLayer.Satellite(),
        // 路网
        new AMap.TileLayer.RoadNet()
    ],
    zoom: 13
});
