const express = require('express');
const bodyParsar = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const app =  express();


// 解析appliaction/x-www-form-urlencoded
app.use(bodyParsar.urlencoded({ extended: true }));




// 自定义全局中间件
const mylogger = function(req,res,next){
    console.log('Loggin middleware');
    console.log('Method:',req.method);
    console.log('Path:',req.path);
    next();
}


app.use(mylogger);
// 解析application/json
app.use(bodyParsar.json());

// 解析text/plain 数据格式
app.use(bodyParsar.text());

// 注入cors模块解决跨域
app.use(cors()); 

app.use("/",routes)


app.use(express.static(path.join(__dirname, 'public')));

// // 从外部路径托管静态文件
// app.use(express.static('/var/www/my-frontend/dist'));

// // 处理前端路由（如 Vue/React 的 history 模式）
// app.get('*', (req, res) => {
//   res.sendFile(path.join('/var/www/my-frontend/dist', 'index.html'));
// });

app.listen(4000, () => {
    console.log('Server is running on port 4000')
})