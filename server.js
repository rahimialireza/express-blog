//server.js

//Moudels
const path=require('path')
var connection = require('./models/config');
var express=require("express");
var bodyParser=require('body-parser');
var app = express();
var session = require('express-session')
app.use(express.static('public')); 
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
var updateController=require('./controllers/update-controller');
const upload=require('./controllers/upload');
const Auth=require('./controllers/middlewares')
const hbs = require('hbs');
app.set('view engine','hbs');
app.use(express.static('public'));
hbs.registerPartials('views/partial');
var flash = require('connect-flash');
app.use(flash());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Query
const query=require('./models/query');

app.get('/register', (req, res) => {
   res.render('register',{
      
   });
});

//Session
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
  })); 

  //Render Login Page
  app.get('/login', (req, res) => {
   res.render('login',{
      
   });
});

//Render Home Page
app.get('/', async (req, res) => {
   try{
         let allPosts=await query("select * from `write` ORDER BY created_at DESC LIMIT 4");
         res.render('index',{
            allPosts,
         });
   }catch(err){
      throw(err)
   }
  
});

//Render Archives Page
app.get('/archives', async (req, res) => {
   try{
         let allPosts=await query("select * from `write` ORDER BY created_at DESC ");
         res.render('archives',{
            allPosts
         });
   }catch(err){
      throw(err)
   }
  
});

//Render About Page
app.get('/about', (req, res) => {
   res.render('about',{
      
   });
});

//Render Contact Page
app.get('/contact', (req, res) => {
   res.render('contact',{
      
   });
})

//Render Comment List Page
app.get('/comment-list',Auth.redirectIfNotTeacher ,async (req, res) => {
   try{
         let listcomment=await query("select * from `comment` where accept=0 AND email = ANY (select email from `users` where role =0) ORDER BY created_at DESC");
         res.render('comment-list',{
            username:req.session.teacher.email,
            listcomment,
         });
   }catch(err){
      throw(err)
   }
  
});

//Render All Of Comments Page
app.get('/allcomment',Auth.redirectIfNotTeacher ,async (req, res) => {
   try{
         let allcomment=await   query("select * from `comment` ORDER BY created_at DESC");
         res.render('allcomment',{
            username:req.session.teacher.email,
            allcomment:allcomment
         });
   }catch(err){
      throw(err)
   }
  
});

//Render Special Comment Page
app.get('/comment/:id',Auth.redirectIfNotTeacher ,async (req, res) => {
   global.commentid=req.params.id
   try{
         let comment=await  query("select * from `comment` where id=?",[commentid]);
         res.render('comment',{
            username:req.session.teacher.email,
            comment:comment[0],
         });
   }catch(err){
      throw(err)
   }
  
});

//Render Accept Comment Page
app.get('/accept-comment',Auth.redirectIfNotTeacher ,async (req, res) => {
   try{
         let acceptcomment=await query("UPDATE `comment` SET accept=1 where id=? ",[commentid]);
         res.redsirect("/comment-list")
   }catch(err){
      res.redirect("/comment-list")
   }
  
});

//Render Delete Comment Page
app.get('/delete-comment',Auth.redirectIfNotTeacher,async (req, res) => {
   let user_id=req.session.teacher.id
   try{
      let deletecomment=await query("DELETE FROM `comment` WHERE id=? ",[commentid])
      res.redsirect("/")
   }catch{
      res.redirect("/comment-list")

   }

});

//Render Special Post Page
app.get('/post/:id',Auth.redirectIftu ,async (req, res) => {
   global.postid=req.params.id
   try{
      let post=await query("select * from `write` where id=?",[postid]);
      let comment =await query("select * from `comment` where post_id=? And accept=1",[postid])
      let countcomment=await query("select count(*) as count from `comment` where post_id=? And accept=1",[postid]);
      res.render('post',{
         post:post[0],
         id:postid,
         user:email,
         name:name,
         last:last,
         com:comment,
         countcomment:countcomment[0].count
      });

   }catch(err){
      res.send("not found!")
   }
});

//Query and Receive Post Id
app.post('/post/:id',Auth.redirectIftu ,async (req, res) => {
   let{content}=req.body
   let create=new Date().toString();
   var date = create.split(' ').splice(0, 5).join(' ')
   var accept
   if(req.session.teacher){
      accept = 1
   }else{
      accept = 0
   }
   try{
      let newcomment=await query("INSERT INTO `comment` (name,last,email,content,created_at,post_id,accept) values (?,?,?,?,?,?,?)",[name,last,email,content,date,postid,accept])
      res.redirect("/")
   }catch{
      res.redirect("/write")

   }

});

//Query Message To Database
app.post('/message',Auth.redirectIfNotTeacher,async (req, res) => {
   let{name,email,phone,message}=req.body
   let create=new Date()
   try{
      let newcomment=await query("INSERT INTO `message` (name,email,phone,message,created_at) values (?,?,?,?,?)",[name,email,phone,message,create])
      res.redirect("/")
   }catch{
      res.redirect("/message")

   }

});

//Render Massage List Page
app.get('/message-list',Auth.redirectIfNotTeacher, async (req, res) => {
   try{
         let allMessages=await   query("select * from `message` ORDER BY created_at DESC");
         res.render('message-list',{
            username:req.session.teacher.email,
            allMessages
         });
   }catch(err){
      throw(err)
   }
  
});

