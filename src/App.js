import {useState} from "react";
import {ethers} from "ethers";
import './App.css';


//importing ABI to interact with dmart contract
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
// import { type } from "@testing-library/user-event/dist/type";
const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
//request access to the users metamask account 

function App() {

const [message,setMessage] = useState("");

  async function requestAccount(){
    await window.ethereum.request({method:"eth_requestAccounts"});
  }
  async function fetchGreeting(){
    if(typeof window.ethereum !== undefined){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress,Greeter.abi,provider);
       const greetingText = document.getElementById("greetingText");
      try{
        //call greet() :)
            const data = await contract.greet();
            console.log("data:",data);
            greetingText.innerHTML =  data;
          }
            catch(error){
                          console.log("ERrorr",error);
                        }
    }
  }
  
  async function setGreeting(){
    if(!message) return;
    //If Metamask exists
    if(typeof window.ethereum !== "undefined"){
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer =provider.getSigner();
      //creating contract with signer
      const contract = new ethers.Contract(greeterAddress,Greeter.abi,signer);
      const transaction = await contract.setGreeting(message);
      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
    
  }
  




  return (
    <div className="App">
     <div className="App-header">
       <div className="description">
         <h1>Greeter.sol</h1>
         <h3>Full stack dapp using ReactJS and Hardhat</h3>
         </div>
       <button 
       onClick={fetchGreeting}
       style={{ backgroundColor:"green",width:"100px" }} >Fetch Greeting</button>
       <button
        onClick={setGreeting}
         style={{ backgroundColor:"lightBlue",width:"100px",height:"36px",marginTop:'10px' }}>Set Greeting</button>
       <input
       onChange = {(e)=> setMessage(e.target.value)}
       value ={message}
       type="text" />
       <div id="greetingText"></div>
       
       </div>
    </div>
  );
}

export default App;
