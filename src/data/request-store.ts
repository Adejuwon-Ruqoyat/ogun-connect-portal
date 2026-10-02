import { useSyncExternalStore } from "react";
import type { CaseRecord } from "@/types";
import { seedCases } from "./mock-data";

/** In-memory prototype store. Replace these functions with API calls later. */
let cases: CaseRecord[] = seedCases;
let nextNumber = 127;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const snapshot = () => cases;

export function useCases() { return useSyncExternalStore(subscribe, snapshot, snapshot); }
export function useCase(ref: string) { return useCases().find((c) => c.ref === ref); }
export function addCase(input: Omit<CaseRecord, "ref">): string {
  const ref = `BET-2026-${String(nextNumber++).padStart(6, "0")}`;
  cases = [{ ...input, ref }, ...cases]; emit(); return ref;
}
export function updateCase(ref: string, fn: (c: CaseRecord) => CaseRecord) {
  cases = cases.map((c) => (c.ref === ref ? fn(c) : c)); emit();
}
export function nowLabel() {
  return new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
