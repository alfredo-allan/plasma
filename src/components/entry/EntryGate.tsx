"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/Logo";
import { LogoMark } from "@/components/LogoMark";
import { DeckProgress } from "./DeckProgress";
import { markEntrySeen, useHasSeenEntry } from "./entryStorage";

/*
 * Portal de entrada "Drop In" da Plasma.
 *
 * Inspirado no portal da Scathon (mesma dinâmica: aparece uma vez por aba,
 * site montado por baixo, clique pra entrar), mas com a cara da marca:
 *  - fundo de concreto com uma luz de poste passando (pista à noite);
 *  - o símbolo da Plasma em 3D girando como roda (arrastável);
 *  - "Mais sorte que juízo." como frase principal;
 *  - progresso REAL: `useProgress` (drei) acompanha tudo que o three.js
 *    está baixando - inclusive o skate 3D do Hero, que já está montado por
 *    baixo. Quando a pessoa entra, o skate já está pronto, sem engasgo;
 *  - saída: um shape gigante atravessa a tela na diagonal, cobre tudo e
 *    revela o site.
 *
 * Quem tem "reduzir movimento" ativado no sistema ganha só um fade.
 */

// O 3D só existe no navegador; enquanto o chunk carrega, mostra o símbolo
// 2D girando (CSS) no mesmo lugar.
const EntryLogo3D = dynamic(() => import("./EntryLogo3D"), {
  ssr: false,
  loading: () => <SymbolFallback />,
});

const TAGLINE = "Mais sorte que juízo.";
/** Tempo mínimo na tela - mesmo com tudo em cache, dá pra ver a marca */
const MIN_DURATION_MS = 1800;
/** Se nada pra carregar aparecer até aqui, libera mesmo assim */
const IDLE_RELEASE_MS = 1500;
/** Trava de segurança: nunca prende ninguém mais que isso */
const MAX_WAIT_MS = 12000;

type Phase = "loading" | "ready" | "leaving" | "done";

export function EntryGate() {
  const hasSeen = useHasSeenEntry();
  const [phase, setPhase] = useState<Phase>("loading");
  const [contentHidden, setContentHidden] = useState(false);
  const [flip, setFlip] = useState(0);

  if (hasSeen && phase !== "leaving") return null;
  if (phase === "done") return null;

  return (
    <EntryOverlay
      phase={phase}
      setPhase={setPhase}
      contentHidden={contentHidden}
      setContentHidden={setContentHidden}
      flip={flip}
      onFlip={() => setFlip((f) => f + 1)}
    />
  );
}

type OverlayProps = {
  phase: Phase;
  setPhase: (p: Phase) => void;
  contentHidden: boolean;
  setContentHidden: (v: boolean) => void;
  flip: number;
  onFlip: () => void;
};

