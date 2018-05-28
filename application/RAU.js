const HTTP = require("../net/http");
const Path = require('../io/path');
const File = require('../io/file');
const FileStream = require('../io/filestream');
const System = require('../device/system');
const sessionManager = new HTTP();

const RemoteUpdateService = {};
RemoteUpdateService.firstUrl  = "";
RemoteUpdateService.secondUrl = "";

var zipPath = "";
if (System.OS === "iOS") {
    zipPath = Path.DataDirectory + "/stage/iOS.zip";
} else if (System.OS === "Android") {
    zipPath = Path.android.storages.internal + "/Android/data/AndroidRAU.zip";
}

RemoteUpdateService.checkUpdate = function(callback, userInfo) {
    checkUpdateFromCache(callback, userInfo);
};

function checkUpdateFromCache(callback, userInfo) {    
    var body = JSON.parse(RAU.getRequestBody());
    delete body.files;
    delete body.binary;
    body = addFieldsForUserInfo(body, userInfo);

    sessionManager.request(
    {
        url: "https://portalapi.smartface.io/api/v1/rau/check?v=" + Math.floor(Math.random() * 100000), // to avoid response cache
        method:'POST',
        body: JSON.stringify(body),
        headers: {
            "CacheFromServer": "true"
        },
        onLoad: function(response) {
            if (response.statusCode === 200) { // Has update
                var responseString = response.body.toString();
                var responseJSON = JSON.parse(responseString);
                RemoteUpdateService.firstUrl  = responseJSON["url"][0];
                RemoteUpdateService.secondUrl = responseJSON["url"][1];
                RAU.setUpdateResponse(responseString);
                
                callback(null, {
                    meta: responseJSON.meta,
                    newVersion: responseJSON.version,
                    revision: responseJSON.revision,
                    download: download
                });
            } else if (response.statusCode === 304) { // No update for Android
                callback("No update", null);
            } else if (response.statusCode === 204) { // There is update but not found in cache
                checkUpdateWithFiles(callback, userInfo);
            } else {
                callback("Unknown Response", null); // Unknown Response
            }
        },
        onError: function(error) {
            if (error.statusCode === 204) {
                checkUpdateWithFiles(callback, userInfo);
            } else if (error.statusCode === 304) { // No update for iOS
                callback("No update", null);
            } else if (error.statusCode === 404 || error.statusCode == 406 || error.statusCode == 400) {
                var responseJSON = JSON.parse(error.body.toString());
                callback(responseJSON.message, null);
            } else {
                callback("Unknown Error", null);
            }
        }}
    );
}

function checkUpdateWithFiles(callback, userInfo) {
    var body = addFieldsForUserInfo(JSON.parse(RAU.getRequestBody()), userInfo);
    sessionManager.request(
    {
        url: "https://portalapi.smartface.io/api/v1/rau/check?v=" + Math.floor(Math.random() * 100000), // to avoid response cache
        method:'POST',
        body: JSON.stringify(body),
        onLoad: function(response) {
            if (response.statusCode === 200) { // Has update
                var responseString = response.body.toString();
                var responseJSON = JSON.parse(responseString);
                RemoteUpdateService.firstUrl  = responseJSON["url"][0];
                RemoteUpdateService.secondUrl = responseJSON["url"][1];
                RAU.setUpdateResponse(responseString);
                
                callback(null, {
                    meta: responseJSON.meta,
                    newVersion: responseJSON.version,
                    revision: responseJSON.revision,
                    download: download
                });
            } else if (response.statusCode === 304) { // No update for Android
                callback("No update", null);
            } else {
                callback("Unknown Response", null); // Unknown Response
            }
        },
        onError: function(error) {
            if (error.statusCode === 304) { // No update for iOS
                callback("No update", null);
            } else if (error.statusCode === 404 || error.statusCode == 406 || error.statusCode == 400) {
                var responseJSON = JSON.parse(error.body.toString());
                callback(responseJSON.message, null);
            } else {
                callback("Unknown Error", null);
            }
        }}
    );
}

function addFieldsForUserInfo(body, userInfo){
    if(userInfo && (typeof(userInfo) !== "string"))
        throw new Error("user parameter must be a string");

    if(userInfo) {
        body.user = userInfo;
    }
    
    const Hardware = require('sf-core/device/hardware');
    body.brand = Hardware.getDeviceModelName();
    body.osVersion = System.OSVersion;

    return body;
}

function download(callback) {
    // TODO: enable firstURL request after IOS-2283
    sessionManager.request(
        {
        url: RemoteUpdateService.secondUrl,
        method: "GET",
        onLoad: function(response) {
            var zipFile = new File({ path: zipPath });
            zipFile.createFile(true);
            var zipFileStream = zipFile.openStream(FileStream.StreamType.WRITE, FileStream.ContentMode.BINARY);
            zipFileStream.write(response.body);
            zipFileStream.close();

            callback(null, {
                updateAll: updateAll,
                updateCancel: updateCancel
            });
        },
        onError: function(error) {
            callback("An error occured while downloding", null);
        }}
    );
};

function updateAll(callback) {
    RAU.updateAll();
    callback(null, "success");
}

function updateCancel(callback) {
    var zipFile = new File({
        path: zipPath
    });
    if(zipFile.exists){
        zipFile.remove();
    }    

    RemoteUpdateService.firstUrl  = "";
    RemoteUpdateService.secondUrl = "";
}

module && (module.exports = RemoteUpdateService);