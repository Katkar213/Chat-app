const socket=io()
const clientTotal=document.getElementById("clients-total")
const messageContainer=document.getElementById("message-container")
const nameInput=document.getElementById("name-input")
const messageForm=document.getElementById("message-form")
const messageInput=document.getElementById("message-input")

messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    sendMessage()
})


socket.on('client-total',(data)=>{
console.log(data)
clientTotal.innerText=`Members Online: ${data}`

})

function sendMessage(){

if(messageInput.value==='')return

// console.log(messageInput.value);
const Userdata={
    name:nameInput.value,
    message:messageInput.value,
    dateTime:new Date()
}

socket.emit('message',Userdata)
addMessageToUI(false,Userdata)

}
socket.on('chat-message',(data)=>{
console.log(data)
addMessageToUI(true,data)
messageInput.value=''
})

function addMessageToUI(isOwnMessage,data){
    clearFeedback()
    const element=`
    <li class="${isOwnMessage?"message-right":"message-left"}">
    <p class="message">
        ${data.message}
        <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
    </p>
 </li>
 `
 messageContainer.innerHTML += element;
 scrollToBottom()
}
function scrollToBotom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`~ ${nameInput.value} is typing a massage`
    })
})

messageInput.addEventListener('keypress',(e)=>{
     socket.emit('feedback',{
        feedback:`${nameInput.value} is typing a massage`
    })
})
messageInput.addEventListener('blur',(e)=>{
     socket.emit('feedback',{
        feedback:'',
    })
})

socket.on('feedback',(data)=>{
    clearFeedback()
    const element=`
    <li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
 </li>`
 messageContainer.innerHTML+=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}