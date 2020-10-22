import {ipcMain} from "electron";

export default class Controller {

    constructor() {
        this.bindUNPNService()
        this.bindWebService()
    }

    public bindUNPNService() {
        let unpnService = new (require('./UNPNService').default)
        ipcMain.on('device-fetch-all-devices', (event) => {
            unpnService.fetchDevices((result: any) => {
                event.sender.send('device-fetch-all-devices-result', result)
            })
        })
        ipcMain.on('device-connect', (event, deviceIndex) => {
            unpnService.connect(deviceIndex)
        })

        ipcMain.on('device-disconnect', (event) => {
            unpnService.disconnect()
        })

        ipcMain.on('device-set-movie', (event, url) => {
            unpnService.setMovie(url)
        })

        ipcMain.on('device-get-movie', (event) => {
            event.returnValue = unpnService.getMovie()
        })

        ipcMain.on('device-play', (event) => {
            unpnService.play()
        })

        ipcMain.on('device-pause', (event) => {
            unpnService.pause()
        })

        ipcMain.on('device-set-volume', (event, vol) => {
            unpnService.setVolume(vol)
        })

        ipcMain.on('device-fetch-status', (event) => {
            unpnService.fetchStatus()
        })


    }

    public bindWebService() {
        let webService = (require('./WebService').default).getInstance()

        ipcMain.on('web-fetch-all-files', (event) => {
            let result = webService.fetchAllFiles()
            event.sender.send('web-fetch-all-files-result', result)
        })

        ipcMain.on('web-run', (event) => {
            webService.run()
        })

        ipcMain.on('web-stop', (event) => {
            webService.stop()
        })

        ipcMain.on('web-fetch-status', (event) => {
            webService.fetchStatus()
        })

        ipcMain.on('web-open-dir', (event) => {
            webService.openDir()
        })

    }

}