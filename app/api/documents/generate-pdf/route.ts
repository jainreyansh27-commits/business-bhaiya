import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts } from "pdf-lib"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const rawText: string =
      body.text ||
      body.content ||
      body.aiResponse ||
      "No content"

    const cleaned = rawText
  .replace(/\*\*/g,"")
  .replace(/__/g,"")
  .replace(/#/g,"")
  .replace(/```/g,"")
  .replace(/₹/g,"Rs ")

    const pdfDoc = await PDFDocument.create()

    let page = pdfDoc.addPage([595,842])

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const fontSize = 12
    const lineHeight = 18

    let y = 800

    const drawLine = (text:string,boldText=false)=>{

      if(y < 60){

        page = pdfDoc.addPage([595,842])
        y = 800

      }

      page.drawText(text,{
        x:50,
        y,
        size:fontSize,
        font: boldText ? bold : font
      })

      y -= lineHeight

    }

    const wrapText = (text:string,max=90)=>{

      const words = text.split(" ")
      const lines:string[] = []
      let current=""

      for(const word of words){

        if((current + word).length > max){

          lines.push(current)
          current = word + " "

        }else{

          current += word + " "

        }

      }

      if(current) lines.push(current)

      return lines

    }

    const paragraphs = cleaned.split("\n")

    paragraphs.forEach((p:string)=>{

      const lines = wrapText(p)

      lines.forEach((line:string)=>{

        drawLine(line)

      })

      y -= 6

    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes),{

      headers:{
        "Content-Type":"application/pdf",
        "Content-Disposition":"attachment; filename=document.pdf"
      }

    })

  }

  catch(err){

    console.error(err)

    return NextResponse.json(
      {error:"PDF generation failed"},
      {status:500}
    )

  }

}