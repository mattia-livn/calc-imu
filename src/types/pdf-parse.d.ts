declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFParseData {
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
    text: string
  }

  const pdfParse: (dataBuffer: Buffer) => Promise<PDFParseData>
  export default pdfParse
}
