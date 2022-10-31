var express = require('express');
const { route } = require('./users');
var con = require('../Database/db');
var router = express.Router();

const hm = {'A+':4.0, 'A':4.0, 'A-':3.7, 'B+':3.3 , 'B':3.0, 'B-':2.7, 'C+': 2.3, 'C': 2.0, 'C-':1.7,'D+':1.3,'D': 1.0,'E':0.0,'F':0.0}
const hmNum = [4.0,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.0,0.0]
const hmAlpha = ['A+','A',"A-","B+","B","B-","C+","C","C-","D+","D","E"]
/* GET users listing. */

router.get('/api/getGradingSchemes', function(req, res, next) {
    sql = 'select * from gradingschemelist'
    con.query(sql,  function (err,gradingSchemelist) {
        if (err) throw err;
        res.send({gradingSchemelist:gradingSchemelist});
  });
})

router.get('/getUser/:id',function(req,res){
  let sql = 'select * from user where uid = ?';
  con.query(sql, req.params.id,function(err,userProfile){
    if(err) throw err;
    res.send({userProfile: userProfile[0]})
  })
})


router.post('/submitStudApplication', function(req, res, next){
  var uid = req.user.id
  var pDetails = req.body.programDetails; var dDetails = req.body.degreeDetails;
  var tDetails = req.body.transcriptDetails;  var wDetails = req.body.workExpDetails;
    //insert application and program details
  var applicationSql = 'insert into application(??,??,??,??,??,??,??) values(?,?,?,?,?,?,?) ';
  var applicationValues = [  'uid', 'program', 'intakeYear', 'intakeTerm', 'EPTName', 'dept', 'route',
    uid, pDetails.program, pDetails.intake, pDetails.term, pDetails.ept, pDetails.dept, pDetails.route];   

  con.query(applicationSql, applicationValues, function (err, app) {
    if (err) throw err;
    var appID = app.insertId

    var greSql = 'insert into grescore(applicationid, GreScore, analyticalWriting, quantitative, verbalReasoning) values(?,?,?,?,?)'
    var greValues = [appID,pDetails.overall,pDetails.analytical,pDetails.quantitative,pDetails.verbalReasoning]
    con.query(greSql, greValues, function (err, gre) {
      if(err) throw err;
    })

    var eptSql = 'insert into ept(applicationid, EPToverall, EPTlisten, EPTread, EPTwriting, EPTspeak) values(?,?,?,?,?,?)'
    var eptValues = [appID,pDetails.eptOverall,pDetails.eptListening,pDetails.eptReading,pDetails.eptWriting,pDetails.eptSpeaking ]
    con.query(eptSql, eptValues, function (err, ept) {
      if(err) throw err;
    })
    
    
    
    
    //insert work exp details
    var workSql = 'insert into work(??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?)';
    var workValues = ['applicationid', 'field', 'role', 'monthsofExperince', 'company', 'description', 'startDate', 'endDate',
                appID,wDetails.workField,wDetails.role, wDetails.monthsOfExp, wDetails.companyName, wDetails.description,wDetails.workStart,wDetails.workEnd];
    con.query(workSql,workValues, function(err){
                  if (err) throw err;
    //insert degree and university details  
    var degreeSql = 'insert into degree(??,??,??,??,??,??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?,?,?,?,?,?) ';
    var degreeValues = [  'applicationid', 'universityName', 'country', 'uniRankWorld', 'startDate', 'endDate', 'uniRankCountry',
   'uniRankLink', 'otherRankWorld', 'otherRankCountry', 'otherRankLink', 'degreeLevel', 'program',
    appID,dDetails.uniName,dDetails.country, dDetails.uniRankWorld, dDetails.degreeStart, dDetails.degreeEnd,dDetails.uniRankCountry,
    dDetails.uniRankLink,dDetails.otherRankWorld,dDetails.otherRankCountry, dDetails.otherRankLink, dDetails.degreeLevel, dDetails.program ];
  
    con.query(degreeSql,degreeValues, function(err, degree){
      if (err) throw err;
      var degreeID = degree.insertId;
      //insert transcript details

      var transcriptSql = 'insert into transcript(??,??,??,??,??,??,??) values(?,?,?,?,?,?,?)';
      var transcriptValues = ['idDegree','universityName','country','gradeType','averageGrade','averageClassGrade','academicStanding',
      degreeID, tDetails.uniName,tDetails.country, tDetails.gradeType, tDetails.averageGrade,tDetails.averageClassGrade, tDetails.academicStanding]

      con.query(transcriptSql,transcriptValues, function(err, transcript){
        if (err) throw err;
        var transcriptID = transcript.insertId;

        //get gradingscheme table
        var gradingschemetableSql = 'select * from ??'
        con.query(gradingschemetableSql, tDetails.gradeType, function(err, table){
          if(err)  throw err;

        var score = 0,coursenum = 0;
        for(course of tDetails.courses){
          coursenum += 1;
          var cDetails = course, gradee;
          if(!isNaN(course.courseGrade)){gradee = parseInt(course.courseGrade, 10);}
          else{gradee = course.courseGrade}
          console.log(gradee)
          for(row of table){
            //console.log(row)
            //gradesof courses summation
            if((row.scale1_max >= gradee && gradee >= row.scale1_min)|| (row.scale2_max >= gradee && gradee >= row.scale2_min) || (row.gradeDescription == gradee)|| (row.degreeClassification == gradee))
            { 
              
              score += hm[row.USEquivalent];break;
            }
          }
          console.log(score)
          //inserting grades of courses
          var courseSql = 'insert into course(??,??,??,??,??) values(?,?,?,?,?)';
          var courseValues = ['transcriptid', 'courseName', 'grade', 'coursedept', 'courseID',transcriptID,cDetails.courseName,
                           cDetails.courseGrade,cDetails.courseFaculty,cDetails.courseID];
            con.query(courseSql,courseValues, function(err){
              if(err)  throw err;
            })
         }
         var avgScore = (score/coursenum),avgGrade;
         console.log(avgScore) 
         for(  i = 0; i < hmNum.length; i++){
          
          if (avgScore > hmNum[i]){ avgScore = hmNum[i];avgGrade = hmAlpha[i];break}
         }
         var  name = req.user.fname+" "+req.user.lname;
         var scoreSql = 'insert into scores(applicationid,score1,score2,uid,intake,userName,userEmail) values(?,?,?,?,?,?,?)';
        
         con.query(scoreSql,[appID,avgScore,avgGrade,uid,pDetails.intake,name ,req.user.email], function(err,data){
           if(err) throw err;
           res.send({ok:'ok'})
         })
        })
      })
    })
  })
  });
});


