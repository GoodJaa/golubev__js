delay = 300;

function _toString(coords) {
    if (Array.isArray(coords)) {
        coords = coords.join(",");
    }

    return coords;
}

function getPlacemarks() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(localStorage.getItem('placemarks')));
        }, delay);
    });
}

async function getPlacemark(coords) {
    coords = _toString(coords);

    const placemarks = JSON.parse(localStorage.getItem('placemarks'));
    const placemark = placemarks[coords] ? placemarks[coords] : null;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(placemark);
        }, delay);
    });
}

async function setPlacemark(coords, payload) {
    coords = _toString(coords);

    const placemarks = JSON.parse(localStorage.getItem('placemarks'));
    let status = false;

    if (placemarks[coords]) {
        placemarks[coords].push(payload);
    } else {
        placemarks[coords] = [payload];
        status = true;
    }

    return new Promise(resolve => {
        setTimeout(() => {
            localStorage.setItem('placemarks', JSON.stringify(placemarks));
            resolve(status ? { [coords]: placemarks[coords] } : null);
        }, delay);
    });
}

module.exports = {
    getPlacemarks,
    getPlacemark,
    setPlacemark
};