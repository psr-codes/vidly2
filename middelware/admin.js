module.exports = function(req, res, next){
    // here we assume that this middelware function is executed after authorisation middelware function
    if (!req.user.isAdmin) return res.status(403).send("Access denied...");
    next();
}