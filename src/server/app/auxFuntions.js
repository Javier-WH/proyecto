function isValidImage(string) {

    if (string.includes("data:image/jpeg")) {
        return true;
    }
    if (string.includes("data:image/jpg")) {
        return true;
    }
    if (string.includes("data:image/png")) {
        return true;
    }
    if (string.includes("data:image/bmp")) {
        return true;
    }

    return false;
}

module.exports = { isValidImage }