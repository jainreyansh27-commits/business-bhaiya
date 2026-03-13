"use client"

import { useState } from "react"

export default function VoiceAssistant(){

const [listening,setListening] = useState(false)

function startListening(){

const SpeechRecognition =
(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

const recognition = new SpeechRecognition()

recognition.lang = "en-IN"

recognition.onstart = () => {
setListening(true)
}

recognition.onend = () => {
setListening(false)
}

recognition.onresult = (event:any) => {

const transcript = event.results[0][0].transcript

handleCommand(transcript)

}

recognition.start()

}

async function handleCommand(command:string){

const res = await fetch("/api/ai/voice-command",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({command})
})

const data = await res.json()

alert(data.result)

}

return(

<div className="fixed bottom-8 right-8 z-50">

<div
onClick={startListening}
className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 
${listening ? "bg-purple-500 ai-orb scale-110" : "bg-purple-600 hover:scale-105"}
`}
>

🎤

</div>

{listening && (

<div className="text-xs text-gray-400 mt-2 text-center">
Listening...
</div>

)}

</div>

)

}