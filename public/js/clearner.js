
const cdir = {
	"0" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"1" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"2" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"3" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"4" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"5" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"6" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"7" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"8" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"9" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"10" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"11" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"12" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"13" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"14" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"15" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"16" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"17" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"18" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"19" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"20" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"21" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"22" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"23" : {
		"subnet" : "0.0.0.0",
		"ignore" : "255.255.255.255"
	},
	"24" : {
		"subnet" : "255.255.255.0",
		"ignore" : "0.0.0.255"
	},
	"25" : {
		"subnet" : "255.255.255.128",
		"ignore" : "0.0.0.127"
	},
	"26" : {
		"subnet" : "255.255.255.192",
		"ignore" : "0.0.0.63"
	},
	"27" : {
		"subnet" : "255.255.255.224",
		"ignore" : "0.0.0.31"
	},
	"28" : {
		"subnet" : "255.255.255.240",
		"ignore" : "0.0.0.15"
	},
	"29" : {
		"subnet" : "255.255.255.248",
		"ignore" : "0.0.0.7"
	},
	"30" : {
		"subnet" : "255.255.255.252",
		"ignore" : "0.0.0.3"
	},
	"31" : {
		"subnet" : "255.255.255.254",
		"ignore" : "0.0.0.1"
	},
	"32" : {
		"subnet" : "255.255.255.255",
		"ignore" : "0.0.0.0"
	},
};


$(function(){
	$(document).on("click","#startClean",function(e){
		e.preventDefault();
		let textRaw=$("#fromShIpRo").val();
		$("#result").html("");
		$("#result").html(
		"<pre>"+
		textRaw.replace(/C\s*/g,"").replace(/\sis directly connected,\s.*/g,"")+
		"</pre>");
		let BGPnetwork=[];
		let PRFlist=[];
		$.ajax({
			method : 'POST',
			url: '/p1/ip',
			data: "az="+$("#result").text().replaceAll("\n",' ').split(' ')
		})
		.done(function(data){
			// console.log(data);
			data.vars.forEach((ele,idx) =>{
				BGPnetwork.push(
				+ele.networkAddress+" mask "
				+ele.subnetMask+" "
				);
				PRFlist.push(
				ele.networkAddress
				+"/"+ele.subnetMaskLength
				);
			});
			$("#resultMask").html(
			"<pre>"+
			BGPnetwork.join("\n")+
			"\n-------------------\n"+
			PRFlist.join("\n")+
			"</pre>");
		});
	});
});