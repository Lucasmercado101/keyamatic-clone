const { app, BrowserWindow, Menu } = require("electron");
const fs = require("fs");
const path = require("path");
const lessonsPath = path.join(__dirname, "..", "lessons");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 805,
    height: 580,
    minWidth: 805,
    minHeight: 580,
    title: "MecaMatic 3.0",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });
  win.loadURL("http://localhost:3000/");

  // Open the DevTools.
  win.webContents.openDevTools();

  const menuTemplate = [
    {
      label: "Aprendizaje",
      submenu: [
        {
          label: "LECCION 1",
          submenu: [
            {
              label: "Ejercicio 1",
              click() {
                fs.readFile(
                  path.join(lessonsPath, "1.txt"),
                  "utf8",
                  (err, data) => {
                    win.webContents.send("lesson-1-exercise-1", data);
                  }
                );
              }
            },
            {
              label: "Ejercicio 2",
              click() {
                fs.readFile(
                  path.join(lessonsPath, "2.txt"),
                  "utf8",
                  (err, data) => {
                    win.webContents.send("lesson-1-exercise-2", data);
                  }
                );
              }
            },
            {
              label: "Ejercicio 3",
              click() {
                fs.readFile(
                  path.join(lessonsPath, "3.txt"),
                  "utf8",
                  (err, data) => {
                    win.webContents.send("lesson-1-exercise-3", data);
                  }
                );
              }
            },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 2",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 3",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 4",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 5",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 6",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 7",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 8",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 9",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        },
        {
          label: "LECCION 10",
          submenu: [
            { label: "Ejercicio 1" },
            { label: "Ejercicio 2" },
            { label: "Ejercicio 3" },
            { label: "Ejercicio 4" },
            { label: "Ejercicio 5" },
            { label: "Ejercicio 6" },
            { label: "Ejercicio 7" },
            { label: "Ejercicio 8" },
            { label: "Ejercicio 9" },
            { label: "Ejercicio 10" }
          ]
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
