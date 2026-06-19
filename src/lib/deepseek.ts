const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";

export interface CursoGenerado {
  nombre: string;
  descripcion: string;
  plan_estudios: Unidad[];
}

export interface Unidad {
  unidad: number;
  titulo: string;
  temas: string[];
  semanas: number;
  actividades_sugeridas: string[];
}

const SYSTEM_PROMPT = `Eres un asistente experto en educación y diseño curricular. Tu tarea es analizar el texto de un programa académico y generar una estructura de curso organizada.

Responde ÚNICAMENTE con un objeto JSON (sin markdown, sin \`\`\`) con esta estructura:

{
  "nombre": "Nombre sugerido de la materia",
  "descripcion": "Breve descripción de la materia",
  "plan_estudios": [
    {
      "unidad": 1,
      "titulo": "Título de la unidad",
      "temas": ["Tema 1", "Tema 2", "Tema 3"],
      "semanas": 3,
      "actividades_sugeridas": ["Actividad 1", "Actividad 2"]
    }
  ]
}

Reglas:
- Extrae el nombre de la materia del texto si es posible
- Divide en unidades lógicas basadas en el contenido
- Cada unidad debe tener 2-5 temas
- Asigna semanas realistas (1-4 por unidad)
- Sugiere 1-3 actividades por unidad
- Si el texto es muy breve o genérico, genera una estructura razonable por defecto`;

export async function generarPlanEstudios(texto: string): Promise<CursoGenerado> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error(
      "DEEPSEEK_API_KEY no configurada. Agrega la variable de entorno con tu API key de DeepSeek."
    );
  }

  const res = await fetch(DEEPSEEK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: texto },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`DeepSeek API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("Respuesta vacía de DeepSeek");
  }

  // Limpiar posibles marcas de markdown
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`No se pudo parsear la respuesta de DeepSeek: ${cleaned.slice(0, 200)}`);
  }
}
