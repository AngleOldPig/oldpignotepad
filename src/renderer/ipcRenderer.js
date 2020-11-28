var { ipcRenderer, remote } = require('electron');
var fs = require('fs');
const { domainToUnicode } = require('url');

var mainWindow = remote.BrowserWindow.getFocusedWindow();

// 获取文本框dom，以便后续操作
var textAreaDom = document.querySelector('#textArea');

// 监听主进程操作，打开右键菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    ipcRenderer.send('rightClickMenu');
})

// 顶部菜单所需变量
document.title = 'unnamed';
var isSave = true;      // 判断文件是否保存
var currentFile = '';   // 存放当前文档的路径
// 检查内容输入变化
textAreaDom.oninput = function () {
    if (isSave) {
        document.title += ' *';
        isSave = false;
    }
}

// 监听主进程操作，进行文件管理
ipcRenderer.on('action', function (event, action) {
    console.log(action);
    switch (action) {
        case 'new':
            // 先判断当前文本是否保存
            askSaveDialog();

            textAreaDom.value = '';

            break;

        case 'open':
            // 通过dialog打开文件
            // 渲染进程使用remote.dialog
            remote.dialog.showOpenDialog(mainWindow, {
                // 参数解释可参考文档：
                // https://www.electronjs.org/docs/api/dialog
                properties: [
                    'openFile'
                ]
            }).then(result => {
                console.log(result.filePaths)
            }).catch(err => {
                console.log(err)
            });

            // 获取文件文本，借助fs.readFile
            // result为string[]，地址应取result[0]
            var fsData = fs.readFileSync(result[0]);

            // 将文本放置进文本框
            textAreaDom.innerHTML = fsData;
            break;

        case 'save':
            remote.dialog.showSaveDialog(mainWindow, {
                // 设定保存的默认名称
                // 如果打开过文档，希望能默认用相同的名字保存
                defaultPath: 'unnamed file',
                // 设定保存的后缀名
                filters: [
                    {
                        name: 'All Files',
                        extensions: ['*']
                    }
                ]
            }).then(result => {
                // 使用writeFile必须要带回调函数，有点烦人
                // 文本框里写的内容是.value，不是.innerHTML请注意
                fs.writeFile(result.filePath, textAreaDom.value,
                    function (err) {
                        if (!err) {
                            console.log('保存成功')
                        }
                    });
            }).catch(err => {
                console.log(err)
            });

            break;
    }
})

// 以下为函数尝试，尚未完成

// 判断文件是否保存，并执行保存
function askSaveDialog() {
    if (!isSave) {
        var index = remote.dialog.showMessageBoxSync({
            type: 'question',
            message: '是否保存当前文件？',
            buttons: ['Yes', 'No', 'Cancel']
        })
        // index返回0、1、2，分别对应'Yes','No','Cancel'
        // console.log(index);
        if (index == 0) {
            saveCurrentFile();
        }
    }
}

// 保存当前文件
function saveCurrentFile() {
    if (!currentFile) {
        var dir = remote.dialog.showSaveDialog({
            defaultPath: 'Something',
            filters: [
                {
                    name: 'All Files',
                    extensions: ['*']
                }
            ]
        });

        if (dir) {
            fs.writeFileSync(dir, textAreaDom.value);
            currentFile = dir;
            isSave = true;
            // 改变左上角标题
            document.title = currentFile;
        }
    } else {
        fs.writeFileSync(currentFile, textAreaDom.value);
        isSave = true;
        // 改变左上角标题
        document.title = currentFile;
    }
}