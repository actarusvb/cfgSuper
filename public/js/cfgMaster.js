$(function(){
	$(document).on("change","#masterFile",function(event){
		$("#blocks").remove();
		$("#go").remove();
		$("#pre").remove();
		$("#cfg").remove();
		$.ajax(
		{
			method : 'GET',
			url: '/p1/loadTemplate/'+$("#masterFile").val(),
		})
		.done(function(da){
			// console.log("a %o",da)
			$("#masterFile").after('<pre id="pre">'+da.captBuffer+'</pre>');
			$("#pre").after('<form id="block"></form>');
			$("#block").append('<table id="blocks"></table>');
			da.vars.forEach(function(ele,i){
				if(da.textAree[ele]){
					$("#blocks").append('<tr><td><label for="'+ele+'">'+ele+' '+'</label></td><td><textarea name="'+ele+'" id="'+ele+'" rows="25" cols="40" style="height: 164px; width: 377px;" ></textarea></td></tr>');
				}else{
					$("#blocks").append('<tr><td><label for="'+ele+'">'+ele+' '+'</label></td><td><input    name="'+ele+'" id="'+ele+'" ></td></tr>');
				}
			});
			$("#block").after('<button name="go" id="go">Go</button>');
		});
	});
	$(document).on("click",".preconfig",function(e){
		e.preventDefault();
		$.ajax(
		{
			method : 'GET',
			url: '/p1/loadTemplateData/'+$(this).text(),
		})
		.done(function(da){
			console.log("a %o",da)
			Object.keys(da.vars).forEach(function(ele){
				$("#"+ele).val(da.vars[ele]);
			});
		});
	});
	$(document).on("click","#go",function(e){
		e.preventDefault();
		$("#cfg").remove();

		$.ajax(
		{
			method : 'POST',
			url: '/p1/createCfg/'+$("#masterFile").val(),
			data: $("#block").serializeArray()
		})
		.done(function(data){
			// console.log(data);
			$("#masterFile").after('<div id="cfg"><pre>'+data.htmlData+'</pre><div>');
		});
	});
	$(document).on("click","#Btn_generatedpsk32",function(e){
		e.preventDefault();
		navigator.clipboard.writeText($("#generatedpsk32").text());
		$("#IV2kr_preshared_key").val($("#generatedpsk32").text());
		console.log("copied in clipboard "+$("#generatedpsk32").text());
	})
	$(document).on("click","#regen-btn",function(e){
		e.preventDefault();
		generateAndFillPsk();
	})
});
function generateAndFillPsk() {
	var a = new Uint8Array(24);
	window.crypto.getRandomValues(a);
	var b = new Uint8Array(33);
	window.crypto.getRandomValues(b);
	var c = new Uint8Array(15);
	window.crypto.getRandomValues(c);
   
	document.getElementById('generatedpsk32').innerText=btoa(String.fromCharCode.apply(null, b));
}
function copyIn(element){
	navigator.clipboard.writeText(document.getElementById(element).textContent);
	console.log("copied in clipboard "+document.getElementById(element).textContent);
}
document.addEventListener("DOMContentLoaded", function(event) {
	generateAndFillPsk();
});
function generatePassword(length,charset) {
	length = length | 8;
	charset = charset || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

