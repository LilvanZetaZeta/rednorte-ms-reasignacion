import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validación defensiva estricta
if (!supabaseUrl || !supabaseKey) {
    console.error("Faltan credenciales de Supabase en el archivo .env");
    process.exit(1); // Detiene la aplicación inmediatamente
}

export const supabase = createClient(supabaseUrl, supabaseKey);