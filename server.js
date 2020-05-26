const express = require('express');
const express_sessions = require('express-session');
const passport= require('./passport');
const path= require('path');
const http= require('http');
const socketio= require('socket.io');   

const app= express();
const port = process.env.PORT || 3000;
const server= http.createServer(app);
const io= socketio(server);

app.set("io",io); //now we can access io in routes using app.get

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express_sessions({
    secret: 'SachinTendulkarIsTheBestBatsmanOfAllTime'
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname,'public')));
app.use('/signup',require('./route/signup').route);
app.use('/login',require('./route/login').route);
app.use('/root',require('./route/root').route);
app.use('/homepage',require('./route/homepage').route);
app.use('/admin',require('./route/admin').route);
app.use('/friend_request',require('./route/friend_request').route);
app.use('/notification',require('./route/notification').route);
app.use('/account_user',require('./route/account_user').route);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,'public','error','index.html'));
})

app.listen(port,()=>{console.log('Hosted on http://localhost:3000 ')});

module.exports={
    app
}