const jwt = require("jsonwebtoken");
const config = require("./config");
const  checkToken=(req,resp,next)=>{
    const token=req.body.token||req.query.token||req.headers["authorization"];
    //let token = req.headers["authorization"];
    console.log(token);
    token = token.slice(7,token.length);
    if(token)
    {
        jwt.verify(token,config.key,(err,decoded)=>{
            if(err)
            {
                return resp.json({
                    staus:false,
                    msg:"token invalid"
                });
            }
            else
            {
                req.decoded=decoded; 
                next();
            }
        })
    }
    else
    {
        return resp.json(
            {
                    status:false,
                    msg:"token is not provided"
            } 
        )
    }
    next();
    // const token=req.body.token||req.query.token||req.headers["x-access-token"];
    // if(!token){
    //     return resp.statis(403).send("A token is required for authentiction");
    // }
    // try{
    //     const decoded=jwt.checkToken(token,config.TOKEN_KEY);
    //     req.user=decoded;
    // }catch(err){
    //     return resp.status(401).send("Invalid token");
    // }
    // return next();
};
module.exports={
    checkToken: checkToken,
}