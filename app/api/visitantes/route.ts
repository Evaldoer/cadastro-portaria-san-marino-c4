import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; // usa service role key

// ================= GET =================
export async function GET() {
  const { data, error } = await supabaseServer
    .from("visitantes")
    .select("*")
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.nome || !body?.rg || !body?.apartamento) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("visitantes")
      .insert([{ ...body, data: new Date().toISOString() }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao salvar visitante" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { error } = await supabaseServer.from("visitantes").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// ================= PUT =================
export async function PUT(req: Request) {
  const body = await req.json();
  if (!body?.id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { error } = await supabaseServer.from("visitantes").update(body).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}