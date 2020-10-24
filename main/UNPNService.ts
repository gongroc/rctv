import MainWindow from "./MainWindow";
const upnp = require('node-upnp-utils');
const UPnPRemote = require('node-upnp-remote');

export default class UNPNService {

    private mainWindow: MainWindow = MainWindow.getInstance()
    private devices: any[] = []
    private movie: any = null
    private remote: any = null
    private connected: any = null
    private playing = false
    private volume = 0

    public fetchDevices(callback: Function) {

        if (this.devices.length > 0) {
            callback(this.devices)
            return
        }
        this.mainWindow.send('device-status-change', 'scanning')

        upnp.startDiscovery();
        setTimeout(() => {
            upnp.stopDiscovery(async () => {
                let deviceList = upnp.getActiveDeviceList();
                for (let device of deviceList) {
                    let ip = device['address'];
                    let name = device['description']['device']['friendlyName'];
                    let url = device['headers']['LOCATION']
                    let checkResult = await this.check(name, url)
                    if (checkResult) {
                        this.devices.push({
                            name: name,
                            url: url,
                            ip: ip
                        })
                    }
                }
                callback(this.devices)
            });
        }, 10000);

    }

    private async check(name: string, url: string) {

        if (name.indexOf("盒子") < 0) {
            return false
        }
        try {
            const remote = new UPnPRemote({
                url: url
            });
            await remote.play()
            return true
        } catch (e) {
            return false
        }
    }

    public async connect(deviceIndex: number) {
        let device = this.devices[deviceIndex]

        if (device == null || this.remote != null) {
            return
        }

        try {
            this.remote = new UPnPRemote({
                url: device.url
            })
            this.remote.on('Volume', (vol: number) => {
                this.volume = vol
                this.mainWindow.send('device-volume-change', vol)
            })
            this.connected = device
            this.mainWindow.send('device-connect-change', 'connected', device)
        } catch (e) {
            this.mainWindow.send('device-connect-change', 'connect-error', device)
        }

    }

    public isConnected() {
        return this.connected
    }

    public async disconnect() {
        if (!this.remote) {
            return
        }

        try {
            await this.remote.removeAllListeners()
            await this.remote.stop()
            this.remote = null
            this.connected = null
            this.mainWindow.send('device-connect-change', 'disconnect')
        } catch (e) {
            console.log(e)
        }
    }

    public async setMovie(url: string) {
        if (!this.remote) {
            return
        }
        await this.remote.setURI({
            uri: url
        })
        this.movie = url
        this.playing = true
        this.mainWindow.send('device-movie-change', url)
        this.mainWindow.send('device-play-change', true)
    }

    public getMovie() {
        return this.movie
    }

    public play() {
        if (this.remote == null || this.movie == null || this.playing) {
            return
        }
        this.remote.play()
        this.playing = true
        this.mainWindow.send('device-play-change', true)
    }

    public isPlaying() {
        return this.playing
    }

    public pause() {
        if (this.remote == null || this.movie == null || !this.playing) {
            return
        }
        this.remote.pause()
        this.playing = false
        this.mainWindow.send('device-play-change', false)
    }

    public setVolume(vol: number) {
        if (!this.remote) {
            return
        }
        this.remote.setVolume(vol)
    }

    public seek(pos: number) {
        if (!this.remote) {
            return
        }
        this.remote.seek(pos)
    }

    public fetchStatus() {
        if (this.remote) {
            this.mainWindow.send('device-connect-change', 'connected', this.connected)
        }
        this.mainWindow.send('device-play-change', this.playing)
        this.mainWindow.send('device-movie-change', this.movie)
        this.mainWindow.send('device-volume-change', this.volume)

    }

}