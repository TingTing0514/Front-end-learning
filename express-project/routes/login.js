const express = require('express');
const jwt = require('jsonwebtoken');
const loginController = require('../controllers/loginController');
const router = express.Router(); // 模块化路由

// 路由中间件
function login_middleware(req,res,next)
{
    console.log('中间件1');
    next();
    
}

function login_params(req,res,next){
    let { name , password }  = req.query;
    if(!name || !password){
        // 发送消息,结束响应,不需要再调用next
        res.json({
            message:'参数校验失败'
        })
    }else{
        next();
    }
}

router.post('/login', (req,res,next)=>{
    console.log('req', req.body);
    let { username } = req.body;
    const token = jwt.sign({
        username
    },
    'secret',
    {
        expiresIn: '1h'
    });
    res.json({
        message:'登录成功',
        token
    })
});

router.get('/', loginController.register);


module.exports = router;