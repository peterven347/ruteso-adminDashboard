const {app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Notification, screen, Tray } = require('electron');
const path = require('path');
const appIcon = nativeImage.createFromPath("./src/assets/backdrop.png")
const isDev = !app.isPackaged;
app.commandLine.appendSwitch("ignore-certificate-errors")

if (isDev) {
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
	})
}

ipcMain.on('notify', (_, message) => {
	new Notification({
		title: app.name,
		body: message,
		icon: __dirname + '/src/assets/backdrop.png',
		hasReply: true
	}).show();
})

app.whenReady().then(() => {
	primaryDisplay = screen.getPrimaryDisplay().bounds
	const { width, height } = primaryDisplay
	const mainWindow = new BrowserWindow({
		title: app.name,
		maxWidth: width,
		maxHeight: height,
		minWidth: 720,
		minHeight: 360,
		icon: "C:/CWP/ruteso/ruteso-adminDashboard/public/faviconn.ico",
		// icon: appIcon,
		backgroundColor: "#fff",
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js')
		}
	})
	function createWindow() {
		mainWindow.loadFile('./public/index.html')
		mainWindow.on("closed", function () { app.quit() })
	}
	const contextMenu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(contextMenu)
	// Menu.setApplicationMenu(null)
	const tray = new Tray(appIcon)
	tray.setToolTip("Rakumi")
	tray.setContextMenu(contextMenu)
	app.setAppUserModelId(app.name)
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
	globalShortcut.register('Control+Shift+I', () => {
		if (mainWindow.webContents.isDevToolsOpened()) {
			mainWindow.webContents.closeDevTools();
		} else {
			mainWindow.webContents.openDevTools();
		}
	});
});


const menuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "Open file",
				accelerator: "Ctrl+C",
				click() {
					console.log(app.name)
				}
			},
			{
				label: "Exit",
				click() {
					app.quit()
				}
			}
		]
	},
	{
		label: "Items",
		submenu: [
			{
				label: "Available Items"
			},
			{
				type: "separator"
			},
			{
				label: "Unavailable Items"
			}
		]
	},
	{
		label: "Users"
	},
	{
		label: "Settings"
	},
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ type: 'separator' },
			{ role: 'toggledevtools' }
		]
	}
]

