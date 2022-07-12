import axios from "axios";

var WCT = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    FAULTY: 'faulty',
    ALL: 'all'
};

let a;


// const EcoFactorFetch = () => {
//     fetch("./ecofactordata.json").then
// }

function spivotGetCustomTitle(titleData) {
    window.spivotTitleData = titleData;
    let provider;
    if (titleData.key == "Минск, АЗС №56 (TZone / Vityaz)") {
        provider = "EcoFactor"  
      } else {
        provider = "Malanka"      
      }
    var keyStr = '<p>' + titleData.key + '</p>';
    let providerTitle = '<p>' + provider + '<img src="https://img.apksum.com/dc/by.belorusneft.driverapp/3.75/icon.png" width="30" height="30" />' + '</p>';
    keyStr += providerTitle;
    console.log(titleData)
    for (key in titleData.data) {
        keyStr += '<p>' + key + ': ' + titleData.data[key] + '</p>';
    }
    var rez = '<div>' + keyStr + '</div>';

    return rez;
}

function spivotGetItemColor(itemData, defaultColor, options) {
    var color = defaultColor;
    a = itemData.items;
    var td = itemData.titleData;
    let arr = [];
    for (let i = 0; i < itemData.items.length - 1; i++) {
        arr.push(itemData.items[i].key)
    }
    if (td) {
        var available = td['Available'];
        var total = td['Total'];
        var faulty = td['Faulty'];
        var occupied = td['Occupied'];

        if (typeof available !== 'undefined' &&
            typeof total !== 'undefined' &&
            typeof faulty !== 'undefined') {
            if (available > 0) {
                color = 'green';
            } else if (occupied > 0) {
                color = 'orange';
            } else {
                color = 'red';
            }
        }
    }
    if (options && options.categoryFilter) {
        if (WCT.OCCUPIED === options.categoryFilter) {
            color = 'orange';
        } else if (WCT.FAULTY === options.categoryFilter) {
            color = 'red';
        }
    }

    return color;
}

function spivotSaveBoundsData(lat, lng, zoom, bounds) {
    window.spivotCommon.broadcastMessage("top", "spivotSaveBoundsData", {
        lat: lat,
        lng: lng,
        zoom: zoom,
        bounds: bounds
    });
}

function spivotGetStatisticHandler() {
    if (window.spivotStatistic) {
        var str = '';
        for (var key in window.spivotStatistic) {
            var stObj = window.spivotStatistic[key];
            var avTime = Math.round(10 * stObj.time / stObj.count) / 10;
            str = str + key + ': [count: ' + stObj.count + '; all: ' + stObj.time + 'ms; average: ' + avTime + 'ms]\r\n'
        }
        alert(str);
    }
}

function spivotGetFavoriteLocationHandler() {
    var iw = window.spivotInfoWindow;
    if (iw && isInfoWindowOpen(iw) && iw.anchor) {
        var c = iw.anchor.getPosition();
        window.spivotCommon.broadcastMessage("top", "spivotSaveFavorite", {
            location: {
                lat: c.lat(),
                lng: c.lng()
            },
            widgetId: widgetId
        });
        iw.setMap(null);
    }
}

function isInfoWindowOpen(infoWindow) {
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}

function spivotSetGeolocationHandler(data) {
    if (window.spivotMap) {
        var item = new google.maps.Marker({
            position: new google.maps.LatLng(data)
        });
        if (window.spivotGeoMarker) {
            window.spivotGeoMarker.setMap(null);
        }
        item.setMap(window.spivotMap);
        window.spivotGeoMarker = item;
    }
}

