"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  type RAGSettings,
} from "@/app/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<RAGSettings>(DEFAULT_SETTINGS);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rag-settings");

    if (stored) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...JSON.parse(stored),
      });
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      "rag-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-zinc-400">
            Configure retrieval and model behavior.
          </p>
        </div>

        {/* Model Settings */}

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Model Settings
          </h2>

          <div className="space-y-4">

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Model
              </label>

              <select
                value={settings.model}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    model: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-3"
              >
                <option value="phi3">phi3</option>
                <option value="qwen2.5:1.5b">
                  qwen2.5:1.5b
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Temperature
              </label>

              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temperature: Number(e.target.value),
                  })
                }
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Max Tokens
              </label>

              <input
                type="number"
                min="100"
                max="4000"
                value={settings.maxTokens}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxTokens: Number(e.target.value),
                  })
                }
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-3"
              />
            </div>

          </div>
        </section>

        {/* Retrieval Settings */}

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Retrieval Settings
          </h2>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Top K Results
            </label>

            <input
              type="number"
              min="1"
              max="50"
              value={settings.topK}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  topK: Number(e.target.value),
                })
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-3"
            />
          </div>
        </section>

        {/* UI Settings */}

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            UI Settings
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.showSources}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  showSources: e.target.checked,
                })
              }
            />

            <span>Show Sources</span>
          </label>
        </section>

        {/* Save Button */}

        <button
          onClick={saveSettings}
          className="rounded-2xl bg-red-700 px-6 py-3 font-medium text-white transition hover:bg-red-600"
        >
          Save Settings
        </button>

        {saved && (
          <p className="text-green-400">
            Settings saved successfully.
          </p>
        )}

      </div>
    </main>
  );
}