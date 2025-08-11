exports.list = function(req,res)
{
    res.json({
        list:[
            {
                name:'xxx',
                age:20,
                id:1
        },
        {
            name:'yyy',
            age:21,
            id:2
        },
        ]
    })
}

exports.deleteUser = function(req,res)
{
    res.send('Got a DELETE request at /user')
}