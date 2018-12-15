import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'

class App extends React.Component {
   	constructor(props){
      	super(props)
      	this.state = {
      		csvData2:[
      			{
      				name:'owner',
      				file1R:0,
      				file1A:1,
      				file2R:0,
      				file2A:1,
      				file3R:0,
      				file3A:1
      			}
      		],
      		csvData1:[
      			{
      				name:'owner',
      				address:'0x94d28A919EE9DDe79c0DB73D706b83cA550138A9'
      			}
      		],
        	minimumPriority: 0,
        	numberOfRequests: 0,
      	}
		if(typeof web3 != 'undefined'){
        	console.log("Using web3 detected from external source like Metamask")
         	this.web3 = new Web3(web3.currentProvider)
      	}else{
         	console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
         	this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      	}
		const MyContract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_user",
				"type": "address"
			},
			{
				"name": "_fileName",
				"type": "string"
			}
		],
		"name": "approve",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			}
		],
		"name": "register",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_fileName",
				"type": "string"
			}
		],
		"name": "request",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_user",
				"type": "address"
			},
			{
				"name": "_fileName",
				"type": "string"
			}
		],
		"name": "revoke",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_minimumPriority",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_user",
				"type": "address"
			}
		],
		"name": "checkUserExists",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minimumPriority",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numberOfRequests",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "userInfo",
		"outputs": [
			{
				"name": "totalPriority",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "userName",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "users",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]) //add ABI code
		this.state.ContractInstance = MyContract.at("0x5f6ea66cbe570b29a81a2dc86b5681c7dc2d26c0") //add contract hash
   	}

   componentDidMount() {
   		this.updateState()
   		this.setupListeners()
   		setInterval(this.updateState.bind(this), 10e3)
   }

   updateState(){
      	this.state.ContractInstance.minimumPriority((err, result) => {
         	if(result != null){
            	this.setState({
               		minimumPriority: parseFloat(web3.fromWei(result, 'ether'))
            	})
         	}
      	})

      	this.state.ContractInstance.numberOfRequests((err, result) => {
        	if(result != null){
            	this.setState({
               		numberOfRequests: parseInt(result)
            	})
         	}
      	})
   	}

   	setupListeners(){
      let liNodes = this.refs['numbers'].querySelectorAll('li')
      liNodes.forEach(number => {
         number.addEventListener('click', event => {
            event.target.className = 'number-selected'
            this.chooseFunction((event.target.innerHTML), done => {
// Remove the other number selected
               for(let i = 0; i < liNodes.length; i++){
                  liNodes[i].className = ''
                //window.location.reload()
               }
            })
         })
      })
   }

   chooseFunction(number, cb){
   		if(number == "Register"){
   			let username = this.refs['user-name-register'].value
   			this.state.ContractInstance.register(username, {
   				gas: 300000,
         	}, (err, result) => {
         		this.state.csvData1.push(
         			{
         				name:username,
         				address:web3.eth.accounts[0]
         			}
         		)
         		console.log("name logged")
         		console.log(this.state.csvData1)
            	cb()
         	})
   		} else if(number =="Request"){
   			let filename = this.refs['file-name-request'].value
   			let priority_val = this.refs['priority'].value
   			this.state.ContractInstance.request(filename, {
   				gas: 300000,
            	from: web3.eth.accounts[0],
            	value: web3.toWei(priority_val * this.state.minimumPriority, 'ether')
         	}, (err, result) => {
         		var re1 = this.state.csvData1
         		for(var item1=0; item1<re1.length; item1++){
         			if(re1[item1].address == web3.eth.accounts[0]){
         				for(var item2=0; item2<this.state.csvData2.length; item2++){
         					if(this.state.csvData2[item2].name == re1[item1].name){
         						if(filename=="file1"){
         							this.state.csvData2[item2].file1R = priority_val
         						} else if(filename=="file2"){
         							this.state.csvData2[item2].file2R = priority_val
         						} else if(filename=="file3"){
         							this.state.csvData2[item2].file3R = priority_val
         						}
         					} else {
         						if(filename=="file1"){
         							this.state.csvData2.push(
         							{
         								name:re1[item1].name,
         								file1R:priority_val,
         								file1A:0,
         								file2R:0,
         								file2A:0,
         								file3R:0,
         								file3A:0
         							})
         						} else if(filename=="file2"){
         							this.state.csvData2.push(
         							{
         								name:re1[item1].name,
         								file1R:0,
         								file1A:0,
         								file2R:priority_val,
         								file2A:0,
         								file3R:0,
         								file3A:0
         							})
         						} else if(filename=="file3"){
         							this.state.csvData2.push(
         							{
         								name:re1[item1].name,
         								file1R:0,
         								file1A:0,
         								file2R:0,
         								file2A:0,
         								file3R:priority_val,
         								file3A:0
         							})
         						}
         					}
         				}
         			}
         		}
         		console.log(this.state.csvData2)
         		this.exportCsv()
            	cb()
         	})
   		} else if(number == "Approve"){
   			let username = this.refs['user-name-approve'].value
   			let filename = this.refs['file-name-approve'].value
   			console.log(username)
   			console.log(filename)
   			var re1 = this.state.csvData1
   			var i = 0
   			for(var item1=0; item1<re1.length; item1++){
   				if(re1[item1].name == username)
   					i = item1
   			}
   			this.state.ContractInstance.approve(this.state.csvData1[i].address, filename, {
   				gas: 300000,
            	from: web3.eth.accounts[0],
         	}, (err, result) => {
   				for(var item2=0; item2<this.state.csvData2.length; item2++){
         			if(this.state.csvData2[item2].name == username){
         				if(filename=="file1"){
         					this.state.csvData2[item2].file1R = 0
         					this.state.csvData2[item2].file1A = 1
         				} else if(filename=="file2"){
         					this.state.csvData2[item2].file2R = 0
         					this.state.csvData2[item2].file2A = 1
         				} else if(filename=="file3"){
         					this.state.csvData2[item2].file3R = 0
         					this.state.csvData2[item2].file3A = 1
         				}
         			}
         		}
         		this.exportCsv()
            	cb()
         	})
   		} else if(number == "Revoke"){
   			let username = this.refs['user-name-revoke'].value
   			let filename = this.refs['file-name-revoke'].value
   			console.log(username)
   			console.log(filename)
   			var re1 = this.state.csvData1
   			var i = 0
   			for(var item1=0; item1<re1.length; item1++){
   				if(re1[item1].name == username)
   					i = item1
   			}
   			this.state.ContractInstance.revoke(this.state.csvData1[i].address, filename, {
   				gas: 300000,
            	from: web3.eth.accounts[0],
         	}, (err, result) => {
   				for(var item2=0; item2<this.state.csvData2.length; item2++){
         			if(this.state.csvData2[item2].name == username){
         				if(filename=="file1"){
         					this.state.csvData2[item2].file1A = 0
         				} else if(filename=="file2"){
         					this.state.csvData2[item2].file2A = 0
         				} else if(filename=="file3"){
         					this.state.csvData2[item2].file3A = 0
         				}
         			}
         		}
         		this.exportCsv()
            	cb()
         	})
   		}
   	}

   	exportCsv(){
   		var csvRow = []
   		var A = [['name','file1R','file1A','file2R','file2A','file3R','file3A']]
   		var re2 = this.state.csvData2
   		for(var item3=0; item3<re2.length;item3++){
   			A.push([re2[item3].name,re2[item3].file1R,re2[item3].file1A,re2[item3].file2R,re2[item3].file2A,re2[item3].file3R,re2[item3].file3A])
   		}

   		for(var i=0;i<A.length;i++){
   			csvRow.push(A[i].join(","))
   		}

   		var csvString = csvRow.join("%0A")
   		console.log(csvString)
   		var a=document.createElement("a")
   		a.href='data:attachment/csv,' + csvString
   		a.target="_Blank"
   		a.download="testfile.csv"
   		document.body.appendChild(a)
   		a.click()
   	}



   render(){
      return (<div className="main-container">
            <h1>TACOS - Tamper-proof Access Control and Oversight System</h1>
            <div className="container">
			<h2>Registration for accessor</h2>
			<div className="register">
				<div className="block">
            		<label>
               			<b>Enter your name <input className="name-input" ref="user-name-register" type="text"/></b>
            		</label>
            	</div>
            </div>
            <h2>Request by accessor</h2>
            <div className="request">
				<div className="block">
            		<label>
               			<b>Enter filename <input className="name-input" ref="file-name-request" type="text"/></b>
            		</label>
            		<label>
            			<b>Priority Level - Choose from 1 to 5 <input className="name-input" ref="priority" type="number" placeholder={this.state.minimumPriority/this.state.minimumPriority}/></b>
            		</label>
            	</div>
            </div>
            <h2>Approval by owner</h2>
            <div className="approve">
				<div className="block">
            		<label>
               			<b>Enter user name <input className="name-input" ref="user-name-approve" type="text"/></b>
            		</label>
            		<label>
               			<b>Enter file name <input className="name-input" ref="file-name-approve" type="text"/></b>
            		</label>
            	</div>
            </div>
            <h2>Revoke by owner</h2>
            <div className="Revoke">
				<div className="block">
            		<label>
               			<b>Enter user name <input className="name-input" ref="user-name-revoke" type="text"/></b>
            		</label>
            		<label>
               			<b>Enter file name <input className="name-input" ref="file-name-revoke" type="text"/></b>
            		</label>
            	</div>
            </div>
            </div>
            <div className="container">
            	<ul ref="numbers">
               			<li>Register</li>
               			<li>Request</li>
               			<li>Approve</li>
               			<li>Revoke</li>
               		</ul>
            </div>
		</div>
        
        )
    }
}
ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
