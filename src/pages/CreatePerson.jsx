import React,{useState, useEffect} from 'react';
import Axios from 'axios'
import '../App.css'

function CreatePerson() {

const [firstName,setFirstName] = useState("");
const [lastName,setLastName] = useState("");
const [age,setAge] = useState("");

const submitPost = () => {
Axios.post('http://localhost:3002/api/create', {firstName: firstName,lastName:lastName, age:age})
}

    return (
        <div className="CreatePerson">
            <div className="uploadPost">
                <label>Username: </label>
                <input type="text" onChange={(e)=> {
                    setFirstName(e.target.value)
                }}/>
                <label>Title: </label>
                <input type="text" onChange={(e)=>{
                    setLastName(e.target.value)}}/>
       <label>Post Text</label>
       <textarea onChange={(e)=>{
           setAge(e.target.value)}}></textarea>
<button onClick={submitPost}>Submit Post</button>
         </div>
        </div>
    )}

export default CreatePerson