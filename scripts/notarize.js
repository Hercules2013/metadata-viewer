const { notarize } = require('@electron/notarize')

exports.default = async (context) => {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== 'darwin') return

    const appName = context.packager.appInfo.productFilename

    if (!process.env.APPLE_ID)
        throw Error('Environment variables `APPLE_ID` or `APPLE_ID_PASS` are undefined.')

    return await notarize({
        tool: 'notarytool',
        appBundleId: 'io.coderlife.audit.automator.client',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: 'mfdh-kzpj-tqju-wiqw',
        teamId: 'WAKW7HDQD9',
    })
}
