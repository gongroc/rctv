'use strict'

import {app, protocol} from 'electron'
import MainWindow from "../main/MainWindow";
import WebService from "../main/WebService";
import Controller from "../main/Controller";

const mainWindow: MainWindow = MainWindow.getInstance()
const webService: WebService = WebService.getInstance()

new Controller()

protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])


app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    mainWindow.init()
})

app.on('ready', async () => {
    mainWindow.init()
})


app.on('before-quit', () => {
    webService.stop()
})