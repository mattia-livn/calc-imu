declare module 'pdf-parse' {
  interface PDFParseData {
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
    text: string
  }

  export default function pdf(dataBuffer: Buffer): Promise<PDFParseData>
}
