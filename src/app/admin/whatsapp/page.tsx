"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  analyticsService,
  type AdminWhatsappUsersResponse,
  type AdminWhatsappRow,
} from "@/lib/admin/analytics";
import { Loader2, MessageCircle, Copy, Check } from "lucide-react";

export default function AdminWhatsappPage() {
  const [data, setData] = useState<AdminWhatsappUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const pageSize = 25;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAdminWhatsappUsers(
        page,
        appliedSearch || undefined,
        pageSize
      );
      setData(res);
    } catch {
      setError("Could not load WhatsApp users.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, appliedSearch]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSelected(new Set());
  }, [page, appliedSearch]);

  const results = data?.results ?? [];
  const total = data?.total_with_whatsapp ?? 0;
  const count = data?.count ?? 0;

  const allOnPageSelected = useMemo(() => {
    if (results.length === 0) return false;
    return results.every((r) => selected.has(r.id));
  }, [results, selected]);

  const toggleAllOnPage = () => {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        results.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        results.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copySelected = async () => {
    const nums = results
      .filter((r) => selected.has(r.id))
      .map((r) => r.whatsapp_number);
    if (nums.length === 0) return;
    try {
      await navigator.clipboard.writeText(nums.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search.trim());
    setPage(1);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
            WhatsApp
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
            Isticmaalayaasha lambarka WhatsApp geliyey
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-sm font-bold text-emerald-900">
          Total with WhatsApp:{" "}
          <span className="tabular-nums">{total}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
        <form
          onSubmit={onSearchSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            type="search"
            placeholder="Search by name, email, or number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => void copySelected()}
            disabled={selected.size === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            Copy selected numbers
          </button>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {selected.size} selected
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4 font-medium">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-500 py-12 font-medium">
            No users with a WhatsApp number match your search.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 pr-2 w-10">
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleAllOnPage}
                        className="rounded border-gray-300"
                        aria-label="Select all on page"
                      />
                    </th>
                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Name
                    </th>
                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Phone
                    </th>
                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Joined
                    </th>
                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Last active
                    </th>
                    <th className="pb-3 pr-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row: AdminWhatsappRow) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-50 hover:bg-gray-50/80"
                    >
                      <td className="py-3 pr-2">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleOne(row.id)}
                          className="rounded border-gray-300"
                          aria-label={`Select ${row.name}`}
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-xs font-bold text-gray-900">
                          {row.name}
                        </div>
                        <div className="text-[9px] text-gray-500 truncate max-w-[220px]">
                          {row.email}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs font-mono text-gray-800">
                        {row.whatsapp_number}
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-700">
                        {row.date_joined
                          ? new Date(row.date_joined).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )
                          : "—"}
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-700">
                        {row.last_active
                          ? new Date(row.last_active).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="py-3 pr-2 text-center">
                        {row.whatsapp_href ? (
                          <a
                            href={row.whatsapp_href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Page {page} · {count} matching · {total} total with WhatsApp
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data?.previous}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data?.next}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
