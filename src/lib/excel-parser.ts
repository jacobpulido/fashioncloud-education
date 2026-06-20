import * as XLSX from "xlsx";
import { generarPlanEstudios } from "./deepseek";

export interface ExcelRow {
  nombre: string;
  descripcion: string;
  unidad: string;
  temas: string;
  semanas: string;
}

export function parseExcelToText(file: ArrayBuffer): string {
  const workbook = XLSX.read(file, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

  if (data.length === 0) return "";

  // Try to auto-detect columns
  const headers = Object.keys(data[0]);
  const nombreCol = headers.find(h => /nombre|materia|curso|subject|name/i.test(h));
  const temaCol = headers.find(h => /tema|contenido|content|topic/i.test(h));
  const unidadCol = headers.find(h => /unidad|unit|module/i.test(h));
  const descCol = headers.find(h => /descrip|description/i.test(h));

  let output = "";
  if (nombreCol) output += `Materia: ${data[0][nombreCol as keyof ExcelRow]}\n\n`;
  if (descCol) output += `Descripción: ${data[0][descCol as keyof ExcelRow]}\n\n`;

  output += "Plan de estudios:\n";
  data.forEach((row, i) => {
    const unidad = unidadCol ? row[unidadCol as keyof ExcelRow] : "";
    const tema = temaCol ? row[temaCol as keyof ExcelRow] : "";
    if (unidad) output += `\nUnidad ${unidad}: `;
    if (tema) output += `\n- ${tema}`;
  });

  return output;
}

export function getFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv" || ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = parseExcelToText(e.target?.result as ArrayBuffer);
          resolve(text);
        } catch (err: any) {
          reject(new Error("Error al leer el archivo: " + err.message));
        }
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsArrayBuffer(file);
    } else if (ext === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || "");
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsText(file);
    } else {
      reject(new Error("Formato no soportado. Usa .txt, .csv, .xlsx o .xls"));
    }
  });
}
