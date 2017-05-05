/**
 * 检查更新
 */
function CodePush(container, progressCon, progressLine, callback) {
    this.container = container;
    this.progressCon = progressCon;
    this.progressLine = progressLine;
    this.callback = callback;
}

CodePush.prototype = {
    checkUpdate: function (container, progressCon, progressLine, callback) {
        var downloadProgress = function (progress) {
            var scale = Math.floor(progress.receivedBytes / progress.totalBytes * 100);
            progressLine.style.width = scale + '%';
        };

        var onPackageDownloaded = function (localPackage) {
            // you can now update your application to the downloaded version by calling localPackage.install()
            localPackage.install(onInstallSuccess, onError, {
                installMode: InstallMode.ON_NEXT_RESUME,
                minimumBackgroundDuration: 120
            });
        };

        var onError = function (error) {
            callback && callback();
            container.style.display = 'none';
            console.log('An error occurred. ' + error);
        };

        var onInstallSuccess = function () {
            console.log('Installation succeeded.');
            setTimeout(window.codePush.restartApplication, 100);
            progress.style.display = 'block';
            container.style.display = 'none';
        };

        var onUpdateCheck = function (remotePackage) {
            if (!remotePackage) {
                callback && callback();
                container.style.display = 'none';
                console.log('The application is up to date.');
            } else {
                progressCon.style.display = 'block';
                console.log('A CodePush update is available. Package hash: ' + remotePackage.packageHash);
                remotePackage.download(onPackageDownloaded, onError, downloadProgress);
            }
        };
        console.log(window.codePush);
        if (window.codePush) {
            container.style.display = 'block';
            window.codePush.checkForUpdate(onUpdateCheck, onError);
        } else {
            callback();
        }
    }
}

module.exports = CodePush;
