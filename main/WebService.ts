import MainWindow from "./MainWindow";
import {IpcRendererEvent, OpenDialogReturnValue} from "electron";

const {ipcRenderer, dialog, shell} = require('electron');
const Store = require('electron-store');
const fs = require('fs')
const express = require('express')
const path = require('path')
const rd = require('rd')
const app = express()

export default class WebService {

    private files: any[] = []
    private running = false
    private mainWindow: MainWindow = MainWindow.getInstance()
    private store = new Store();
    private port = 8000
    private server: any
    private static instance: WebService


    private constructor() {
    }

    public static getInstance() {
        if (!WebService.instance) {
            WebService.instance = new WebService()
        }
        return WebService.instance
    }

    private getIp() {
        let interfaces = require('os').networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }

    }

    public getBaseUrl() {
        return 'http://' + this.getIp() + ':' + this.port + '/files/'
    }

    public run() {
        if (this.running) {
            return
        }

        app.use('/files', express.static(this.getDir()))

        this.server = app.listen(this.port, () => {
            this.running = true
            this.mainWindow.send('web-running-change', true, this.getBaseUrl())
        })
    }

    public stop() {
        if (!this.running) {
            return
        }

        this.server.close()
        this.running = false
        this.server = null
        this.mainWindow.send('web-running-change', false)
    }

    public fetchAllFiles() {
        let dir = this.getDir()
        this.files = []
        rd.eachFileSync(dir, (f: string) => {
            let name = f.replace(dir + '/', "")
            this.files.push({
                name: name,
                path: f
            })
        })
        return this.files
    }

    public getDir(): string {
        let homePath = require('os').homedir()
        let dir = path.join(this.store.get('dir', homePath), 'rctv')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        }
        return dir
    }

    public setDir() {
        ipcRenderer.on('openDialog', (event: IpcRendererEvent) => {
            dialog.showOpenDialog({}).then((result: OpenDialogReturnValue) => {
                console.log(result);
            })
        })
    }

    public fetchStatus() {
        if (this.running) {
            this.mainWindow.send('web-running-change', true, this.getBaseUrl())
        }
    }

    public openDir() {
        shell.showItemInFolder(this.getDir());
    }

}