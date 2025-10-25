import google.generativeai as genai
import os
import json
from PIL import Image
from typing import Dict, Any
import io

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY no está configurada en las variables de entorno")
        
        genai.configure(api_key=api_key)
        # Usar el modelo correcto disponible en la API
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def procesar_ticket(self, imagen_bytes: bytes) -> Dict[str, Any]:
        """
        Procesa una imagen de ticket y extrae la información estructurada
        """
        try:
            # Convertir bytes a imagen PIL
            imagen = Image.open(io.BytesIO(imagen_bytes))
            
            # Prompt especializado para extracción de tickets
            prompt = """
                **ROL:** Eres un especialista en procesamiento de visión y extracción de datos. Tu única tarea es analizar la imagen de ticket de compra proporcionada, extraer los detalles de cada producto individual, el nombre del negocio y el total de la cuenta, y devolver el resultado en un formato JSON estricto.

                **TAREA Y REGLAS DE EXTRACCIÓN:**

                1.  **Nombre del Negocio:**
                    * Extrae el nombre del negocio/comercio que aparece en el ticket.
                    * Campo: `nombre_negocio` (string)

                2.  **Extracción de Detalle de Productos (Líneas de Artículo):**
                    * Crea una lista JSON llamada `articulos`.
                    * Cada elemento debe contener **cuatro** campos obligatorios:
                        * `descripcion`: Nombre o descripción completa del producto (string).
                        * `cantidad`: Cantidad de unidades compradas (número flotante, ej. 2.0).
                        * `precio_unitario`: Precio por unidad (número flotante).
                        * `monto_linea`: Monto total de esa línea (Precio unitario * Cantidad) (número flotante).

                3.  **Total de la Cuenta:**
                    * Extrae el monto total final de la compra que aparece en el ticket.
                    * Campo: `total` (número flotante)
                    * Busca etiquetas como: "TOTAL", "Total a Pagar", "Total General", etc.

                4.  **Exclusión de Datos:**
                    * **Ignora y no incluyas** campos como Fecha, Hora, Subtotal, Impuestos (IVA) por separado.

                5.  **Manejo de Errores:**
                    * Si algún campo no puede ser identificado, utiliza `null` para el valor.
                    * **NO** incluyas ninguna explicación, texto introductorio, ni comentarios fuera del bloque JSON.

                **FORMATO DE SALIDA (OUTPUT):**

                Responde SOLO con un JSON válido siguiendo exactamente esta estructura:

                {
                "nombre_negocio": "string o null",
                "total": 0.0,
                "articulos": [
                    {
                    "descripcion": "string",
                    "cantidad": 0.0,
                    "precio_unitario": 0.0,
                    "monto_linea": 0.0
                    }
                ]
                }
                """
            
            # Generar respuesta usando Gemini Vision
            response = self.model.generate_content([prompt, imagen])
            
            # Extraer el texto de la respuesta
            response_text = response.text.strip()
            
            # Limpiar la respuesta (remover markdown code blocks si existen)
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parsear JSON
            datos_ticket = json.loads(response_text)
            
            return datos_ticket
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Error al parsear la respuesta JSON de Gemini: {str(e)}\nRespuesta: {response_text}")
        except Exception as e:
            raise Exception(f"Error al procesar la imagen con Gemini: {str(e)}")
