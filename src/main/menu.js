const { Menu, shell, BrowserWindow, ipcMain } = require('electron');

// 获取当前窗口
var mainWindow = BrowserWindow.getFocusedWindow();

// 应用顶部菜单
var mainMenuTemplate = [
    {
        label: '文件',
        submenu: [
            {
                label: '新建',
                click: function () {
                    mainWindow.webContents.send('action', 'new')
                }
            },
            {
                label: '打开',
                click: function () {
                    mainWindow.webContents.send('action', 'open')
                }
            },
            {
                label: '保存',
                click: function () {
                    mainWindow.webContents.send('action', 'save')
                }
            },
            {
                type: 'separator'
            },
            {
                label: '打印',
                click: function () {
                    mainWindow.webContents.send('action', 'print')
                }
            },
            {
                label: '退出',
                click: function () {
                    mainWindow.webContents.send('action', 'exit')
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                role: 'undo'
            },
            {
                label: '恢复',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: '全选',
                role: 'selectAll'
            },
            {
                label: '剪切',
                role: 'cut'
            },
            {
                label: '复制',
                role: 'copy'
            },
            {
                label: '粘贴',
                role: 'paste'
            },
            {
                label: '按类型粘贴',
                role: 'pasteandmatchstyle'
            },
            {
                type: 'separator'
            },
            {
                label: '删除',
                rele: 'delete'
            }
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: '放大',
                role: 'zoomOut'
            },
            {
                label: '缩小',
                role: 'zoomIn'
            },
            {
                label: '重置缩放',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: '全屏',
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: '帮助',
        submenu: [
            {
                label: '关于',
                click() { shell.openExternal('https://github.com/AngleOldPig/oldpignotepad'); }
            }
        ]
    }
];

var mainMenuBuilder = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenuBuilder);

// 右键菜单
const rightClickMenuTemplate = [
    {
        label: '撤销',
        role: 'undo'
    },
    {
        label: '恢复',
        role: 'redo'
    },
    {
        type: 'separator'
    },
    {
        label: '全选',
        role: 'selectAll'
    },
    {
        label: '剪切',
        role: 'cut'
    },
    {
        label: '复制',
        role: 'copy'
    },
    {
        label: '粘贴',
        role: 'paste'
    },
    {
        label: '按类型粘贴',
        role: 'pasteandmatchstyle'
    },
    {
        type: 'separator'
    },
    {
        label: '删除',
        rele: 'delete'
    }
];

var rightClickMenuBuilder = Menu.buildFromTemplate(rightClickMenuTemplate);

// 监听右键事件
ipcMain.on('rightClickMenu', function(){
    rightClickMenuBuilder.popup(BrowserWindow.getFocusedWindow())
})