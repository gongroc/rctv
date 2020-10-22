import {createProtocol} from "vue-cli-plugin-electron-builder/lib"
import {app, BrowserWindow, ipcMain} from 'electron'

export default class MainWindow {

    readonly SERVER_URL: string = process.env.WEBPACK_DEV_SERVER_URL as string
    public browserWindow: BrowserWindow | null = null

    private static instance: MainWindow


    private constructor() {
    }

    public static getInstance() {
        if (!MainWindow.instance) {
            MainWindow.instance = new MainWindow()
        }
        return MainWindow.instance
    }


    public init(): void {
        if (this.browserWindow !== null) {
            return
        }

        this.browserWindow = new BrowserWindow({
            width: 1324,
            height: 768,
            resizable: true,
            useContentSize: true,
            zoomToPageWidth: false,
            show: true,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                webSecurity: false
            }
        })
        if (this.SERVER_URL) {
            this.browserWindow.loadURL(this.SERVER_URL as string)
        } else {
            createProtocol('app')
            this.browserWindow.loadURL('app://./index.html')
        }

    }

    public show(): void {
        if (!this.browserWindow) {
            return
        }
        this.browserWindow.show()
        this.browserWindow.center()
    }

    public showAtDomReady(): void {
        if (!this.browserWindow) {
            return
        }
        this.browserWindow.webContents.once("dom-ready", () => {
            this.show()
        })
    }

    public close(): void {
        if (!this.browserWindow) {
            return
        }
        this.browserWindow.hide()
    }

    public destroy(): void {
        if (this.browserWindow) {
            this.browserWindow.close()
            this.browserWindow = null
        }
    }

    public send(topic: string, ...messages: any[]): void {
        if (!this.browserWindow) {
            return
        }
        this.browserWindow.webContents.send(topic, ...messages)
    }

}