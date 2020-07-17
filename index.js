//required modules
const net = require('net');
const DES = require("./lib/DES"); //DES Algorithmus 
var nthash = require('smbhash').nthash;

//node red function
module.exports = function (RED) {
    'use strict';

    function SCPNode(n) {
		RED.nodes.createNode(this, n);
		
var node = this;
node.on('input', function (msg, send, done) {
//start
//global variables
let treeid;
let fid;
let read;
let readid;
let length;
let offset1 = 0;
let offset = 0;
var client;
let buffer;
let result = '';
let addlenght = '';
let files = Buffer.alloc(0);
let data;
let checklength;
let er;


		
//messages
const SMB_HEADER   = '00000000ff534d4272000000001853c8000000000000000000000000fffffffe00000000007800025043204e4554574f524b2050524f4752414d20312e3000024c414e4d414e312e30000257696e646f777320666f7220576f726b67726f75707320332e316100024c4d312e325830303200024c414e4d414e322e3100024e54204c4d20302e31320002534d4220322e3030320002534d4220322e3f3f3f00'
const SMB1_HEADER  = '00000000ff534d4273000000001807c8000000000000000000000000fffffffe0000b6940cff00000004110a00010000000000280000000000d40000a02d004e544c4d535350000100000007020000000000000000000000000000000000000a0063450000000f0000000000'
const SMB2_HEADER  = '00000000ff534d4273000000001807c8000000000000000000000000fffffffe0018c0cc0cff00000004110a00000000000000a10000000000d40000a0a5004e544c4d53535000030000000000000078000000180018007800000000000000580000000e000e005800000012001200660000001000100090000000010200000a0063450000000f12bbf90396efab285fda908238606b7d410055004400550053004500520048004e0054004c0036003500340036003600424a4063db04a9dad963f601707f8894b0b3f8d9a33c4f2636bdae8cc3d7f3dd2d78b7f7658595ae0000000000';
const SMB3_HEADER  = '00000000ff534d4232000000001807c8000000000000000000000000060810300308e0b10f3a0000000a000040000000000000000000003a00440000000000010001003d000000001600560507000201000000005c0075007300650072005c00300033005f0048003400530049005f0048004d00440041002e007300610076000000'
const SMB4_HEADER  = '00000000ff534d4275000000001807c80000000000000000000000000000fffe0218200404ff005400080001002900005c005c00310030002e0031002e00320038002e003100360036005c004600240000003f3f3f3f3f00'
let   SMB5_HEADER  = '00000000ff534d42a2000000001807c80000000000000000000000000108583a0218c00418ff00dede002c0016000000000000008900020000000000000000008000000003000000010000004400000002000000032f0000'
const SMB6_HEADER  = '00000000ff534d422e000000001807c80000000000000000000000000608fffe030890b30cff00dede0f4000000000e803e803000000000080000000000000'
const SMB7_HEADER  = '00000000ff534d4204000000001807c80000000000000000000000000108fffe0218f106030040ffffffff0000'
const SMB9_HEADER  = '00000000ff534d4271000000001807c80000000000000000000000000508fffe03083009000000'
const SMB10_HEADER = '00000000ff534d4274000000001807c80000000000000000000000000000fffe0308400902ff0000000000'
	
			
class SMB{

	//TCP connection
	constructor(port,host){
		node.status({ fill: 'yellow', shape: 'dot', text: 'connecting' });
		client = new net.Socket()
		client.on('data', data  =>{
			this.answer(data)
		})
		client.on('error', err  => {
			this.error(err);
		})
		client.on('end', () => {
			this.error('ended')
		})
		client.connect(port, host)
	}
	//download-function
	async download(path,pw){ 

		node.status({ fill: 'blue', shape: 'dot', text: 'downloading' });//status

		//negotiate
		buffer = Buffer.from(SMB_HEADER, 'hex')
		buf();
		result = await this.request(buffer)


		//auth. 1
		buffer = Buffer.from(SMB1_HEADER, 'hex')
		buf();
		result = await this.request(buffer);


		//auth. 2
		buffer = Buffer.from(SMB2_HEADER,'hex')
		buffer = parseauth(result,buffer,pw);
		buf();
		result = await this.request(buffer);


		//tree connect
		buffer = Buffer.from(SMB4_HEADER,'hex')
		user();
		buf();
		result = await this.request(buffer);


		//get File info
		buffer = Buffer.from(SMB3_HEADER,'hex')
		buffer = parsefileinfo(path);
		user();
		tree();
		buf();
		result = await this.request(buffer);
		if (result === '340000c0') this.logoff();


		//open file
		parselenght();
		parsepath(path);
		user();
		tree();
		buf();
		result = await this.request(buffer);


		//read file
		fid = result.readUInt16BE(42);
		buffer = Buffer.from(SMB6_HEADER,'hex')
		for(var i = 0; i <= readid+1 ; i++){
			getFiles(i);
			user();
			tree();
			buf();
			fidid();
			result = await this.request(buffer);
			parse(result);
		}


		//close fid
		buffer = Buffer.from(SMB7_HEADER,'hex');
		user();
		tree();
		buf();
		buffer.writeUInt16BE(fid, 37);
		result = await this.request(buffer);


		//close tree
		buffer = Buffer.from(SMB9_HEADER,'hex');
		user();
		tree();
		buf();
		result = await this.request(buffer);


		//logoff
		buffer = Buffer.from(SMB10_HEADER,'hex');
		user();
		buf();
		result = await this.request(buffer);
		this.logoff();
		return files;	
}
//functions
request(message){
		const promise = new Promise((resolve, reject) => this.responsePromise = {resolve, reject});
		client.write(message);
		return promise;
	}
answer(data){
	er = data.slice(9,13)
	er = er.toString('hex')
	if(er === '160000c0' || er === '00000000' || er === '0f0000c0'){ //not actual errors
	this.responsePromise.resolve(data);
	}else if(er === '340000c0'){ //file not found
		msg.payload = '';
		node.send(msg);
		this.responsePromise.reject(er);
		this.logoff();
	}
	else{
		if (er === '6d0000c0') er = 'Login failure, bad user or pw'; //authentification failed
		this.responsePromise.reject(er);
		this.logoff();
	}
}
logoff(){
	client.destroy();
}
error(err){
	this.responsePromise.reject(err);
	this.logoff();
}
}
	
	
//functions

//calculates NTLM response (currently with given password) 
function code(challenge,pass1,pass2,pass3){

	//DES Algorithm
	function encrypt(key,challenge){
		let des = new DES();
		let encrypted = des.encrypt(challenge,key)
		
		return encrypted;
		}

	let key = pass1 
	let hash1 = encrypt(key,challenge).padStart(16,"0")
	key = pass2
	let hash2 = encrypt(key,challenge).padStart(16,"0")
	key = pass3
	let hash3 = encrypt(key,challenge).padStart(16,"0")
	let answer = hash1+hash2+hash3;
	//console.log(hash1,hash2,hash3,answer)
	return answer
	}
//authentification	
function parseauth(result,buffer,pw){
	pw = nthash(pw);		//NTLM-Hash
	var pass1 = pw.slice(0,14)	//divide passwords in length of 7 Bytes
	var pass2 = pw.slice(14,28)
	var pass3 = pw.slice(28,32)+'0000000000'
	pass1 = crypt(pass1)			//parity adjustment
	pass1 = bin2hex(pass1)		//binary to hexadecimal
	pass2 = crypt(pass2)
	pass2 = bin2hex(pass2)
	pass3 = crypt(pass3)
	pass3 = bin2hex(pass3)

	read = result.readUInt16BE(32); //read userid

	let challenge = result.slice(71,79); //read Serverchallenge
	challenge = challenge.toString('hex');
	let payload = challenge //...make challenge readable
//	console.log(pass1,pass2,pass3,payload);
	const ntlmresponse = code(payload,pass1,pass2,pass3); //calculate NTLM response
	buffer.writeUInt32BE(buffer.length - 4, 0); //add length
	buffer.writeUInt16BE(read, 32); //add userid
	buffer.write(ntlmresponse,183,24,'hex'); //add NTLM response
	return buffer;
}
//hex to binary 
function hex2bin(hex){
	return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
//parity adjustment
function crypt(input){
	var i;
	for(i = 2;i<20;i = i+3){
	input = insert(input,' ',i);
	}
	var result = ""
	input.split(" ").forEach(str => {      //important for hex2bin!
	  result += hex2bin(str)
	})
	
	for(i = 7; i < 64; i = i+8){
	result = insert(result,'0',i);
	}
	return result
   }
function bin2hex(binaryString)
	   {
		   var output = '';
   
		   // For every 4 bits in the binary string
		   for (var i = 0; i < binaryString.length; i += 4)
		   {
			   // Grab a chunk of 4 bits
			   var bytes = binaryString.substr(i, 4);
   
			   // Convert to decimal then hexadecimal
			   var decimal = parseInt(bytes, 2);
			   var hex = decimal.toString(16);
   
			   // Uppercase all the letters and append to output
			   output +=  hex.toUpperCase();
		   }
   
		   return output;      
	   }
//length of message for TCP
function buf(){
	buffer.writeUInt32BE(buffer.length - 4, 0);
}
//TreeID (networkshare)
function tree(){
	buffer.writeUInt16BE(treeid, 28);
}
//UserID (auth.)
function user(){
	buffer.writeUInt16BE(read, 32);
}
//FID (path to file)
function fidid(){
	buffer.writeUInt16BE(fid, 41);
}

//insertfunction for strings
function insert(main_string, ins_string, pos) {
	if(typeof(pos) == "undefined") {
		pos = 0;
	}
	if(typeof(ins_string) == "undefined") {
		ins_string = '';
	}
	return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
		}

//parses path, converts to hex, returns info about pathlength in decimal and hex
function pathing(path2,findfirstbit){

	var path = ' '+path2;		//for compatibility
	path = path.replace(/\\/g, '/').split('/').filter(p  => p).join('\\'); //fw slash to back slash
	path = path.slice(1);		
	//do some stuff with string...mostly conversions
	let data = path;
	length = data.length;
	let hexlength
	if (findfirstbit === 1){
	hexlength = length*2+2+15;
	}else{
		hexlength = length*2+3;
	}
	var hexlength2 = hexlength-3;		
	hexlength = hexlength.toString(16)
	hexlength2 = hexlength2.toString(16)
	data = Buffer.from(data,'ascii');
	data = data.toString('hex');
	for (var i = 0;i<length;i++){
		var multi = i*4;
		data = insert(data,'00',multi+2);
	}
	data = data+'0000';
	data = Buffer.from(data,'hex');
	length = length*2+2 
	return {
		data:data,
		hexlength:hexlength,
		hexlength2:hexlength2,
		length:length
	}

}
//adds path and its length to message
function parsefileinfo(path){

	treeid = result.readUInt16BE(28);//read TreeID
	var values = pathing(path,1); 
	var pathhex = values.data;
	var hexlength = values.hexlength;
	var hexlength2 = values.hexlength2;
	var length = values.length;
	pathhex = pathhex.toString('hex');
	var addlong = length-46;
	//
	for (var i = 0;i<addlong;i++){
		addlenght = addlenght+'00';
	}
	buffer = buffer.toString('hex')
	buffer = buffer+addlenght;
	buffer = Buffer.from(buffer,'hex')
	buffer.write(hexlength, 67,2,'hex');
	buffer.write(hexlength2, 55,2,'hex');
	buffer.write(hexlength2, 37,2,'hex');
	buffer.write(pathhex, 84,length,'hex');
	return buffer;
}
//length of file
function parselenght(){
	//prep for reading
	length = result.slice(112,116);
	length = length.toString('hex');
	length = length.slice(6,8)+length.slice(4,6)+length.slice(2,4)+length.slice(0,2);
	length = parseInt(length,16);
	checklength = length;
	readid = parseInt((length/1000)-1,10);
}
//path for different message
function parsepath(path){
	var values = pathing(path,0);
	var path = values.data;
	var hexlength = values.hexlength;
	var hexlength2 = values.hexlength2;
	path = path.toString('hex');
	SMB5_HEADER = SMB5_HEADER+path
	buffer = Buffer.from(SMB5_HEADER,'hex')
	buffer.write(hexlength, 85,2,'hex');
	buffer.write(hexlength2, 42,2,'hex');
}
//adjust offset for fileparts
function getFiles(i){
	offset = i*1000;
	

	if (offset>268435000){
		offset = offset.toString(16);
		offset1 = offset.slice(6,8)+offset.slice(4,6)+offset.slice(2,4)+offset.slice(0,2);
		buffer.write(offset1, 43,8,'hex');
	}else if (offset>16777000){
		offset = offset.toString(16);
		offset = '0'+offset
		offset1 = offset.slice(6,8)+offset.slice(4,6)+offset.slice(2,4)+offset.slice(0,2);
		buffer.write(offset1, 43,8,'hex');
	}else if (offset>1048000){
		offset = offset.toString(16);
		offset1 = offset.slice(4,6)+offset.slice(2,4)+offset.slice(0,2);
		buffer.write(offset1, 43,6,'hex');
	}else if (offset>65000){
		offset = offset.toString(16);
		offset = '0'+offset
		offset1 = offset.slice(4,6)+offset.slice(2,4)+offset.slice(0,2);
		buffer.write(offset1, 43,6,'hex');
		
	}else if (offset>4000){
		offset = offset.toString(16);
	offset1 = offset.slice(2,4)+offset.slice(0,2);
	buffer.write(offset1, 43,4,'hex');
	}else{
		offset = offset.toString(16);
		offset = '0'+offset;
		offset1 = offset.slice(2,4)+offset.slice(0,2);
		buffer.write(offset1, 43,4,'hex');
	}
}
//put fileparts back together
function parse(input){
	data = input.toString('hex');
	data = input.slice(64);
	data = Buffer.from(data,'hex');
	files = Buffer.concat([files,data])
}


//main
msg.path = msg.remote;
var lengthpath = msg.path.slice(-1);
if (lengthpath === '/'){
	msg.payload = '';
	node.send(msg);
}else{
smb(msg.path,msg.password);
}

//main function
async function smb(weg,pw){
	const connection = new SMB('445',msg.host);
	try{
		result = await connection.download(weg,pw); //download function
		
		let resolve = result.length-checklength;
		if (resolve !== 0) throw ('data incomplete'+msg.path)
		msg.payload = result;
		node.send(msg);
		node.status({ fill: 'green', shape: 'dot', text: 'done' });
	}catch(err){
		node.error(err,msg)
		node.status({ fill: 'red', shape: 'dot', text: 'error' });
	}

}
});
}
RED.nodes.registerType('smb-download', SCPNode);
}