

const express= require('express');
const fs = require('fs');
const path = require('path');
const bodyParser= require('body-parser');
const ip= require("ip");
let ejs=require('ejs');

const testFolder = 'baseCfg';
const cfgFolder = 'cfgFolder';
console.log(testFolder);

var cfgSuper = express();
cfgSuper.set('view engine','ejs');
cfgSuper.use(express.static('public'));
cfgSuper.use(express.json());
cfgSuper.use(bodyParser.urlencoded({extended:false}));
cfgSuper.use(bodyParser.json());

cfgSuper.get('/',function(req,res){
	var files =[];
	var cfg=[];
	fs.readdirSync(path.join(__dirname,testFolder)).forEach(file => {
		files.push(file)
	});
	fs.readdirSync(path.join(__dirname,cfgFolder)).forEach(file => {
		cfg.push(file)
	});
	
	res.render('index',{fileslist: files, cfgs:cfg});
});
cfgSuper.get('/clearner',function(req,res){
	res.render('clearner');
});
cfgSuper.get("/p1/loadTemplate/:template",async (req,res) => {
	var result = new Object();
	console.log("-------------------------");
	console.log(req.params.template);
	var vars=[];
	var textAree={};
	var datablock = fs.readFileSync(path.join(__dirname,testFolder,req.params.template),'utf-8');
	var capture=false;
	var captBuffer="";
	datablock.split(/\r?\n/).forEach(line =>  {
		if( line === "!#stop"){
			capture=false;
		}
		if(capture){
			captBuffer=captBuffer.concat("\n",line);
		}
		// console.log(">%s< %s",line,capture);
		if( line === "!#start"){
			capture=true;
		}
		const match = [...line.matchAll(/(<%[=|-])\s([A-Za-z0-9_\-\/.]+) (%>)/g)];
		match.forEach(function(resx){
			if(resx[2] !== "iGnOrE"){
				vars.push(resx[2]);
				if(line.includes("TXTAREA")){
					textAree[resx[2]]=true;
				}else{
					textAree[resx[2]]=false;
				}
				console.log("var %s textAree %s",resx[2],textAree[resx[2]]);
			}
		});
	});
	result.retcode=1;
	result.retmsg="ok";
	result.vars=[...new Set(vars)];
	result.textAree=textAree;
	result.captBuffer=captBuffer;
	res.json(result);
});
cfgSuper.get("/p1/loadTemplateData/:cfgFile",async (req,res) => {
	let result = new Object();
	console.log(req.params.cfgFile);
	let vars=[];
	let rawdata = fs.readFileSync(path.join(__dirname,cfgFolder,req.params.cfgFile),'utf-8');
	let datablock = JSON.parse(rawdata);

	result.retcode=1;
	result.retmsg="ok";
	result.vars=datablock;
	res.json(result);
});
cfgSuper.get("/p1/ip/:ip/:prflen",async (req,res) => {
	console.log(req.params.ip,req.params.prflen);
	let result = new Object();
	var constr=ip.subnet(req.params.ip,ip.fromPrefixLen(req.params.prflen));
	constr['not']=ip.not(constr.subnetMask);
	console.log(constr);
	result.retcode=1;
	result.retmsg="ok";
	result.vars=constr;
	res.json(result);
});	
cfgSuper.post("/p1/ip",async (req,res) => {
	console.log("A %o xxxx %o",req.body,req.body.az);
	let result = new Object();
	let az=req.body.az.split(",");
	let grup=[];
	az.forEach((ele,idx) => {
		const add=ele.split("/");
		console.log(add);
		if(ip.isV4Format(add[0])){
			var constr=ip.subnet(add[0],ip.fromPrefixLen(add[1]));
			constr['not']=ip.not(constr.subnetMask);
			grup.push(constr);
		}
	});
	console.log(grup);
	result.retcode=1;
	result.retmsg="ok";
	result.vars=grup;
	res.json(result);
});	
cfgSuper.post("/p1/createCfg/:template",async (req,res) => {
	var result = new Object();
	console.log(req.params.template);
	console.log("A %o",req.body);
	console.log("B %o",req.params);
	console.log("C %o",req.query);
	result.vars=new Object();

	for(const [key,val] of Object.entries(req.body )){
		result.vars[key]=val;
		console.log("A>%s %s",key,val);
		console.log("B>%s %s",key,result.vars[key]);
	}
	result.vars.template=req.params.template;
	
	fs.writeFile(path.join(__dirname,cfgFolder,result.vars.template.replace('.ejs','')+'-'+result.vars.hostname+'.json'),JSON.stringify(result.vars), function(err) {
		if (err) {
			console.log(err);
		}
		console.log("Writed",path.join(__dirname,cfgFolder,result.vars.template.replace('.ejs','')+'-'+result.vars.hostname+'.json'));
	});
      
	result.retcode=1;
	result.retmsg="ok";

	var datablock = fs.readFileSync(path.join(__dirname,testFolder,req.params.template),'utf-8');

	var datablock2=datablock.replace(/-/g, 'O_O');
	str=ejs.render(
		datablock
		,result.vars
		,{delimiter: '%'}
		);		
	// console.log(str);
	result.htmlData=str;
	res.json(result);
});
cfgSuper.listen(3000,() => {
	console.log('listening ob port 3000');
});