//Render Special Message Page
app.get('/message/:id',Auth.redirectIfNotTeacher ,async (req, res) => {
   let messageid=req.params.id
   try{
      let message=await query("select * from `message` where id=?",[messageid]);
      res.render('message',{
         username:req.session.teacher.email,
         mes:message[0]
      });

   }catch(err){
      res.send("not found!")
   }
});

//Render Teacher Dashboard Page
app.get('/dash',Auth.redirectIfNotTeacher, (req, res) => {
   res.render('dash',{
      username:req.session.teacher.email
   });
});

//Render Student Dashboard Page
app.get('/dash-student',Auth.redirectIfNotUser, (req, res) => {
   res.render('dash-student',{
      username:req.session.user.email
   });
});

//Render Dashboard Page(choose one from student dashboard or teacher dashboard)
app.get('/dashboard',Auth.redirectIftu, (req, res) => {
   res.render('dashboard',{
      email
   });
});

//Render Student List Page
app.get('/student',Auth.redirectIfNotTeacher,async (req, res) => {
try{
   let studentslist = await query("SELECT * FROM users where role ='0'");
   let countstudent = await query("SELECT count(*) as count FROM users where role ='0'");
   res.render("student-list",{
      username:req.session.teacher.email,
      students:studentslist,
      countstudent:countstudent[0].count
   })
}catch{

}
});

//Render Teacher Profile Page
app.get('/profile',Auth.redirectIfNotTeacher, (req, res) => {
   res.render('profile',{
      name:req.session.teacher.name,
      last:req.session.teacher.last,
      username:req.session.teacher.email,
      created:req.session.teacher.created_at
   });
});

//Render Student Profile Page
app.get('/student-profile',Auth.redirectIfNotUser, (req, res) => {
   res.render('student-profile',{
      name:req.session.user.name,
      last:req.session.user.last,
      username:req.session.user.email,
      major:req.session.user.major,
      number:req.session.user.number,
      created:req.session.user.created_at,
      // updated:req.session.user.updated_at
   });
});



//Query Send Post To Database
app.post("/write",Auth.redirectIfNotTeacher,upload.single('image'),async(req,res)=>{
   let {title,subtitle,content}=req.body
   let filePath=req.file.path.substr(6)
   let create=new Date().toString();
   var date = create.split(' ').splice(0, 5).join(' ')
   let user_id=req.session.teacher.id
  
      try{
         let newPost=await query("INSERT INTO `write` (title,subtitle,content,image,created_at,user_id) values (?,?,?,?,?,?)",[title,subtitle,content,filePath,date,user_id])
         res.redirect("/dash")
      }catch{
         res.redirect("/write")

      }
   
})

//Render Write Post Page
app.get('/write',Auth.redirectIfNotTeacher, (req, res) => {
   res.render('write',{
      username:req.session.teacher.email,
   });
});

//Render Student Edit Profile Page
app.get('/edit-profile',Auth.redirectIfNotUser, (req, res) => {
   res.render('edit-profile',{
      username:req.session.user.email
   });
});

//Render Edit Special Post Page
app.get('/edit-post/:id',Auth.redirectIfNotTeacher,async (req, res) => {
   global.edpid=req.params.id
   let post=await query("select * from `write` where id=?",[edpid]);
   res.render('edit-post',{
      username:req.session.teacher.email,
      post:post[0]
   });
});

//Query Edit Post
app.post('/edit-post',Auth.redirectIfNotTeacher,upload.single('image'),async (req, res) => {
   let{title,subtitle,content}=req.body
   let filePath=req.file.path.substr(6)
   let create=new Date().toString();
   var date = create.split(' ').splice(0, 5).join(' ')
   let user_id=req.session.teacher.id
   
   try{
      let updatepost=await query("UPDATE `write` SET title=?,subtitle=?,content=?,image=?,updated_at= ?,user_id=? WHERE id=? ",[title,subtitle,content,filePath,date,user_id,edpid])
      res.redsirect("/list")
   }catch{
      res.redirect("/list")

   }

});

//Render Delete Special Post Page
app.get('/delete-post/:id',Auth.redirectIfNotTeacher,async (req, res) => {
   global.depid=req.params.id
   let post=await query("select * from `write` where id=?",[depid]);
   res.render('delete-post',{
      username:req.session.teacher.email,
      post:post[0]
   });
});

//Query Delete Post
app.post('/delete-post',Auth.redirectIfNotTeacher,async (req, res) => {
   let user_id=req.session.teacher.id
   try{
      let updatepost=await query("DELETE FROM `write` WHERE id=? ",[depid])
      res.redsirect("/")
   }catch{
      res.redirect("/list")

   }

});

//Query Delete Student
app.post('/delete-studnet',Auth.redirectIfNotTeacher,async (req, res) => {
   let{btn}=req.body
   let user_id=req.session.teacher.id
   try{
      let deletestudent=await query("DELETE FROM `users` WHERE email=? ",[btn])
      res.redsirect("/student")
   }catch{
      res.redirect("/student")

   }

});

//Render Post List Page
app.get('/list',Auth.redirectIfNotTeacher,async (req, res) => {

   let post=await query("select * from `write` ORDER BY created_at DESC ");
   res.render('list',{
      username:req.session.teacher.email,
      post
   });
});


app.get('/logout',(req,res) => {
   req.session.destroy((err) => {
       if(err) {
           return console.log(err);
       }
       res.redirect('/login');
   });

});

//API
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
// Controllers(Register Student, Login Student And Teacher, Update Student Information)
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.post('/controllers/update-controller', updateController.update);

//App Listen On Port 8012
app.listen(1998);