function zoomMap2SelectedItem() {
    var prev;
    var iw = window.spivotInfoWindow;
    if (iw && isInfoWindowOpen(iw)) {

        var pos = iw.position;
        var lat = pos.lat();
        var lng = pos.lng();
        for (var i = 0; i < window.spivotMapItems.length; i++) {
            var checkItem = window.spivotMapItems[i].item;
            if (checkItem instanceof google.maps.Circle &&
                checkItem.getCenter().equals(pos)) {
                prev = {
                    zoom: window.spivotMapOptions.zoom,
                    center: window.spivotMapOptions.center
                };
                window.spivotMapOptions.prev.push(prev);
                var items = checkItem.items;
                if (items) {
                    var mapBounds = new google.maps.LatLngBounds();
                    for (var j = 0; j < items.length; j++) {
                        mapBounds.extend(items[j]);
                    }
                    need2SetBounds = false;
                    window.spivotMapOptions.renderFromListener = false;
                    window.spivotMap.fitBounds(mapBounds);
                } else {
                    window.spivotMapOptions.center = new google.maps.LatLng(lat, lng);
                    window.spivotMapOptions.zoom = 17;
                }
                break;
            } else if (checkItem instanceof google.maps.Marker &&
                checkItem.getPosition().equals(pos)) {
                prev = {
                    zoom: window.spivotMapOptions.zoom,
                    center: window.spivotMapOptions.center
                };
                window.spivotMapOptions.prev.push(prev);
                window.spivotMapOptions.center = new google.maps.LatLng(lat, lng);
                window.spivotMapOptions.zoom = 17;
                break;
            }
        }
        iw.setMap(null);
    } else {
        window.spivotMapOptions.zoom += 1;
    }
}

function addStatistic(name, start) {
    if (typeof window.spivotStatistic === 'undefined') {
        window.spivotStatistic = {};
    }
    var time = new Date().getTime() - start;
    var stObj = window.spivotStatistic;
    if (!stObj[name]) {
        stObj[name] = {
            time: time,
            count: 1
        };
    } else {
        stObj[name].time += time;
        stObj[name].count += 1;
    }
}

function addStatistic4Time(name, time) {
    var stObj = window.spivotStatistic;
    if (!stObj[name]) {
        stObj[name] = {
            time: time,
            count: 1
        };
    } else {
        stObj[name].time += time;
        stObj[name].count += 1;
    }
}

function malankaToDoFunction() {
    if (typeof window.spivotMapOptions.prev === 'undefined') {
        window.spivotMapOptions.prev = [];
    }

    var options = window.spivotMapOptions.additional;

    if (options.actions) {
        if (options.actions.go) {
            var iw = window.spivotInfoWindow;
            if (iw && isInfoWindowOpen(iw)) {
                var pos = iw.position;
                var lat = pos.lat();
                var lng = pos.lng();
                iw.setMap(null);
                window.spivotCommon.broadcastMessage("top", "spivotNavigateTesla", {
                    poz: lat + "," + lng
                });
            }
            addStatistic('go', options.timeStart);
        }

        if (options.actions.zoom) {
            addStatistic('zoom', options.timeStart);
            zoomMap2SelectedItem();
        }

        if (options.actions.unzoom) {
            if (window.spivotMapOptions.prev.length > 0) {
                var prev = window.spivotMapOptions.prev.pop();
                window.spivotMapOptions.zoom = prev.zoom;
                window.spivotMapOptions.center = prev.center;
            } else {
                window.spivotMapOptions.zoom -= 1;
            }
        }

        if (options.actions.clearZoomStack) {
            window.spivotMapOptions.prev = [];
        }
    }
}

function markerClusterCalculator(markers, numStyles) {
    var joinTitleData = {};
    for (var i = 0; i < markers.length; i++) {
        var titleData = markers[i].titleData;
        for (key in titleData) {
            var t = titleData[key];
            if (typeof t === "number") {
                if (joinTitleData[key]) {
                    joinTitleData[key] += t;
                } else {
                    joinTitleData[key] = t;
                }
            }
        }
    }

    var available = joinTitleData['Available'];
    var total = joinTitleData['Total'];
    var faulty = joinTitleData['Faulty'];
    var occupied = joinTitleData['Occupied'];
    var ind;
    if (typeof available !== 'undefined' &&
        typeof total !== 'undefined' &&
        typeof faulty !== 'undefined') {
        if (available > 0) {
            ind = 1;
        } else if (occupied > 0) {
            ind = 2;
        } else {
            ind = 3;
        }
    }

    var options = window.spivotMapOptions.additional;
    if (options && options.categoryFilter) {
        if (WCT.OCCUPIED === options.categoryFilter) {
            ind = 2;
        } else if (WCT.FAULTY === options.categoryFilter) {
            ind = 3;
        }
    }

    return {
        text: markers.length,
        index: ind
    };
}



function spivotOnShowAllInfoBtnHandler() {
    let well = localStorage.getItem("lng")
}