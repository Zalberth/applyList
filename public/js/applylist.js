$(function() {
	var masker = '<div id="maskArea"></div>';
    var addNotesShow = 0;
    var postPermission = 0;
    $.ajax({
    	type:'get',
    	contentType: 'application/json; charset=utf-8',
    	dataType:'json',
    	url:'applylist.json',
    	success:function(applylist) {
    		var showApplyList ='<ul id="myList">';
    		for( var i = 0,len = applylist.applied.length; i < len; i++ ) {
    			showApplyList += '<li data-uuid="'+applylist.applied[i].uniqueid+'">'+'<div class="cpName">'+applylist.applied[i].companyName+'</div>'+'<div class="apDate">'+applylist.applied[i].applyDate+'</div>'+'<div class="detail"></div>'+'<div class="notesContent">'+applylist.applied[i].notes+'</div>'+'<div class="del-btn">删除</div>'+'</li>';
    		}
    		showApplyList += '</ul>';
    		$('#content .applylist').append(showApplyList);
    		bindListEvent();
    		
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) {
              
               alert("你暂时没有投递记录！");
            }

    });
	

	$('#header .add-new').on('click',function() {
		$('body').append(masker);
		var inputZone = '<form id="applyInfo">'
						+'<span class="addNotes">添加备注</span>'
						+'<input id="companyName" type="text" name="companyName" placeholder="公司名"/>'
						+'<input id="applyDate" type="text" name="applyDate" placeholder="申请日期"/>'
						+'<textarea id="notes" name="notes"></textarea>'
						+'<button type="button" class="confirm">提交</button>'
						+'<button type="button" class="cancelMe">取消</button>'
						+'</form>';
		$('#maskArea').before(inputZone);
		$('#applyInfo .addNotes').on('click',function() {
			// body...
			if(addNotesShow === 0) {
				$(this).text('取消备注');
				$('#applyInfo').stop().animate({height:"+=100px"});
				$('#applyInfo textarea').stop().animate({height:"+=100px"});
				addNotesShow = 1;
			}else if (addNotesShow === 1) {
				$(this).text('添加备注');

				$('#applyInfo').stop().animate({height:"-=100px"});
				$('#applyInfo textarea').stop().animate({height:"0px"},function() {
					// body...
					$(this).val('');
				});
				addNotesShow = 0;
			}
			
		});
		$('#maskArea').on('click',function(e) {
			e.stopPropagation();	
			addNotesShow = 0;				
			$(this).remove();
			$('#applyInfo').remove();			
	    });
	    $('#applyInfo button.cancelMe').on('click',function(e) {
	    	e.preventDefault();
	    	addNotesShow = 0;
	    	$('#maskArea').remove();
	    	$('#applyInfo').remove();
	    });
	    $('#applyInfo button.confirm').on('click',function(e) {
	    	e.preventDefault();
	    	
	    	var regx = /^\d{4}-\d{1,2}-\d{1,2}$/;
	    	//JSON化数据，POST，存入JSON文件，更新DOM
	    	var formData = $('#applyInfo').serializeJson();
	    	var newItem = '';
	    	var result = regx.test(formData.applyDate); //mached:true,failed:false
	    	if(addNotesShow === 1) { //if notes open
	    		if(formData.notes === '') { // if no visible notes
	    			postPermission = 0;
	    			alert("请输入备注，否则点击取消备注");
	    		}else {
	    			if(formData.companyName === ''){
	    				    			postPermission = 0;
	    				    			alert("请输入公司名称");
	    				    		}else { // if companyName is not empty
	    				    				if(result) {
	    				    					postPermission = 1;
	    				    					console.log("Date Format confirm....");	    					
	    				    				}else {
	    				    					postPermission = 0;
	    				    					alert("请输入正确的日期格式：XXXX-MM-DD");
	    				    				}
	    		    }
	    		}
	    	}else if(addNotesShow === 0) {
	    		if(formData.companyName === ''){
	    			postPermission = 0;
	    			alert("请输入公司名称");
	    		}else { // if companyName is not empty
	    				if(result) {
	    					postPermission = 1;
	    					console.log("Date Format confirm....");	    					
	    				}else {
	    					postPermission = 0;
	    					alert("请输入正确的日期格式：XXXX-MM-DD");
	    				}
	    		}
	    	}
	    	if( postPermission === 1) {  // 
	    		postPermission = 0;
	    		$.post('/save',formData,function(dataReturn) {
	    			if( dataReturn.state !== '0') {
	    					if( dataReturn.state === '1') {
	    						console.log("Inserted!");
	    						newItem = '<li data-uuid="'+dataReturn.uniqueid+'">'+'<div class="cpName">'+formData.companyName+'</div>'+'<div class="apDate">'+formData.applyDate+'</div>'+'<div class="detail"></div>'+'<div class="notesContent">'+formData.notes+'</div>'+'<div class="del-btn">删除</div>'+'</li>';
	    						$('ul#myList').append(newItem);
	    						bindListEvent();
	    						
	    						
	    					}else if ( dataReturn.state === '2') {
	    						newItem = '<ul id="myList"><li data-uuid="'+dataReturn.uniqueid+'">'+'<div class="cpName">'+formData.companyName+'</div>'+'<div class="apDate">'+formData.applyDate+'</div>'+'<div class="detail"></div>'+'<div class="notesContent">'+formData.notes+'</div>'+'<div class="del-btn">删除</div>'+'</li></ul>';
	    						$('#content .applylist').append(newItem);
	    					    bindListEvent();
	    						
	    						
	    					}
	    				addNotesShow = 0;
	    				$('#maskArea').remove();
	    			    $('#applyInfo').remove();
	    			}
	    			
	    		});
	    	}
	    	
	    		    	
	    });
	});

    function bindListEvent() {
    	// body...
    	$('#myList .detail').off();//click事件可能多次触发，必须off
    	$('#myList li').off();
    	$('#myList li .del-btn').off();

    	$('#myList li').on('mouseenter',function() {//移动到apDate上时触发动画
    			$(this).find('.del-btn').stop().animate({width:"100px"},200);
    	});
    	$('#myList li').on('mouseleave',function() {//移动到apDate上时触发动画
    			$(this).find('.del-btn').stop().animate({width:"0px"},200);
    	});
    	$('#myList .detail').on('click',function(e) {
    		// body...
    		e.stopPropagation();
    		console.log("uuid"+$(this).parent().data('uuid'));
    		var block = '<div class="notesMasker"></div><div class="notesWindow"></div>';
    		$('body').append(block);
    		var notesWindow =$('.notesWindow');
    		notesWindow.animate({height:"300px"});
    		$('.notesMasker').on('click',function() {
    			// body...
    			var self = this;
    			notesWindow.animate({height:"0px"},200,function() {
    				// body...
    				$(self).remove();
    				$(this).remove();
    			   
    			});
    		});
    		var tmp = $(this).parent().find('.notesContent').text();
    		
    		if( tmp !== 'nodata' && tmp !== '' ){
    			$('.notesWindow').text($(this).parent().find('.notesContent').text()); //找到notes放入显示框中
    		}
    	});
    	$('#myList li .del-btn').on('click',function() {
    		//将ID传到服务器
    		var re = $(this).parent().data('uuid');
    		console.log('id:'+re);
    		var thisID = {
    			uniqueid:re
    		};
    		$.post('/delete',thisID,function(data) {
    			if(data.state === '1') {
    				console.log(thisID.uniqueid + ' deleted.');
    			}
    		});
    		$(this).parent().stop().animate({height:'0px'},200,function() {
    			$(this).stop().animate({marginTop:'0px'},200,function() {
    				var ullist = $(this).parent();
    				$(this).remove();				
    				console.log("list length:"+ullist);
    				if( ullist.children().length === 0 ){
    					ullist.remove();
    				}
    			});
    		});
    	});
    }
})