//permutation tables
const EventEmitter = require('events');

const IP=new Array(58, 50, 42, 34, 26, 18, 
	10, 2, 60, 52, 44, 36, 28, 20, 
	12, 4, 62, 54, 46, 38, 
	30, 22, 14, 6, 64, 56, 
	48, 40, 32, 24, 16, 8, 
	57, 49, 41, 33, 25, 17, 
	9, 1, 59, 51, 43, 35, 27, 
	19, 11, 3, 61, 53, 45, 
	37, 29, 21, 13, 5, 63, 55, 
	47, 39, 31, 23, 15, 7)

const IP1=new Array(40, 8, 48, 16, 56, 24, 64, 
	32, 39, 7, 47, 15, 55, 
	23, 63, 31, 38, 6, 46, 
	14, 54, 22, 62, 30, 37, 
	5, 45, 13, 53, 21, 61, 
	29, 36, 4, 44, 12, 52, 
	20, 60, 28, 35, 3, 43, 
	11, 51, 19, 59, 27, 34, 
	2, 42, 10, 50, 18, 58, 
	26, 33, 1, 41, 9, 49, 
	17, 57, 25)

const PC1=new Array(57, 49, 41, 33, 25, 
	17, 9, 1, 58, 50, 42, 34, 26, 
	18, 10, 2, 59, 51, 43, 35, 27, 
	19, 11, 3, 60, 52, 44, 36, 63, 
	55, 47, 39, 31, 23, 15, 7, 62, 
	54, 46, 38, 30, 22, 14, 6, 61, 
	53, 45, 37, 29, 21, 13, 5, 28, 
	20, 12, 4)

const PC2=new Array(14, 17, 11, 24, 1, 5, 3, 
	28, 15, 6, 21, 10, 23, 19, 12, 
	4, 26, 8, 16, 7, 27, 20, 13, 2, 
	41, 52, 31, 37, 47, 55, 30, 40, 
	51, 45, 33, 48, 44, 49, 39, 56, 
	34, 53, 46, 42, 50, 36, 29, 32)

const EP=new Array(32, 1, 2, 3, 4, 5, 4, 
	5, 6, 7, 8, 9, 8, 9, 10, 
	11, 12, 13, 12, 13, 14, 15, 
	16, 17, 16, 17, 18, 19, 20, 
	21, 20, 21, 22, 23, 24, 25, 
	24, 25, 26, 27, 28, 29, 28, 
	29, 30, 31, 32, 1)

const P=new Array(16, 7, 20, 21, 29, 12, 28, 
	17, 1, 15, 23, 26, 5, 18, 
	31, 10, 2, 8, 24, 14, 32, 
	27, 3, 9, 19, 13, 30, 6, 
	22, 11, 4, 25)

const shift=new Array(0, 1, 1, 2, 2, 2, 2, 2, 2, 
	1, 2, 2, 2, 2, 2, 2, 1)

const sbox=[ 
	[ [ 14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7 ], 
	  [ 0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8 ], 
	  [ 4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0 ], 
	  [ 15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13 ] ], 

	[ [ 15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10 ], 
	  [ 3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5 ], 
	  [ 0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15 ], 
	  [ 13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9 ] ], 
	[ [ 10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8 ], 
	  [ 13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1 ], 
	  [ 13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7 ], 
	  [ 1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12 ] ], 
	[ [ 7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15 ], 
	  [ 13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9 ], 
	  [ 10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4 ], 
	  [ 3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14 ] ], 
	[ [ 2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9 ], 
	  [ 14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6 ], 
	  [ 4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14 ], 
	  [ 11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3 ] ], 
	[ [ 12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11 ], 
	  [ 10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8 ], 
	  [ 9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6 ], 
	  [ 4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13 ] ], 
	[ [ 4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1 ], 
	  [ 13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6 ], 
	  [ 1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2 ], 
	  [ 6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12 ] ], 
	[ [ 13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7 ], 
	  [ 1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2 ], 
	  [ 7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8 ], 
	  [ 2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11 ] ] 
];

class DES extends EventEmitter{
	constructor(){
		super();
	}

encrypt(message,key){
//permutation function
function permutation(bit,array){
let newbit="";

for (let i=0;i<array.length;i++){
	newbit=newbit+bit.slice(array[i]-1,array[i])
}
return newbit
}

//hex to binary
function hex2bin(input){
function hexbin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
var result = ""
let a=""
for(var i=0;i<input.length;i+=2){
	a=a+input.slice(i,i+2)+" ";
}
a=a.slice(0,-1)
a.split(" ").forEach(str => {
  result += hexbin(str)
})
return result;
}

function leftshift(input,n){
for(let i=0;i<n;i++){
	input=input.slice(1)+input.slice(0,1);
}
return input
}

function xor(input1,input2){
	let result=""
	for(let i=0;i<48;i++){
		if (input1.slice(i,i+1)=="0"&&input2.slice(i,i+1)=="0") result+="0"
		if (input1.slice(i,i+1)=="1"&&input2.slice(i,i+1)=="0") result+="1"
		if (input1.slice(i,i+1)=="0"&&input2.slice(i,i+1)=="1") result+="1"
		if (input1.slice(i,i+1)=="1"&&input2.slice(i,i+1)=="1") result+="0"
	}
	return result
}

function f(input1,input2){
	let result=""
	let line
	let row
	let b=0
	input1=permutation(input1,EP)
	input1=xor(input1,input2)
for(let i=0;i<48;i+=6){
	line=input1.slice(i,i+1)+input1.slice(i+5,i+6)
	row=input1.slice(i+1,i+5)
	line=parseInt(line,2)
	row=parseInt(row,2)
	result+=sbox[b][line][row].toString(2).padStart(4,"0")
	b++;
}

result=permutation(result,P)
return result;
}
function parseBigInt(str, base=2) {
	base = BigInt(base)
	var bigint = BigInt(0)
	for (var i = 0; i < str.length; i++) {
	  var code = str[str.length-1-i].charCodeAt(0) - 48; if(code >= 10) code -= 39
	  bigint += base**BigInt(i) * BigInt(code)
	}
	return bigint
  }


message=hex2bin(message)
key=hex2bin(key);

//first permutation
key=permutation(key,PC1);

key=new Array(key.slice(0,28),key.slice(28))

let b=0
//leftshifts
for(let i=2;i<34;i+=2){
b++	
key[i]=leftshift(key[i-2],shift[b])
key[i+1]=leftshift(key[i-1],shift[b])
}

let subkey=new Array();
for(let i=1;i<17;i++){
	let b=i*2
	subkey[i-1]=key[b]+key[b+1]
}

//permutation PC2

for(let i=0;i<16;i++){
	
	subkey[i]=permutation(subkey[i],PC2)
}

//message permutation
message=permutation(message,IP)

//             L0                    R0
message=[message.slice(0,32),message.slice(32)]

//iterations
let L;
for (let i=0;i<16;i++){
	L=message[0];
	message[0]=message[1];
	message[1]=xor(L,f(message[1],subkey[i]))
}

message=message[1]+message[0];
message=permutation(message,IP1);
message=parseBigInt(message)
message=message.toString(16)
return message;
}
}
module.exports = DES;