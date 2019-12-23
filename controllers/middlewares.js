//middlewares.js

//Teacher Dont Access
let redirectIfNotTeacher=(req,res,next)=>{
    if(req.session.teacher) next();
    else res.redirect('/login')
}

//User Dont Access
let redirectIfNotUser=(req,res,next)=>{
    if(req.session.user) next();
    else res.redirect('/login')
}

//People Dont Access
let redirectIfteachertUser=(req,res,next)=>{
    if(req.session.user || req.session.teacher) next();
    else res.redirect('/login')
}

//People Dont Access(send varible to server)
let redirectIftu=(req,res,next)=>{
    if(req.session.user ) {
         email=req.session.user.email
         name=req.session.user.name
         last=req.session.user.last
        next();
    }
    else if(req.session.teacher){
        email=req.session.teacher.email
        name=req.session.teacher.name
        last=req.session.teacher.last
        next();
    }
    else res.redirect('/login')
}

module.exports={
    redirectIfNotTeacher,
    redirectIfNotUser,
    redirectIfteachertUser,
    redirectIftu
}