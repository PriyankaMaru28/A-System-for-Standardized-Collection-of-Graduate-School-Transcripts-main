var express = require('express');
const { route } = require('./users');
var con = require('../Database/db');
var router = express.Router();
var _ = require('lodash');

const hm = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'E': 0.0, 'F': 0.0 }
const hmNum = [4.0, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.0, 0.0]
const hmAlpha = ['A+', 'A', "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "E"]
/* GET users listing. */

router.get('/api/getGradingSchemes', function (req, res, next) {
  sql = 'select * from gradingschemelist'
  con.query(sql, function (err, gradingSchemelist) {
    if (err) throw err;
    res.send({ 
      gradingSchemelist: gradingSchemelist 
    });
  });
})

router.get('/getUser/:id', function (req, res) {
  let sql = 'select * from user where uid = ?';
  con.query(sql, req.params.id, function (err, userProfile) {
    if (err) throw err;
    res.send({ userProfile: userProfile[0] })
  })
})

// Save and continue the program details - page 1
router.post('/saveProgramDetail', (req, res) => {

  var pDetails = req.body;
  var uid = req.user.id;
  var appId = req.body.appID;

  // If applist has data then update the values else insert it 
  if (!_.isEmpty(appId)) {
    var appID = appId;
    var applicationSqlUpdate = 'Update application SET uid = ?,program = ?,intakeYear=?, intakeTerm=?, EPTName=?, dept=?, route=?, applicationCompleted=? where applicationid=?'
    var applicationValuesUpdate = [uid, pDetails.program, pDetails.intake, pDetails.term, pDetails.ept, pDetails.dept, pDetails.route, 'incomplete', appID]

    con.query(applicationSqlUpdate, applicationValuesUpdate, function (err, app) {
      if (err) throw err;
      var greSql = 'update grescore SET applicationid = ?, GreScore=?, analyticalWriting=?, quantitative=?, verbalReasoning=? where applicationid=?'
      var greValues = [appID, pDetails.overall, pDetails.analytical, pDetails.quantitative, pDetails.verbalReasoning, appID]
      con.query(greSql, greValues, function (err, gre) {
        if (err) throw err;
        console.log("gre...", gre)
      })

      var eptSql = 'update ept SET applicationid=?, EPToverall=?, EPTlisten=?, EPTread=?, EPTwriting=?, EPTspeak=? where applicationid=? '
      var eptValues = [appID, pDetails.eptOverall, pDetails.eptListening, pDetails.eptReading, pDetails.eptWriting, pDetails.eptSpeaking, appID]
      con.query(eptSql, eptValues, function (err, ept) {
        if (err) throw err;
        console.log("ept...", ept)
      })

      res.send({ 'applicationId': appID })
    })

  } else {
    // If the application is being created for the first time 
    var applicationSql = 'insert into application(??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?) ';
    var applicationValues = ['uid', 'program', 'intakeYear', 'intakeTerm', 'EPTName', 'dept', 'route', 'applicationCompleted',
      uid, pDetails.program, pDetails.intake, pDetails.term, pDetails.ept, pDetails.dept, pDetails.route, 'incomplete'];

    con.query(applicationSql, applicationValues, function (err, app) {
      if (err) throw err;
      var appID = app.insertId

      var greSql = 'insert into grescore(applicationid, GreScore, analyticalWriting, quantitative, verbalReasoning) values(?,?,?,?,?)'
      var greValues = [appID, pDetails.overall, pDetails.analytical, pDetails.quantitative, pDetails.verbalReasoning]
      con.query(greSql, greValues, function (err, gre) {
        if (err) throw err;
      })

      var eptSql = 'insert into ept(applicationid, EPToverall, EPTlisten, EPTread, EPTwriting, EPTspeak) values(?,?,?,?,?,?)'
      var eptValues = [appID, pDetails.eptOverall, pDetails.eptListening, pDetails.eptReading, pDetails.eptWriting, pDetails.eptSpeaking]
      con.query(eptSql, eptValues, function (err, ept) {
        if (err) throw err;
      })

      res.send({ 'applicationId': appID })
    })
  }


})

// Save and continue the degree details - page 2
router.post('/saveDegreeDetails', (req, res) => {

  console.log('degree details ', req.body);
  var dDetails = req.body;
  var appID = dDetails.appId;
  // If there are any pending degree applications : 
  var degreeSql = `Select idDegree FROM degree where applicationid=?`;
  con.query(degreeSql, [appID], function (err, iddegree) {
    if (err) throw err

    // if degree details are saved then update the details else create new row for degree details

    if (!_.isEmpty(iddegree)) {
      let newdegreeId = JSON.parse(JSON.stringify(iddegree));
      var degreeID = newdegreeId[0].idDegree;
      var degreeSqlUpdate = 'Update degree SET applicationid = ?,universityName=?, country=?,uniRankWorld=?, startDate=?, endDate=?, uniRankCountry=?,uniRankLink=?,otherRankWorld=?, otherRankCountry=?,otherRankLink=?,degreeLevel=?,program=? where idDegree=?'
      var degreeValuesUpdate = [appID, dDetails.uniName, dDetails.country, dDetails.uniRankWorld, dDetails.degreeStart, dDetails.degreeEnd, dDetails.uniRankCountry,
        dDetails.uniRankLink, dDetails.otherRankWorld, dDetails.otherRankCountry, dDetails.otherRankLink, dDetails.degreeLevel, dDetails.program, degreeID];


      con.query(degreeSqlUpdate, degreeValuesUpdate, function (err, degree) {
        if (err) throw err;
        console.log("inside update degree details...", degree);

        res.send({ 'applicationId': appID, 'degreeId': degreeID })

      })

    } else {
      var degreeSql = 'insert into degree(??,??,??,??,??,??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?,?,?,?,?,?) ';
      var degreeValues = ['applicationid', 'universityName', 'country', 'uniRankWorld', 'startDate', 'endDate', 'uniRankCountry',
        'uniRankLink', 'otherRankWorld', 'otherRankCountry', 'otherRankLink', 'degreeLevel', 'program',
        appID, dDetails.uniName, dDetails.country, dDetails.uniRankWorld, dDetails.degreeStart, dDetails.degreeEnd, dDetails.uniRankCountry,
        dDetails.uniRankLink, dDetails.otherRankWorld, dDetails.otherRankCountry, dDetails.otherRankLink, dDetails.degreeLevel, dDetails.program];

      con.query(degreeSql, degreeValues, function (err, degree) {
        if (err) throw err;
        var degreeID = degree.insertId;

        res.send({ 'applicationId': appID, 'degreeId': degreeID })
      })
    }

  })

})

// Save and continue the Transcript details - page 3
router.post('/saveTranscriptDetails', (req, res) => {
  var tDetails = req.body;
  var degreeID = tDetails.degreeId;
  var appID = tDetails.appId;
  var uid = req.user.id;

  // Check if transcript id already exists if so update the details else insert the details.
  console.log("-------ID DEGREE------", degreeID)
  console.log("-------tDetailsE------",tDetails )
  var transSql = `Select idtranscript FROM transcript where idDegree = ?`

  con.query(transSql, [degreeID], function (err, transcript) {
    if (err) throw err;

    console.log("----TRANSCRIPT-----",transcript)

    if (!_.isEmpty(transcript)) {
      let newtranscriptId = JSON.parse(JSON.stringify(transcript));
      var transcriptID = newtranscriptId[0].idtranscript;

      var transcriptSqlUpdate = 'Update transcript SET idDegree=?,universityName=?,country=?,gradeType=?,averageGrade=?,averageClassGrade=?,academicStanding=? where idtranscript=?';
      var transcriptValuesUpdate = [degreeID, tDetails.uniName, tDetails.country, tDetails.gradeType, tDetails.averageGrade, tDetails.averageClassGrade, tDetails.academicStanding, transcriptID]
      con.query(transcriptSqlUpdate, transcriptValuesUpdate, function (err) {
        if (err) throw err;

        //get gradingscheme table
        var gradingschemetableSql = 'select * from ??'
        con.query(gradingschemetableSql, tDetails.gradeType, function (err, table) {
          if (err) throw err;


          let cId = []
          var courseIdSQL = 'Select idcourse,courseID from course where transcriptid=?'
          con.query(courseIdSQL, transcriptID, function (err, ID) {
            if (err) throw err;
            cId = JSON.parse(JSON.stringify(ID))
            

          })

          console.log("CID...", cId)

            console.log("merge with..", _.mergeWith(tDetails.courses, cId))

          tDetails.courses = _.mergeWith(tDetails.courses, cId)
          console.log("courses", tDetails.courses)

          var score = 0, coursenum = 0;
          for (course of tDetails.courses) {
            coursenum += 1;
            var cDetails = course, gradee;
            console.log("----CDETAILS----")
            console.log(cDetails)
            console.log("----------")
            if (!isNaN(course.courseGrade)) { gradee = parseInt(course.courseGrade, 10); }
            else { gradee = course.courseGrade }
            console.log(gradee)
            for (row of table) {
              //console.log(row)
              //gradesof courses summation
              if ((row.scale1_max >= gradee && gradee >= row.scale1_min) || (row.scale2_max >= gradee && gradee >= row.scale2_min) || (row.gradeDescription == gradee) || (row.degreeClassification == gradee)) {

                score += hm[row.USEquivalent]; break;
              }
            }
            // console.log(score)
            console.log("-------------------------------------")
            console.log("C details...", cDetails)
            console.log("-------------------------------------")
            console.log("COURSE details...", course)
            // if(!_.isEmpty(course.idcourse)){
                  //updating the  grades of courses for that transcriptId
            var courseSql = 'Update course SET transcriptid=?,courseName=?,grade=?,coursedept=?,courseID=? where transcriptid=? and idcourse=?';
            var courseValues = [transcriptID, cDetails.courseName, cDetails.courseGrade, cDetails.courseFaculty, cDetails.courseID, transcriptID, course.idcourse];
            con.query(courseSql, courseValues, function (err) {
              if (err) throw err;
            })

            // }else{
            //       //inserting grades of courses
            // var courseSql = 'insert into course(??,??,??,??,??) values(?,?,?,?,?)';
            // var courseValues = ['transcriptid', 'courseName', 'grade', 'coursedept', 'courseID', transcriptID, cDetails.courseName,
            //   cDetails.courseGrade, cDetails.courseFaculty, cDetails.courseID];
            // con.query(courseSql, courseValues, function (err, course) {
            //   if (err) throw err;
            //   console.log("course...", course)
            // })
            // }
        
          }
          // update in the scores table for that applicationId
          var avgScore = (score / coursenum), avgGrade;
          console.log(avgScore)
          for (i = 0; i < hmNum.length; i++) {

            if (avgScore > hmNum[i]) { avgScore = hmNum[i]; avgGrade = hmAlpha[i]; break }
          }
          var name = req.user.fname + " " + req.user.lname;
          var scoreSql = 'update scores SET applicationid=?,score1=?,score2=?,uid=?,intakeYear=?,intakeTerm=?,userName=?,userEmail=? where applicationid=?';

          con.query(scoreSql, [appID, avgScore, avgGrade, uid, tDetails.intake, tDetails.term, name, req.user.email, appID], function (err, data) {
            if (err) throw err;
            res.send({ ok: 'ok', 'applicationId': appID, 'degreeId': degreeID, 'transcriptId': transcriptID })
          })
        })

      })


    } else {

      var transcriptSql = 'insert into transcript(??,??,??,??,??,??,??) values(?,?,?,?,?,?,?)';
      var transcriptValues = ['idDegree', 'universityName', 'country', 'gradeType', 'averageGrade', 'averageClassGrade', 'academicStanding',
        degreeID, tDetails.uniName, tDetails.country, tDetails.gradeType, tDetails.averageGrade, tDetails.averageClassGrade, tDetails.academicStanding]

      con.query(transcriptSql, transcriptValues, function (err, transcript) {
        if (err) throw err;
        var transcriptID = transcript.insertId;

        //get gradingscheme table
        var gradingschemetableSql = 'select * from ??'
        con.query(gradingschemetableSql, tDetails.gradeType, function (err, table) {
          if (err) throw err;

          var score = 0, coursenum = 0;
          for (course of tDetails.courses) {
            coursenum += 1;
            var cDetails = course, gradee;
            if (!isNaN(course.courseGrade)) { gradee = parseInt(course.courseGrade, 10); }
            else { gradee = course.courseGrade }
            console.log(gradee)
            for (row of table) {
              //console.log(row)
              //gradesof courses summation
              if ((row.scale1_max >= gradee && gradee >= row.scale1_min) || (row.scale2_max >= gradee && gradee >= row.scale2_min) || (row.gradeDescription == gradee) || (row.degreeClassification == gradee)) {

                score += hm[row.USEquivalent]; break;
              }
            }
            console.log(score)
            //inserting grades of courses
            var courseSql = 'insert into course(??,??,??,??,??) values(?,?,?,?,?)';
            var courseValues = ['transcriptid', 'courseName', 'grade', 'coursedept', 'courseID', transcriptID, cDetails.courseName,
              cDetails.courseGrade, cDetails.courseFaculty, cDetails.courseID];
            con.query(courseSql, courseValues, function (err, course) {
              if (err) throw err;
              console.log("course...", course)
            })
          }
          var avgScore = (score / coursenum), avgGrade;
          console.log(avgScore)
          for (i = 0; i < hmNum.length; i++) {

            if (avgScore > hmNum[i]) { avgScore = hmNum[i]; avgGrade = hmAlpha[i]; break }
          }
          var name = req.user.fname + " " + req.user.lname;
          var scoreSql = 'insert into scores(applicationid,score1,score2,uid,intakeYear,intakeTerm,userName,userEmail) values(?,?,?,?,?,?,?,?)';

          con.query(scoreSql, [appID, avgScore, avgGrade, uid, tDetails.intake, tDetails.term, name, req.user.email], function (err, data) {
            if (err) throw err;
            res.send({ ok: 'ok', 'applicationId': appID, 'degreeId': degreeID, 'transcriptId': transcriptID })
          })
        })
      })

    }

  })



})

// Save and continue the work details - page 4
router.post('/saveWorkDetails', (req, res) => {

  var wDetails = req.body;
  var appID = wDetails.appID;
  var degreeID = wDetails.degreeID;
  var transcriptID = wDetails.transcriptID;

  // Check if the work details are already saved for that applicationid
  // if so update using the work id else insert a new row with a new work id
  var workSQl = `Select idWork FROM work where applicationid = ?`;

  con.query(workSQl, [appID], function (err, workId) {
    if (err) throw err

    console.log("workid..", workId)

    if (!_.isEmpty(workId)) {
      let newworkId = JSON.parse(JSON.stringify(workId));
      var workID = newworkId[0].idWork;

      //update work exp details
      var workSql = 'update work SET applicationid=?,field=?,role=?,monthsofExperince=?,company=?,description=?,startDate=?,endDate=? where idwork=?';
      var workValues = [appID, wDetails.workField, wDetails.role, wDetails.monthsOfExp, wDetails.companyName, wDetails.description, wDetails.workStart, wDetails.workEnd, workID];
      con.query(workSql, workValues, function (err, work) {
        if (err) throw err;

        res.send({ ok: 'ok', 'applicationId': appID, 'degreeId': degreeID, 'transciptId': transcriptID, 'workId': workID })
      })

    } else {
      //insert work exp details
      var workSql = 'insert into work(??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?)';
      var workValues = ['applicationid', 'field', 'role', 'monthsofExperince', 'company', 'description', 'startDate', 'endDate',
        appID, wDetails.workField, wDetails.role, wDetails.monthsOfExp, wDetails.companyName, wDetails.description, wDetails.workStart, wDetails.workEnd];
      con.query(workSql, workValues, function (err, work) {
        if (err) throw err;
        var workID = work.insertId;
        res.send({ ok: 'ok', 'applicationId': appID, 'degreeId': degreeID, 'transciptId': transcriptID, 'workId': workID })
      })

    }
  })


})



// Function called when application is submitted 
router.post('/submitStudApplication', (req, res) => {

  console.log("APPLICATION SUBMITTED...")
  console.log(req.body)
  console.log('appID', req.body.appId)

  var uid = req.user.id
  var appId = req.body.appId;

  var applicationSqlUpdate = 'Update application SET applicationCompleted=? where applicationid=?';
  con.query(applicationSqlUpdate, ['complete', appId], function (err, app) {
    if (err) throw err;
    console.log("inside submit ", app)
    res.send({ ok: 'ok' })
  })

})

// Function called when application is submitted 
// router.post('/submitStudApplication', function(req, res, next){
//   var uid = req.user.id
//   var pDetails = req.body.programDetails; var dDetails = req.body.degreeDetails;
//   var tDetails = req.body.transcriptDetails;  var wDetails = req.body.workExpDetails;
//     //insert application and program details
//   var applicationSql = 'insert into application(??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?) ';
//   var applicationValues = [  'uid', 'program', 'intakeYear', 'intakeTerm', 'EPTName', 'dept', 'route','applicationCompleted',
//     uid, pDetails.program, pDetails.intake, pDetails.term, pDetails.ept, pDetails.dept, pDetails.route,'completed'];   

//   con.query(applicationSql, applicationValues, function (err, app) {
//     if (err) throw err;
//     var appID = app.insertId

//     var greSql = 'insert into grescore(applicationid, GreScore, analyticalWriting, quantitative, verbalReasoning) values(?,?,?,?,?)'
//     var greValues = [appID,pDetails.overall,pDetails.analytical,pDetails.quantitative,pDetails.verbalReasoning]
//     con.query(greSql, greValues, function (err, gre) {
//       if(err) throw err;
//     })

//     var eptSql = 'insert into ept(applicationid, EPToverall, EPTlisten, EPTread, EPTwriting, EPTspeak) values(?,?,?,?,?,?)'
//     var eptValues = [appID,pDetails.eptOverall,pDetails.eptListening,pDetails.eptReading,pDetails.eptWriting,pDetails.eptSpeaking ]
//     con.query(eptSql, eptValues, function (err, ept) {
//       if(err) throw err;
//     })

//     //insert work exp details
//     var workSql = 'insert into work(??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?)';
//     var workValues = ['applicationid', 'field', 'role', 'monthsofExperince', 'company', 'description', 'startDate', 'endDate',
//                 appID,wDetails.workField,wDetails.role, wDetails.monthsOfExp, wDetails.companyName, wDetails.description,wDetails.workStart,wDetails.workEnd];
//     con.query(workSql,workValues, function(err){
//                   if (err) throw err;
//     //insert degree and university details  
//     var degreeSql = 'insert into degree(??,??,??,??,??,??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?,?,?,?,?,?) ';
//     var degreeValues = [  'applicationid', 'universityName', 'country', 'uniRankWorld', 'startDate', 'endDate', 'uniRankCountry',
//    'uniRankLink', 'otherRankWorld', 'otherRankCountry', 'otherRankLink', 'degreeLevel', 'program',
//     appID,dDetails.uniName,dDetails.country, dDetails.uniRankWorld, dDetails.degreeStart, dDetails.degreeEnd,dDetails.uniRankCountry,
//     dDetails.uniRankLink,dDetails.otherRankWorld,dDetails.otherRankCountry, dDetails.otherRankLink, dDetails.degreeLevel, dDetails.program ];

//     con.query(degreeSql,degreeValues, function(err, degree){
//       if (err) throw err;
//       var degreeID = degree.insertId;
//       //insert transcript details

//       var transcriptSql = 'insert into transcript(??,??,??,??,??,??,??) values(?,?,?,?,?,?,?)';
//       var transcriptValues = ['idDegree','universityName','country','gradeType','averageGrade','averageClassGrade','academicStanding',
//       degreeID, tDetails.uniName,tDetails.country, tDetails.gradeType, tDetails.averageGrade,tDetails.averageClassGrade, tDetails.academicStanding]

//       con.query(transcriptSql,transcriptValues, function(err, transcript){
//         if (err) throw err;
//         var transcriptID = transcript.insertId;

//         //get gradingscheme table
//         var gradingschemetableSql = 'select * from ??'
//         con.query(gradingschemetableSql, tDetails.gradeType, function(err, table){
//           if(err)  throw err;

//         var score = 0,coursenum = 0;
//         for(course of tDetails.courses){
//           coursenum += 1;
//           var cDetails = course, gradee;
//           if(!isNaN(course.courseGrade)){gradee = parseInt(course.courseGrade, 10);}
//           else{gradee = course.courseGrade}
//           console.log(gradee)
//           for(row of table){
//             //console.log(row)
//             //gradesof courses summation
//             if((row.scale1_max >= gradee && gradee >= row.scale1_min)|| (row.scale2_max >= gradee && gradee >= row.scale2_min) || (row.gradeDescription == gradee)|| (row.degreeClassification == gradee))
//             { 

//               score += hm[row.USEquivalent];break;
//             }
//           }
//           console.log(score)
//           //inserting grades of courses
//           var courseSql = 'insert into course(??,??,??,??,??) values(?,?,?,?,?)';
//           var courseValues = ['transcriptid', 'courseName', 'grade', 'coursedept', 'courseID',transcriptID,cDetails.courseName,
//                            cDetails.courseGrade,cDetails.courseFaculty,cDetails.courseID];
//             con.query(courseSql,courseValues, function(err){
//               if(err)  throw err;
//             })
//          }
//          var avgScore = (score/coursenum),avgGrade;
//          console.log(avgScore) 
//          for(  i = 0; i < hmNum.length; i++){

//           if (avgScore > hmNum[i]){ avgScore = hmNum[i];avgGrade = hmAlpha[i];break}
//          }
//          var  name = req.user.fname+" "+req.user.lname;
//          var scoreSql = 'insert into scores(applicationid,score1,score2,uid,intakeYear,intakeTerm,userName,userEmail) values(?,?,?,?,?,?,?,?)';

//          con.query(scoreSql,[appID,avgScore,avgGrade,uid,pDetails.intake,pDetails.term, name ,req.user.email], function(err,data){
//            if(err) throw err;
//            res.send({ok:'ok'})
//          })
//         })
//       })
//     })
//   })
//   });
// });


router.get('/getSubmittedApplication/:id', function (req, res) {
  console.log('into get submitted application ...')
  var uid = req.params.id, appDetails = { program: null, workExp: null, degree: null, transcript: null }
  console.log(uid)
  var appSql = 'select * from application where uid = ?';
  con.query(appSql, uid, function (err, pDetails) {
    if (err) throw err;
    console.log(pDetails.length)
    var latest = pDetails.length - 1;
    appDetails.program = pDetails[latest];
    console.log(pDetails[latest])
    var greSql = 'select * from grescore where applicationid = ?';
    con.query(greSql, pDetails[latest].applicationid, function (err, greDetails) {
      if (err) throw err;
      if (greDetails.length != 0) {
        greDetails = greDetails[0]
        appDetails.program['overall'] = greDetails.GreScore; appDetails.program['analytical'] = greDetails.analyticalWriting;
        appDetails.program['quantitative'] = greDetails.quantitative; appDetails.program['verbalReasoning'] = greDetails.verbalReasoning;
      }
      var eptSql = 'select * from ept where applicationid = ?'
      con.query(eptSql, pDetails[latest].applicationid, function (err, eptDetails) {
        if (err) throw err;
        if (eptDetails.length != 0) {
          eptDetails = eptDetails[0];
          appDetails.program['eptOverall'] = eptDetails.EPToverall; appDetails.program['eptSpeaking'] = eptDetails.EPTspeak;
          appDetails.program['eptWriting'] = eptDetails.EPTwriting; appDetails.program['eptListening'] = eptDetails.EPTlisten;
          appDetails.program['eptReading'] = eptDetails.EPTread;
        }
        var workExpSql = 'select * from work where ?? = ? ';
        con.query(workExpSql, ['applicationid', pDetails[latest].applicationid], function (err, wDetails) {
          if (err) throw err;
          appDetails.workExp = wDetails[0];
          var degreeSql = 'select * from degree where ?? = ?';
          con.query(degreeSql, ['applicationid', pDetails[latest].applicationid], function (err, dDetails) {
            if (err) throw err;
            appDetails.degree = dDetails[0];
            console.log(dDetails)
            var transcriptSql = 'select * from transcript where idDegree = ?'
            con.query(transcriptSql, dDetails[0].idDegree, function (err, tDetails) {
              if (err) throw err;
              console.log(tDetails)
              var courseSql = 'select * from course where ?? =?';
              con.query(courseSql, ['transcriptid', tDetails[0].idtranscript], function (err, courses) {
                if (err) throw err;
                tDetails[0].courses = [];
                for (course of courses) {
                  tDetails[0].courses.push(course)
                }
                appDetails.transcript = tDetails[0];
                console.log(appDetails)
                res.send({ appDetails: appDetails })
              })
            })
          })
        })
      })
    })
  })
})


module.exports = router;
