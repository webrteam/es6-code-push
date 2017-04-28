/**
 * 检查更新
 */
function  CodePush(container, progressCon, progress, callback) {
    this.container = container;
    this.progressCon = progressCon;
    this.progress = progress;
    this.callback = callback;
}

CodePush.prototype = {
    checkUpdate: function () {
        var _this = this;
        var downloadProgress = function (progress) {
            var scale = Math.floor(progress.receivedBytes / progress.totalBytes * 100);
            _this.progress.style.width = scale + '%';
        };

        var onPackageDownloaded = function (localPackage) {
            // you can now update your application to the downloaded version by calling localPackage.install()
            localPackage.install(onInstallSuccess, onError, {
                installMode: InstallMode.ON_NEXT_RESUME,
                minimumBackgroundDuration: 120
            });
        };

        var onError = function (error) {
            _this.callback && _this.callback();
            alert('An error occurred. ' + error);
        };

        var onInstallSuccess = function () {
            alert('Installation succeeded.' + elProcessBar);
            setTimeout(codePush.restartApplication, 100);
            _this.progress.style.display = 'block';
            _this.container.style.display = 'none';
        };

        var onUpdateCheck = function (remotePackage) {
            if (!remotePackage) {
                _this.callback && _this.callback();
                _this.container.style.display = 'none';
                alert('The application is up to date.');
            } else {
                _this.progressCon.style.display = 'block';
                alert('A CodePush update is available. Package hash: ' + remotePackage.packageHash);
                remotePackage.download(onPackageDownloaded, onError, downloadProgress);
            }
        };

        if (window.codePush) {
            alert('dads');
            _this.container.style.display = 'block';
            window.codePush.checkForUpdate(onUpdateCheck, onError);
        } else {
            _this.callback();
        }
    }
}

module.exports = CodePush;
