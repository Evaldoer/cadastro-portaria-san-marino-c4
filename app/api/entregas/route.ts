import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// ================= GET =================
export async function GET() {
  const { data, error } = await supabaseServer
    .from("entregas")
    .select("*")
    .order("data_hora", { ascending: false });

  if (error) {
    console.error("❌ ERRO GET:", error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(
    data.map((e) => ({
      id: e.id,
      descricao: e.descricao,
      quantidade: e.quantidade,
      bloco: e.bloco,
      apartamento: e.apartamento,
      foto: e.foto_url,
      data: e.data_hora,
    }))
  );
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const descricao = formData.get("descricao") as string;
    const quantidade = formData.get("quantidade") as string;
    const bloco = formData.get("bloco") as string;
    const apartamento = formData.get("apartamento") as string;
    const file = formData.get("foto") as File;

    let fotoUrl = "";

    // ================= UPLOAD =================
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

      const { error: uploadError } = await supabaseServer.storage
        .from("entregas")
        .upload(fileName, file, {
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) {
        console.error("❌ ERRO UPLOAD:", uploadError);
      } else {
        const { data } = supabaseServer.storage
          .from("entregas")
          .getPublicUrl(fileName);

        fotoUrl = data.publicUrl;
      }
    }

    // 🔥 HORÁRIO CORRETO (BRASIL)
    const dataBrasil = new Date().toLocaleString("sv-SE", {
      timeZone: "America/Sao_Paulo",
    });

    // ================= SALVAR =================
    const { data: novaEntrega, error } = await supabaseServer
      .from("entregas")
      .insert([
        {
          descricao,
          quantidade,
          bloco,
          apartamento,
          foto_url: fotoUrl,
          data_hora: dataBrasil,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ ERRO INSERT:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      id: novaEntrega.id,
      descricao: novaEntrega.descricao,
      quantidade: novaEntrega.quantidade,
      bloco: novaEntrega.bloco,
      apartamento: novaEntrega.apartamento,
      foto: novaEntrega.foto_url,
      data: novaEntrega.data_hora,
    });
  } catch (err) {
    console.error("❌ ERRO GERAL:", err);
    return NextResponse.json({ error: "Erro geral" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await supabaseServer.from("entregas").delete().eq("id", id);

  return NextResponse.json({ success: true });
}

// ================= PUT =================
export async function PUT(req: Request) {
  const body = await req.json();

  await supabaseServer.from("entregas").update(body).eq("id", body.id);

  return NextResponse.json({ success: true });
}