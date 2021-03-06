import assert = require('assert');
import vscode = require('vscode');
import Telemetry from '../src/models/telemetry';

suite('Telemetry Tests', () => {
    test('Correct version of applicationInsights is installed', () => {
        // Find the path of our extension
        let ext = vscode.extensions.getExtension('Microsoft.vscode-pgsql');

        // Open the applicationInsights node module package.json
        const appInsightsPackage: any = require(
            ext.extensionPath + '/node_modules/vscode-extension-telemetry/node_modules/applicationinsights/package.json'
        );
        assert.ok(appInsightsPackage);

        // Verify that it is at least version 0.15.19
        const versionString: string = appInsightsPackage.version;
        assert.ok(versionString);
        const version: number[] = versionString.split('.').map(str => parseInt(str, 10));
        assert.ok(version);

        let versionOk: boolean = false;
        if (version[0] >= 1 ||  // at least 1.x.x
            version[1] >= 16 || // at least 0.16.x
            version[2] >= 19) { // at least 0.15.19
            versionOk = true;
        }
        assert.ok(versionOk, 'Version of applicationInsights must be greater than or equal to 0.15.19. Detected version was ' + versionString);
    });

    test('Path before /out/ is stripped', () => {
        let errorString = '/User/myuser/vscode/extensions/Microsoft.vscode-pgsql-0.0.1/out/src/controller/mainController.js:216.45';
        let expectedErrorString = 'src/controller/mainController.js:216.45';
        let actualErrorString = Telemetry.FilterErrorPath(errorString);
        assert.equal(actualErrorString, expectedErrorString);
    });

    test('Path without /out/ is retained', () => {
        let errorString = '/User/should/never/happen/src/controller/mainController.js:216.45';
        let actualErrorString = Telemetry.FilterErrorPath(errorString);
        assert.equal(actualErrorString, errorString);
    });
});
