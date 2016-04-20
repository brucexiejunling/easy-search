$(function() {
	var allData = [];
	var sheetData;
	var current = 1;
	var url = "http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&rsv_pq=d47c724e00056480&rsv_t=49bcozKs%2FmFi3dos5Az5qUUEbZKBDdleemItl4yol8HvG7bepEzSX%2BEEbeM&rsv_enter=1&rsv_sug3=5&rsv_sug1=3&rsv_sug7=100&rsv_sug2=0&inputT=10351&rsv_sug4=10409";
	var sheet, col;
	var hasUpload = false;
	sheet = $('.sheet').val();
	col = $('.col').val();

	$('.J_upload').click(function() {
		if(!$('#file').val()) {
			alert('请选择xlsx文件!');
			return;
		}
		upload();
	});

	$('.prev').click(function() {
		if(current > 1 ) {
			current--;
			process();
		}
	});

	$('.next').click(function() {
		if(current < sheetData.length - 1) {
			current++;
			process();
		}
	})

	$('.go').click(function() {
		var go = parseInt($('.J_input').val());
		if(go && sheetData[go]) {
			if(sheetData[go].length <= 0) {
				alert('一共都没有' + go + '条数据哦！');
				return;
			}
			current = go;
			process();
		}
	});

	$('.generate').click(function() {
		if(!hasUpload) {
			alert('请先上传xlsx文件！');
			return;
		}
		sheet = $('.sheet').val();
		col = $('.col').val();
		current = 1;
		process();
		$('.hidden').removeClass('hidden');
	});

	$('.delete').click(function(e) {
		e.preventDefault();
		$('#file').show();
		$('.file-name').html('');
		$('.J_upload').html('上传xlsx');
		$('.delete').addClass('hidden');
		hasUpload = false;
	});

	function upload() {
		$.ajaxFileUpload({
	        url: 'upload', 
	        type: 'post',
	        secureuri: false, //一般设置为false
	        fileElementId: 'file', // 上传文件的id、name属性名
	        dataType: 'json', //返回值类型，一般设置为json、application/json
	        success: function(res, status){
	        	if(res.success) {
		        	hasUpload = true;
		        	$('#file').hide();
		        	$('.file-name').html(res.file);
		        	$('.J_upload').html('已上传');
		        	$('.delete').removeClass('hidden');
		        	allData = res.data;
	        	} else {
	        		alert('上传文件失败！');
	        	}
	        },
	        error: function(data, status, e){ 
	        	alert('上传文件失败！');
	        }
		});
	}


	function process() {
	    sheetData = allData[sheet - 1].data;

		var cols = sheetData[0];
		if(sheetData[current].length <= 0) {
			current--;
			alert('到底啦！恭喜你完成今天的任务了哟^_^')
			return;
		}
		$('.current-item').html('');
		for(var i=0; i<cols.length; i++) {
			$('.current-item').append('<span><strong>' + cols[i] + '</strong>' + sheetData[current][i] + '</span>');
		}

		var link = url + "&wd=" + sheetData[current][col - 1];
		$('.J_link').attr('href', link).html(link);
		$('iframe').attr('src', link);
	}
});