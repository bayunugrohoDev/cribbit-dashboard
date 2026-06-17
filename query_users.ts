import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1] || "";
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1] || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from("profiles").select("*");
  console.log("PROFILES:");
  data?.forEach(p => console.log(`ID: ${p.id}, Name: ${p.full_name}, Email: ${p.email}, DeletedAt: ${p.deleted_at}`));
  
  const { data: users, error: err2 } = await supabase.rpc("get_users_with_auth");
  console.log("\nGET_USERS_WITH_AUTH:");
  users?.forEach((u: any) => console.log(`ID: ${u.id}, Name: ${u.full_name}, Email: ${u.email}, DeletedAt: ${u.deleted_at}`));
}

check();