function EntryOverlay({ phase, setPhase, contentHidden, setContentHidden, flip, onFlip }: OverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const display = useLoadingProgress(phase === "loading", () => setPhase("ready"));

  // Foco no botão assim que ele aparece (teclado/leitor de tela)
  useEffect(() => {
    if (phase === "ready") buttonRef.current?.focus();
  }, [phase]);

  const enter = useCallback(() => {
    if (phase === "leaving") return;
    setPhase("leaving");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = () => {
      window.scrollTo(0, 0);
      markEntrySeen();
      document.documentElement.removeAttribute("data-entry-active");
    };

    if (reduceMotion || !wipeRef.current) {
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.35,
        onStart: reveal,
        onComplete: () => setPhase("done"),
      });
      return;
    }

    onFlip(); // kickflip no símbolo antes do shape passar

    // Shape gigante na diagonal: entra pela esquerda/baixo, cobre a tela,
    // e sai pela direita/cima. Medidas em px a partir do maior lado da tela
    // (o shape é dimensionado em vmax no CSS, ver <DeckWipe/>).
    const d = Math.max(window.innerWidth, window.innerHeight);
    const angle = (-18 * Math.PI) / 180;
    const along = (t: number) => ({ x: Math.cos(angle) * t * d, y: Math.sin(angle) * t * d });

    const tl = gsap.timeline({ onComplete: () => setPhase("done") });
    tl.set(wipeRef.current, { ...along(-3), rotation: -18, autoAlpha: 1 })
      .to(wipeRef.current, { ...along(0), duration: 0.6, ease: "power3.in" }, 0.35)
      .add(() => {
        // tela 100% coberta: some com o portal por baixo e libera o site
        setContentHidden(true);
        reveal();
      })
      .to(wipeRef.current, { ...along(3), duration: 0.7, ease: "power3.out" }, "+=0.12");
  }, [phase, setPhase, setContentHidden, onFlip]);

  // Esc = pular
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && enter();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter]);

  const ready = phase !== "loading";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Bem-vindo à Plasma"
      className="entry-gate fixed inset-0 z-[100] overflow-hidden"
    >
      {!contentHidden && (
        <div className="absolute inset-0 select-none bg-[#3b3a39] bg-texture text-[#fffdf9] bg-blend-multiply">
          {/* luz de poste passando + vinheta */}
          <div aria-hidden className="entry-lamp pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]"
          />

          {/* símbolo 3D */}
          <div className="absolute inset-x-0 top-0 h-[68%] sm:h-[72%]">
            <EntryLogo3D flip={flip} />
          </div>

          {/* topo */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-8">
            <Logo className="h-7 w-auto sm:h-9" />
            <div className="text-right text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/60 sm:text-xs">
              <p>São Paulo · BR</p>
              <p>23°32&apos;S 46°38&apos;W</p>
            </div>
          </div>

          {/* frase + progresso */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:gap-8 sm:px-8 sm:pb-10">
            <h1 className="entry-tagline text-center font-sans leading-[0.95] ~text-4xl/7xl">{TAGLINE}</h1>

            <div className="flex w-full max-w-xl flex-col items-center gap-3">
              {ready ? (
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={enter}
                  disabled={phase === "leaving"}
                  className="button-cutout group mx-4 inline-flex items-center gap-3 bg-gradient-to-b from-brand-plasma from-25% to-brand-secondary-orange to-75% bg-[length:100%_400%] px-2 py-3 font-sans text-white transition-[filter,background-position] duration-300 ~text-xl/3xl hover:bg-bottom hover:text-black focus-visible:outline-none"
                >
                  <LogoMark className="size-7 transition-transform group-hover:rotate-90 [&_path]:fill-current" />
                  Drop In
                </button>
              ) : (
                <div className="flex w-full items-end gap-4">
                  <div className="flex-1">
                    <DeckProgress value={display} />
                  </div>
                  <span
                    className="w-[3.2ch] text-right font-sans tabular-nums leading-none ~text-3xl/5xl"
                    role="progressbar"
                    aria-label="Carregando"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={display}
                  >
                    {String(display).padStart(3, "0")}
                  </span>
                </div>
              )}

              <div className="flex w-full items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/60 sm:text-xs">
                <span aria-live="polite">{ready ? "Pista liberada" : "Carregando a pista…"}</span>
                {!ready && (
                  <button type="button" onClick={enter} className="uppercase underline-offset-4 hover:text-white hover:underline">
                    Pular
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeckWipe ref={wipeRef} />
    </div>
  );
}

/**
 * O "shape" da transição: uma pílula gigante (vista de baixo, com a marca)
 * que atravessa a tela na diagonal. Começa invisível; quem posiciona e
 * anima é a timeline do GSAP em `enter()`.
 */
function DeckWipe({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible absolute left-1/2 top-1/2 flex items-center justify-center overflow-hidden rounded-[75vmax] border-[1.2vmax] border-black bg-gradient-to-b from-brand-secondary-orange to-brand-plasma"
      style={{ width: "400vmax", height: "150vmax", marginLeft: "-200vmax", marginTop: "-75vmax" }}
    >
      <div className="absolute inset-0 bg-texture opacity-30 mix-blend-multiply" />
      {/* símbolo em branco aqui - vermelho sobre vermelho sumiria */}
      <Logo className="relative h-auto w-[70vmax] drop-shadow-[0.6vmax_0.6vmax_0_#000] [&_g>path:not(:first-child)]:fill-[#fffdf9]" />
    </div>
  );
}

function SymbolFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <LogoMark className="entry-spin size-[30vmin] max-h-48 max-w-48" />
    </div>
  );
}

/**
 * Progresso exibido (0-100), suavizado. Usa o progresso real do three.js
 * (`useProgress`) e decide quando liberar o botão:
 *  - tudo carregado (100% e nada ativo), ou
 *  - nada começou a carregar em IDLE_RELEASE_MS (ex.: página sem 3D), ou
 *  - passou MAX_WAIT_MS (trava de segurança);
 * sempre respeitando MIN_DURATION_MS.
 */
function useLoadingProgress(running: boolean, onDone: () => void) {
  const { progress, active, total } = useProgress();
  const [display, setDisplay] = useState(0);
  const live = useRef({ progress, active, total, shown: 0 });
  live.current.progress = progress;
  live.current.active = active;
  live.current.total = total;

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const s = live.current;
      const elapsed = now - start;
      const idle = !s.active && s.total === 0 && elapsed > IDLE_RELEASE_MS;
      const loaded = !s.active && s.total > 0 && s.progress >= 100;
      const timedOut = elapsed > MAX_WAIT_MS;
      const finished = loaded || idle || timedOut;

      // alvo: progresso real, mas sem chegar a 100 antes do tempo mínimo
      const timeCap = Math.min(1, elapsed / MIN_DURATION_MS) * 100;
      const target = finished ? timeCap : Math.min(s.progress, timeCap, 99);
      s.shown += (target - s.shown) * 0.12;
      if (finished && timeCap >= 100 && s.shown > 99.4) s.shown = 100;

      const rounded = Math.round(s.shown);
      setDisplay((prev) => (prev === rounded ? prev : rounded));

      if (s.shown >= 100) {
        // um respiro no 100 antes de trocar pelo botão
        window.setTimeout(() => onDoneRef.current(), 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return display;
}
