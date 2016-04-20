var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');

function readExel(filename, callback) {
	var obj = xlsx.parse(filename);
	callback && callback(obj);	
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* 上传*/
router.post('/upload', function(req, res, next){
   //生成multiparty对象，并配置上传目标路径
   var form = new multiparty.Form({uploadDir: './tmp/'});
   //上传完成后处理
   form.parse(req, function(err, fields, files) {
     var filesTmp = JSON.stringify(files,null,2);
 
     if(err){
       	console.log('parse error: ' + err);
     	res.send({error: 'parse error'});
     } else {
      	console.log('parse files: ' + filesTmp);
       	var inputFile = files.file[0];
       	var uploadedPath = inputFile.path;
       	var dstPath = './tmp/' + inputFile.originalFilename;
       	//重命名为真实文件名
       	fs.rename(uploadedPath, dstPath, function(err) {
         	if(err){
           		console.log('rename error: ' + err);
           		res.send({error: 'rename error'});
         	} else {
           		console.log('rename ok', dstPath);
           		readExel(dstPath, function(data) {
	           	 	res.send({success: true, file: inputFile.originalFilename, data: data});
	           });
         }
       });
    }
  });
});

module.exports = router;
