"use client"

import { useState } from "react"

export default function BusinessCardScanner() {

const [file,setFile] = useState<File | null>(null)
const [preview,setPreview] = useState<string | null>(null)
const [cards,setCards] = useState<any[]>([])
const [loading,setLoading] = useState(false)
const [sales, setSales] = useState<any>(null)
const [tasks, setTasks] = useState<any>(null)
const handleFile = (e:any)=>{
const selected = e.target.files[0]

if(!selected) return

setFile(selected)
setPreview(URL.createObjectURL(selected))
}

const handleDrop = (e:any)=>{
e.preventDefault()

const dropped = e.dataTransfer.files[0]

if(!dropped) return

setFile(dropped)
setPreview(URL.createObjectURL(dropped))
}

const scanCards = async ()=>{

if(!file){
alert("Upload an image first")
return
}

setLoading(true)

const formData = new FormData()
formData.append("image",file)

const res = await fetch("/api/ai/business-card",{
method:"POST",
body:formData
})

const data = await res.json()

setCards(data.cards || [])

setLoading(false)

}

const exportExcel = ()=>{

if(cards.length===0) return

let csv = "Name,Company,Phone,Email\n"

cards.forEach(c=>{
csv += `${c.name},${c.company},${c.phone},${c.email}\n`
})

const blob = new Blob([csv],{type:"text/csv"})
const url = URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = "business_cards.csv"
a.click()

}

const addToSalesCalling = async ()=>{

if(cards.length===0){
alert("No contacts detected")
return
}

await fetch("/api/leads/add-bulk",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({cards})
})

alert("Contacts added to Sales Calling")

}

return(

<div className="max-w-4xl mx-auto p-10">

<h1 className="text-2xl font-semibold mb-8">
Business Card Scanner
</h1>

<div
onDrop={handleDrop}
onDragOver={(e)=>e.preventDefault()}
className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center bg-slate-800"
>

<p className="text-lg mb-4">
📇 Drop business card image here
</p>

<p className="text-sm text-slate-400 mb-6">
or upload from your computer
</p>

<label className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg cursor-pointer">

Choose Image

<input
type="file"
accept="image/*"
onChange={handleFile}
className="hidden"
/>

</label>

{preview && (

<div className="mt-6">

<img
src={preview}
className="max-h-60 mx-auto rounded-lg"
/>

</div>

)}

<div className="mt-6">

<button
onClick={scanCards}
className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
>

{loading ? "Scanning..." : "Scan Cards"}

</button>

</div>

</div>

{cards.length>0 &&(

<div className="mt-10">

<h2 className="text-xl mb-4">
Extracted Contacts
</h2>

<div className="space-y-3">

{cards.map((c,i)=>(
<div key={i} className="border border-slate-700 p-4 rounded">

<div><b>Name:</b> {c.name}</div>
<div><b>Company:</b> {c.company}</div>
<div><b>Phone:</b> {c.phone}</div>
<div><b>Email:</b> {c.email}</div>

</div>
))}

</div>

<div className="flex gap-4 mt-6">

<button
onClick={exportExcel}
className="px-6 py-2 bg-blue-600 rounded-lg"
>
Export Excel
</button>

<button
onClick={addToSalesCalling}
className="px-6 py-2 bg-purple-600 rounded-lg"
>
Add All To Sales Calling
</button>

</div>

</div>

)}

</div>

)

}