router.get('/getSubmittedApplication/:id',function(req,res){
  console.log('into get submitted application ...')
  var uid = req.params.id ,appDetails = {program : null, workExp: null , degree: null, transcript: null}
  console.log(uid)
  var appSql = 'select * from application where uid = ?';
  con.query(appSql, uid, function(err,pDetails){
    if(err)  throw err;
    console.log(pDetails.length)
    var latest = pDetails.length -1 ;
    appDetails.program = pDetails[latest] ;
    console.log(pDetails[latest])
    var greSql = 'select * from grescore where applicationid = ?';
    con.query(greSql, pDetails[latest].applicationid, function(err,greDetails){
      if(err)  throw err;
      if(greDetails.length != 0){
      greDetails = greDetails[0]
      appDetails.program['overall']= greDetails.GreScore;  appDetails.program['analytical']= greDetails.analyticalWriting;
      appDetails.program['quantitative']= greDetails.quantitative ;appDetails.program['verbalReasoning']= greDetails.verbalReasoning;
      }
      var eptSql = 'select * from ept where applicationid = ?'
      con.query(eptSql, pDetails[latest].applicationid, function(err,eptDetails){
        if(err)  throw err;
        if(eptDetails.length != 0){
        eptDetails = eptDetails[0];
        appDetails.program['eptOverall']=eptDetails.EPToverall;appDetails.program['eptSpeaking'] = eptDetails.EPTspeak;
        appDetails.program['eptWriting'] =eptDetails.EPTwriting;appDetails.program['eptListening']=eptDetails.EPTlisten;
        appDetails.program['eptReading'] =eptDetails.EPTread;
        }
    var workExpSql = 'select * from work where ?? = ? ';
    con.query(workExpSql,['applicationid' ,pDetails[latest].applicationid],function(err, wDetails){
      if(err) throw err;
      appDetails.workExp = wDetails[0];
      var degreeSql = 'select * from degree where ?? = ?';
      con.query(degreeSql,['applicationid',pDetails[latest].applicationid], function(err, dDetails){
        if(err) throw err;
        appDetails.degree = dDetails[0];
        console.log(dDetails)
        var transcriptSql = 'select * from transcript where idDegree = ?'
        con.query(transcriptSql,dDetails[0].idDegree,function(err,tDetails){
          if(err) throw err;          
          console.log(tDetails)
          var courseSql = 'select * from course where ?? =?';
          con.query(courseSql,['transcriptid',tDetails[0].idtranscript],function(err,courses){
            if(err) throw err;
            tDetails[0].courses = [];
            for(course of courses){
              tDetails[0].courses.push(course)
            }
            appDetails.transcript = tDetails[0];
            console.log(appDetails)
            res.send({appDetails:appDetails})
          })
        })
      })
    })
  })
  })
  })
})


module.exports = router;
