var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRouter = require('./routes/student');
var cors = require('cors');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve static assests in production
if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'){
  console.log("PATHS....", path.resolve(__dirname,'..','frontend','build','index.html'), '...express static',__dirname+"/../frontend/build")
  // set static folder
  app.use(express.static(path.resolve(__dirname,'..','frontend','build')))

  app.get('/.*/',(req,res)=>
   {
    console.log("GET REQUEST CALLLED...")
    console.log('req... ',req)
    res.sendFile(path.resolve(__dirname,'..','frontend','public','index.html'))
  })

}

  app.use(indexRouter);
  app.use(usersRouter);
  app.use(studentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  //res.render('error');
});

module.exports = app;
