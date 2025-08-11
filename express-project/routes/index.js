const express = require('express');
const jwtAuth = require('../utils/user-jwt');
const userRouter = require('./user');
const loginRouter = require('./login');

const routes = express.Router();

routes.use(jwtAuth);

routes.use('/api',userRouter); //注入用户路由模块

routes.use('/api',loginRouter); //注入登录路由模块


routes.use((err,req,res,next)=>{
    console.log("err===",err);
    if(err && err.name === "UnauthorizedError"){
        const { status = 401,message } = err;
        res.status(status).json({
            code:status,
            msg:"token失效，请重新登录",
            data:null
        })
    }else{
        const { output } = err || {};
        const errCode = (output && output.statusCode) || 500;
        const errMsg = (output && output.payload && output.payload.error) || err.message;
        res.status(errCode).json({
            code:errCode,
            msg:errMsg,
        })    
    }
    
})


module.exports = routes;