const express = require('express');
const userController = require('../controllers/userController')
const upload = require('../utils/upload')
const router = express.Router();




router.get('/list', userController.list);

router.delete('/delete',userController.deleteUser);


router.post('/upload',upload,(req,res,next)=>{
    console.log(req.file);
    res.send('upload success')
    
})

module.exports = router;
