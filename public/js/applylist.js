$(function() {
	var masker = '<div id="maskArea"></div>';
  
    $.ajax({
    	type:'get',
    	contentType: 'application/json; charset=utf-8',
    	dataType:'json',
    	url:'applylist.json',
    	success:function(applylist) {
    		var showApplyList ='<ul id="myList">';
    		for( var i = 0,len = applylist.applied.length; i < len; i++ ) {
    			showApplyList += '<li data-uuid="'+applylist.applied[i].uniqueid+'">'+'<div class="cpName">'+applylist.applied[i].companyName+'</div>'+'<div class="apDate">'+applylist.applied[i].applyDate+'</div>'+'<div class="del-btn">Delete</div>'+'</li>';
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
						+'<input id="companyName" type="text" name="companyName" placeholder="公司名"/>'
						+'<input id="applyDate" type="text" name="applyDate" placeholder="申请日期"/>'
						+'<button type="button" class="confirm">提交</button>'
						+'<button type="button" class="cancelMe">取消</button>'
						+'</form>'
		$('#maskArea').before(inputZone);
		$('#maskArea').on('click',function(e) {
			e.stopPropagation();					
			$(this).remove();
			$('#applyInfo').remove();			
	    });
	    $('#applyInfo button.cancelMe').on('click',function(e) {
	    	e.preventDefault();
	    	$('#maskArea').remove();
	    	$('#applyInfo').remove();
	    });
	    $('#applyInfo button.confirm').on('click',function(e) {
	    	e.preventDefault();
	    	//JSON化数据，POST，存入JSON文件，更新DOM
	    	var formData = $('#applyInfo').serializeJson();
	    	var newItem = '';
	    	
	    	$.post('/save',formData,function(dataReturn) {
	    		if( dataReturn.state !== '0') {
	    				if( dataReturn.state === '1') {
	    					console.log("Inserted!");
	    					newItem = '<li data-uuid="'+dataReturn.uniqueid+'">'+'<div class="cpName">'+formData.companyName+'</div>'+'<div class="apDate">'+formData.applyDate+'</div>'+'<div class="del-btn">Delete</div>'+'</li>';
	    					$('ul#myList').append(newItem);
	    					bindListEvent();
	    					
	    					
	    				}else if ( dataReturn.state === '2') {
	    					newItem = '<ul id="myList"><li data-uuid="'+dataReturn.uniqueid+'">'+'<div class="cpName">'+formData.companyName+'</div>'+'<div class="apDate">'+formData.applyDate+'</div>'+'<div class="del-btn">Delete</div>'+'</li></ul>';
	    					$('#content .applylist').append(newItem);
	    				    bindListEvent();
	    					
	    					
	    				}
	    			$('#maskArea').remove();
	    		    $('#applyInfo').remove();
	    		}
	    		
	    	});
	    });
	});

    function bindListEvent() {
    	// body...
    	$('#myList li').on('mouseenter',function() {//移动到apDate上时触发动画
    			$(this).find('.del-btn').animate({width:"100px"},200);
    	});
    	$('#myList li').on('mouseleave',function() {//移动到apDate上时触发动画
    			$(this).find('.del-btn').animate({width:"0px"},200);
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
    		$(this).parent().animate({height:'0px'},200,function() {
    			$(this).animate({marginTop:'0px'},200,function() {
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