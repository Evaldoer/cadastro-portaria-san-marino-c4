import { NextResponse } from "next/server";
import { getLocalDateTimeForDatabase } from "@/lib/dateTime";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("visitantes")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.nome || !body?.rg || !body?.apartamento) {
      return NextResponse.json({ error: "Campos obrigatorios faltando" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("visitantes")
      .insert([{ ...body, data: getLocalDateTimeForDatabase() }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch {
    return NextResponse.json({ error: "Erro ao salvar visitante" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.id) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("visitantes").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const body = await req.json();

  if (!body?.id) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("visitantes").update(body).eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
