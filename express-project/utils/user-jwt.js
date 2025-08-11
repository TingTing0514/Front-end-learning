const { expressjwt:jwt } = require('express-jwt');  



const jwtAuth = jwt({
    secret:'sercet',
    algorithms:['HS256']
}).unless({
    path: ["/api/login","/api/register"]  //白名单，不需要token值的接口
});


module.exports = jwtAuth;