var express = require('express');
var router = express.Router();
var con = require('../Database/db');
const excel = require("exceljs");
/* GET users listing. */


router.get('/getStudentScores',function(req,res ){
    console.log("LL")
    var scoresSql = 'select * from scores';
    con.query(scoresSql, function(err,scoresList){
        if(err) throw err
        res.send({scoreData:scoresList})
    })
})

router.post('/addEPT',function(req,res){
  let user = req.user, body = req.body;
  console.log(body)
  let sql = 'insert into gradrequests(requestType, uid, userName, description, userEmail) values(?,?,?,?,?)'
  let values = ['EPT',user.id,user.fname+' '+user.lname,body.description,user.email]
  con.query(sql,values,function(err){
      if(err) throw err;
      res.send({ok:true})
  })
})
router.post('/addGradingScheme',function(req,res){
    let user = req.user, body = req.body;
    console.log(body)
    let sql = 'insert into gradrequests(requestType, uid, userName, description, userEmail) values(?,?,?,?,?)'
    let values = ['Grading scheme',user.id,user.fname+' '+user.lname,body.description,user.email]
    con.query(sql,values,function(err){
        if(err) throw err;
        res.send({ok:true})
    })
  })


router.get('/getAdminRequests',function(req,res){
    let sql = 'select * from gradrequests';
    con.query(sql,function(err,gradrequests ){
        if(err) throw err;
        res.send({'gradrequests':gradrequests})
    })
})
  

router.get('/getExcel',function(req,res){
    var scoresSql = 'select * from scores ORDER BY uid ASC';
    con.query(scoresSql, function(err,scoresList){
        if(err) throw err;
        let scoresArr =[]
        for(var i of scoresList){scoresArr.push(i)}
    var coursesql = 'select uid, userName,courseID,courseName,coursedept, grade  from course ORDER BY uid ASC' ;
    con.query(coursesql, function(err,coursesList){
        if(err) throw err;
        let coursesArr =[]
        for(var i of coursesList){coursesArr.push(i)}
    
    let workbook = new excel.Workbook(); //creating workbook
    let worksheet1 = workbook.addWorksheet("scores"); //creating worksheet
    let worksheet2 = workbook.addWorksheet("courses"); //creating worksheet
    worksheet1.columns =  [
        { label: "Applicant ID", key: "uid" },{ label: "Applicant Name", key: "userName" },{label:'Applicant Email', key: 'userEmail'},
        { label: "Numeric Score", key: "score1" }, { label: "Grade", key: "score2" },
        { label: "Intake", key: "intake" }
      ];
      worksheet2.columns =  [{ label: "User ID", key: "uid" },{ label: "User Name", key: "userName" },
                    { label: "Course ID", key: "courseID" },{ label: "Course Name", key: "courseName" },
                    { label: "Faculty", key: "coursedept" },{ label: "Course Grade", key: "grade" }
    ]
    // Add Array Rows
    worksheet1.getRow(1).values = ['Applicant ID', 'Applicant Name', 'Applicant Email', 'Numeric Score',"Grade","Intake"];
    worksheet1.addRows(scoresArr);
    worksheet2.getRow(1).values = ['Applicant ID', 'Applicant Name', 'Course ID', 'Course Name',"Faculty","Course Grade"];
    worksheet2.addRows(coursesArr);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "studentDetails.xlsx"
    );
    workbook.xlsx.write(res).then(function (data) {
      res.end();
      console.log("File write done........");
    })
})  
})
})


module.exports = router;
