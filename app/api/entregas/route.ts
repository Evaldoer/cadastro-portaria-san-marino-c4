import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// ================= GET =================
export async function GET() {
  const { data, error } = await supabaseServer
    .from("entregas")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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
    const file = formData.get("foto") as File | null;

    let fotoUrl = "";

    // 📸 Upload para Supabase Storage
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabaseServer.storage
        .from("entregas") // nome do bucket
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json(
          { error: "Erro no upload da imagem" },
          { status: 500 }
        );
      }

      const { data } = supabaseServer.storage
        .from("entregas")
        .getPublicUrl(fileName);

      fotoUrl = data.publicUrl;
    }

    // 💾 Salvar no banco
    const { data, error } = await supabaseServer
      .from("entregas")
      .insert([
        {
          descricao,
          quantidade,
          bloco,
          apartamento,
          foto: fotoUrl,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao salvar entrega" },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao salvar entrega" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("entregas")
      .delete()
      .eq("id", body.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}

// ================= PUT =================
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("entregas")
      .update({
        descricao: body.descricao,
        quantidade: body.quantidade,
        bloco: body.bloco,
        apartamento: body.apartamento,
      })
      .eq("id", body.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}