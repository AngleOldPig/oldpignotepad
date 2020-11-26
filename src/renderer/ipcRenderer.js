var { ipcRenderer, remote } = require('electron');
var fs = require('fs');

var mainWindow = remote.BrowserWindow.getFocusedWindow();

// 获取文本框dom，以便后续操作
var textAreaDom = document.querySelector('#textArea');

// 监听主进程操作，打开右键菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    ipcRenderer.send('rightClickMenu');
})

// 监听主进程操作，进行文件管理
ipcRenderer.on('action', function (event, action) {
    console.log(action);
    switch (action) {
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