"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type BarcodeDetectorResult = {
  rawValue?: string;
  format?: string;
};

type BarcodeDetectorApi = {
  detect(source: ImageBitmapSource): Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorConstructor = {
  new (options?: { formats?: string[] }): BarcodeDetectorApi;
  getSupportedFormats?: () => Promise<string[]>;
};

const barcodeFormats = [
  "qr_code",
  "code_128",
  "code_39",
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "itf",
  "codabar",
] as const;

function getBarcodeDetector() {
  const detectorHost = globalThis as typeof globalThis & {
    BarcodeDetector?: BarcodeDetectorConstructor;
  };

  return detectorHost.BarcodeDetector;
}

export default function RegistrarEntregaPage() {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [bloco, setBloco] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [codigoLido, setCodigoLido] = useState("");
  const [formatoLido, setFormatoLido] = useState("");
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [scannerDisponivel, setScannerDisponivel] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [cameraDisponivel, setCameraDisponivel] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetectorApi | null>(null);

  useEffect(() => {
    const Detector = getBarcodeDetector();
    setScannerDisponivel(Boolean(Detector));
    setCameraDisponivel(Boolean(navigator.mediaDevices?.getUserMedia));
  }, []);

  useEffect(() => {
    if (!scannerAtivo) {
      return undefined;
    }

    let cancelled = false;
    const videoElement = videoRef.current;

    async function iniciarScanner() {
      const Detector = getBarcodeDetector();

      if (!videoElement) {
        setMensagem("Camera indisponivel nesta pagina.");
        setScannerAtivo(false);
        return;
      }

      try {
        if (Detector) {
          const supportedFormats = Detector.getSupportedFormats
            ? await Detector.getSupportedFormats()
            : [];

          const formats =
            supportedFormats.length > 0
              ? barcodeFormats.filter((format) => supportedFormats.includes(format))
              : [...barcodeFormats];

          detectorRef.current = new Detector({ formats });
        } else {
          detectorRef.current = null;
          setMensagem("Camera aberta. A leitura automatica nao esta disponivel neste navegador.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoElement.srcObject = stream;
        await videoElement.play();

        const scan = async () => {
          const canvasElement = canvasRef.current;

          if (cancelled || !canvasElement) {
            return;
          }

          if (!detectorRef.current) {
            frameRef.current = window.requestAnimationFrame(scan);
            return;
          }

          try {
            if (videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
              const context = canvasElement.getContext("2d");

              if (context) {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
              }
            }

            const detections = await detectorRef.current.detect(canvasElement);
            const primeiraLeitura = detections.find((item) => item.rawValue);

            if (primeiraLeitura?.rawValue) {
              setCodigoLido(primeiraLeitura.rawValue);
              setFormatoLido(primeiraLeitura.format ?? "");
              setMensagem("Codigo detectado com sucesso.");
              setScannerAtivo(false);
              return;
            }
          } catch {
            setMensagem("Nao foi possivel analisar a imagem da camera.");
            setScannerAtivo(false);
            return;
          }

          frameRef.current = window.requestAnimationFrame(scan);
        };

        frameRef.current = window.requestAnimationFrame(scan);
      } catch {
        setMensagem("Nao foi possivel acessar a camera.");
        setScannerAtivo(false);
      }
    }

    iniciarScanner();

    return () => {
      cancelled = true;

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      videoElement.srcObject = null;
    };
  }, [scannerAtivo]);

  async function registrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSalvando(true);
    setMensagem("");

    try {
      const formData = new FormData();
      formData.append("descricao", descricao);
      formData.append("quantidade", quantidade);
      formData.append("bloco", bloco);
      formData.append("apartamento", apartamento);

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await fetch("/api/entregas", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao registrar entrega.");
      }

      setMensagem("Entrega registrada com sucesso.");
      setDescricao("");
      setQuantidade("");
      setBloco("");
      setApartamento("");
      setFoto(null);
      setCodigoLido("");
      setFormatoLido("");
    } catch {
      setMensagem("Nao foi possivel registrar a entrega.");
    } finally {
      setSalvando(false);
    }
  }

  function usarCodigoNaDescricao() {
    if (!codigoLido) {
      return;
    }

    setDescricao((valorAtual) => {
      if (!valorAtual.trim()) {
        return `Codigo ${codigoLido}`;
      }

      if (valorAtual.includes(codigoLido)) {
        return valorAtual;
      }

      return `${valorAtual} | Codigo ${codigoLido}`;
    });
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <h2>Registrar Entrega</h2>
        <p>Cadastre a encomenda, envie a foto e leia QR code ou codigo de barras pela camera.</p>
      </div>

      <div className="scanner-panel">
        <div className="scanner-copy">
          <span className="scanner-badge">Leitor inteligente</span>
          <h3>QR code e codigo de barras</h3>
          <p>
            Abra a camera para capturar o codigo da entrega e usar a leitura no campo de descricao.
          </p>
        </div>

        <div className="scanner-actions">
          <button
            type="button"
            onClick={() => setScannerAtivo((valorAtual) => !valorAtual)}
            disabled={!cameraDisponivel}
          >
            {scannerAtivo ? "Parar leitor" : "Abrir camera"}
          </button>
          <button type="button" className="btn-edit" onClick={usarCodigoNaDescricao} disabled={!codigoLido}>
            Usar codigo na descricao
          </button>
        </div>

        {!scannerDisponivel ? (
          <p className="scanner-note">
            Seu navegador nao oferece leitura automatica nativa. A camera pode ser usada, mas o codigo precisa ser digitado manualmente.
          </p>
        ) : null}

        <div className="scanner-preview">
          {scannerAtivo ? (
            <>
              <video ref={videoRef} className="scanner-video" muted playsInline />
              <canvas ref={canvasRef} className="scanner-canvas" />
            </>
          ) : (
            <div className="scanner-idle">
              {codigoLido ? "Ultima leitura pronta para uso." : "Abra a camera para iniciar a leitura."}
            </div>
          )}
        </div>

        <div className="scanner-result">
          <label>Codigo lido</label>
          <input
            value={codigoLido}
            onChange={(e) => setCodigoLido(e.target.value)}
            placeholder="Nenhum codigo capturado ainda"
          />
          <small>{formatoLido ? `Formato detectado: ${formatoLido}` : "QR code, Code 128, EAN e outros suportados."}</small>
        </div>
      </div>

      <form className="delivery-form" onSubmit={registrar}>
        <input placeholder="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <input placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        <input placeholder="Bloco" value={bloco} onChange={(e) => setBloco(e.target.value)} required />
        <input placeholder="Apartamento" value={apartamento} onChange={(e) => setApartamento(e.target.value)} required />

        <label className="file-field">
          <span>Foto da entrega</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
          />
        </label>

        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Registrar"}
        </button>
      </form>

      {mensagem ? <p className="form-feedback">{mensagem}</p> : null}
    </div>
  );
}
