if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
	console.log("web3 already initiate");
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	console.log("web3 create");
}
web3.eth.defaultAccount = web3.eth.accounts[0];
var abi = [ { "constant": false, "inputs": [ { "name": "cid", "type": "string" }, { "name": "b", "type": "string" } ], "name": "addBrokerRequest", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "cid", "type": "string" } ], "name": "getBrokerRequest", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "cid", "type": "string" }, { "name": "nme", "type": "string" }, { "name": "lUpdateDate", "type": "uint256" }, { "name": "a", "type": "string" }, { "name": "b", "type": "string" } ], "name": "add", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "cid", "type": "string" }, { "name": "nme", "type": "string" }, { "name": "lUpdateDate", "type": "uint256" }, { "name": "a", "type": "string" }, { "name": "b", "type": "string" } ], "name": "update", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "cid", "type": "string" }, { "name": "brk", "type": "string" }, { "name": "brkRequest", "type": "string" } ], "name": "updateBrokers", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "cid", "type": "string" } ], "name": "findByCID", "outputs": [ { "name": "returnCID", "type": "string" }, { "name": "returnName", "type": "string" }, { "name": "lastUpdateDate", "type": "uint256" }, { "name": "returnAnswers", "type": "string" }, { "name": "returnBrokers", "type": "string" } ], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "s", "type": "string" } ], "name": "print_log", "type": "event" } ];
var address = '0x7a3881aba4416c31689aF1980819F465ccb29578';

// creation of contract object
var KYC = web3.eth.contract(abi);
// initiate contract for an address
var kycInstance = KYC.at(address); 

/*var filter = web3.eth.filter('latest');

	filter.watch(function(error, result){
	  if (error) return;
	  
	  var block = web3.eth.getBlock(result, true);
	  console.log('block #' + block.number);
	  console.log("transaction : "+block.transactions);
	  
	  if(block != null){
		filter.stopWatching();
	  }

 
	});*/

var choices = ['มากที่สุด','มาก','ปานกลาง','น้อย','น้อยที่สุด'];
var brokerList = ['Broker A','Broker B','Broker C','Broker D','Broker E'];
var timestamp =  new Date().getTime();
console.log("timestamp : "+timestamp);
addKYCForm("ningadd5","ning", timestamp,"1|5","2");

function addKYCForm(cid, name, lastupdate, arr1, arr2){
	var transactionId = kycInstance.add(cid, name, lastupdate, arr1, arr2, {gas:700000});
	console.log("transactionId = "+transactionId);
	filter();
	/*kycInstance.add.call(cid, name, lastupdate, arr1, arr2, {gas:700000},function(error,value){
		if(!error){
			console.log("addKYCForm() | value : "+value);
		}else{
			console.log("addKYCForm() | error");
		}
	});*/
}

function filter(){
	var filter = web3.eth.filter('latest');

	filter.watch(function(error, result){
	  if (error) return;
	  
	  var block = web3.eth.getBlock(result, true);
	  console.log('block #' + block.number);
	  console.log("transaction : "+block.transactions);
	  
	  if(block != null){
		console.log("block success : "+block.number)
		filter.stopWatching();
	  }

 
	});
	
}


function getKYCForm(){
	$("#kycform").hide();
	var form;
	var citizenId = $("#citizenId").val();
	var status;
	var result;
	if(citizenId != ''){
		result = kycInstance.findByCID.call(citizenId, function(error, value){
			if(!error){
				console.log("getKYCForm() | value : "+value);
				var arrResult = value.toString().split(",");
				var cid = arrResult[0];
				console.log("getKYCForm() | cid = "+cid);
				if(cid == -1){
					status = false;
					alert("Cannot get data");
				}else{
					status = true;;
					renderKYCForm(arrResult);
				}
			}else{
				status = false;
				console.log("getKYCForm() | error");
			}
		});
	}else{
		alert("Please fill in your citizen ID");
		status = false;
	}
	
	return status;
}

function renderKYCForm(arrResult){
	var cid = arrResult[0];
	var name = arrResult[1];
	var lastupdate = arrResult[2];
	var answers = arrResult[3];
	var selectVal1 = ["","","","","",""];
	var selectVal2 = ["","","","","",""];
	if(answers != ''){
		answers = answers.toString().split("|");
		var a1 = answers[0];
		selectVal1[a1]="selected";
		var a2 = answers[1];
		selectVal2[a2]="selected";
		console.log("a1 = "+a1+" | a2 = "+a2);
	}
	var brokers = arrResult[4];
	var brokersHtml = "";
	if(brokers != ''){
		var brokerAns = brokers.toString().split("|");
		console.log("brokers = "+brokers);
		for(var i =0; i< brokerAns.length ; i++){
			brokersHtml = brokersHtml + '<li>'+brokerAns[i]+'</li>';			
		}
	}
	
	var answerHtml = '<div class="form-group">'+
                        '<div class="col-xs-12">'+
                            '<label>คุณสามารถรับความเสี่ยงได้มากน้อยเพียงใด</label>'+
                         '</div>'+
                         '<div class="col-xs-12">'+
                            '<select class="form-control" name="a1" disabled="disabled">'+
                                 '<option value="5" '+selectVal1[5]+'>มากที่สุด</option>'+
                                 '<option value="4" '+selectVal1[4]+'>มาก</option>'+
                                 '<option value="3" '+selectVal1[3]+'>ปานกลาง</option>'+
                                 '<option value="2" '+selectVal1[2]+'>น้อย</option>'+
                                 '<option value="1" '+selectVal1[1]+'>น้อยที่สุด</option>'+
                            '</select>'+
                          '</div>'+
                          '</div>'+
                           '<div class="form-group">'+
                               ' <div class="col-xs-12">'+
                                    '<label>Question 2</label>'+
                                '</div>'+
                             '<div class="col-xs-12">'+
                                '<select class="form-control" name="a2" disabled="disabled">'+
                                            '<option value="5" '+selectVal2[5]+'>มากที่สุด</option>'+
                                            '<option value="4" '+selectVal2[4]+'>มาก</option>'+
                                            '<option value="3" '+selectVal2[3]+'>ปานกลาง</option>'+
                                            '<option value="2" '+selectVal2[2]+'>น้อย</option>'+
                                            '<option value="1" '+selectVal2[1]+'>น้อยที่สุด</option>'+
                                 '</select>'+
                            '</div>'
                          '</div>';
	
	var html = '<div class="block-title">'+
                    ' <h2><strong>'+name+'</strong> </h2>'+
                    '</div>'+
                    ' <table class="table table-borderless table-striped">'+
                     '<tbody>'+
                         '<tr>'+
                         '<td style="width: 20%;"><strong>Citizen Id</strong></td>'+
                         '<td>'+cid+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td><strong>Last Update</strong></td>'+
                        '<td>'+lastupdate+'</td>'+
                     '</tr>'+
                    '<tr>'+
                        '<td><strong>Answer</strong></td>'+
                        '<td>'+answerHtml+'</td>'+
                    '</tr>'+
                    '<tr>'+
                         '<td><strong>Brokers</strong></td>'+
                         '<td><ul>'+brokersHtml+'</ul></td>'+
                    '</tr>'+
                    '</tbody>'+
                '</table>';
	$("#kycform").html(html);
	$("#kycform").show();
}

