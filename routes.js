/*
 * routes.js -- module to providing routing
 *
 */
 var configRoutes;

 configRoutes = function(app, server, mysql, uuid, fs, jsonObj) {
	//ispost
	   
	    app.get('/apply',function(req,res){ 
	    	var inputFileName = 'public/applylist.json';
	    	var readInData = null;
	    	try {
	    	           readInData = fs.readFileSync(inputFileName,'utf-8');
	    	           jsonObj = JSON.parse(readInData);    
	    	           console.log("++++:"+jsonObj);
	    	}catch(e) { //捕获如果文件不存在引起的错误          
 		    }
	        //			
 			res.redirect('/applylists.html');
 		});

 		//connect to remote db 125.20.238.234
 		app.post('/delete',function(req,res) {
 			for(var i = 0,len = jsonObj.applied.length; i < len; i++) { //literation
 				if( req.body.uniqueid == jsonObj.applied[i].uniqueid){
 					jsonObj.applied.splice(i,1);
 					break;
 				}
 			}
 			var outputFileName = 'public/applylist.json';

 			if(jsonObj.applied.length === 0) {
 				fs.unlinkSync(outputFileName);
 			} else {

 				fs.writeFile(outputFileName, JSON.stringify(jsonObj), function(err) {
 				    if(err) {
 				      console.log(err);
 				      res.json({state:"0"});
 				    } else {
 				      console.log("Delete Successfully. ");
 				      res.json({state:"1"});
 				    }
 				});
 			}
 		});

 		app.post('/save',function(req,res) {
 			var outputFileName = 'public/applylist.json';
 			var inputFileName = 'public/applylist.json';
 			var readInData = null;		
 		try {
            readInData = fs.readFileSync(inputFileName,'utf-8');
            jsonObj = JSON.parse(readInData);
            req.body.uniqueid = uuid.v1();
            if( req.body.notes === '') { // if notes is empty,set to default value 'nodata'
            	req.body.notes = 'nodata';
            }
 			jsonObj.applied.push(req.body);
 			fs.writeFile(outputFileName, JSON.stringify(jsonObj), function(err) {
 			    if(err) {
 			      console.log(err);
 			      res.json({state:"0"});
 			    } else {
 			      console.log("JSON saved to " + outputFileName);
 			      res.json({state:"1",uniqueid:req.body.uniqueid});
 			    }
 			});
 		}catch(e) { //捕获如果文件不存在引起的错误
           readInData = {   //生成一个对应格式的JSON对象并补全数据
           	applied:[{
           		companyName:req.body.companyName,
           		applyDate:req.body.applyDate,
           		uniqueid:uuid.v1(),
           		notes:req.body.notes
           	}
           	]
           };
           if( req.body.notes === '') { // if notes is empty,set to default value 'nodata'
           	console.log('-------00000-----------');
           	readInData.applied[0].notes = 'nodata';
           }

           jsonObj = readInData;
           fs.writeFile(outputFileName, JSON.stringify(jsonObj), function(err) {
               if(err) {
                 console.log(err);
                 res.json({state:"0"});
               } else {
                 console.log("JSON saved to " + outputFileName);
                 res.json({state:"2",uniqueid:jsonObj.applied[0].uniqueid});
               }
           });

 		}		
 		  });
	
 		
 };

 module.exports = { configRoutes: configRoutes };