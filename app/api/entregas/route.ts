import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; // usa service role key
import { writeFile } from "fs/promises";
import path from "path";

// ================= GET =================
export async function GET() {
  const { data, error } = await supabaseServer
    .from("entregas")
    .select("*")
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const descricao = String(formData.get("descricao") || "");
    const quantidade = String(formData.get("quantidade") || "");
    const bloco = String(formData.get("bloco") || "");
    const apartamento = String(formData.get("apartamento") || "");
    const foto = formData.get("foto") as File | null;

    let fotoPath: string | undefined;
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${foto.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", fileName);
      await writeFile(uploadPath, buffer);
      fotoPath = `/uploads/${fileName}`;
    }

    const { data, error } = await supabaseServer
      .from("entregas")
      .insert([{ descricao, quantidade, bloco, apartamento, foto: fotoPath, data: new Date().toISOString() }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao salvar entrega" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { error } = await supabaseServer.from("entregas").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// ================= PUT =================
export async function PUT(req: Request) {
  const body = await req.json();
  if (!body?.id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { error } = await supabaseServer.from("entregas").update(body).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}