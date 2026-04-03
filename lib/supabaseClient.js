import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "SUA_URL_DO_SUPABASE";
const supabaseAnonKey = "SUA_ANON_KEY";

// 🔥 TESTE PARA VER SE ENV ESTÁ FUNCIONANDO
console.log("URL:", supabaseUrl);
console.log("Anon Key:", supabaseAnonKey);


export const supabase = createClient(supabaseUrl, supabaseAnonKey);