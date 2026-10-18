'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Target, Shield, Server, Plus, Check } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { Input } from '@/shared/presentation/ui/input';

interface Vault {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  icon: React.ElementType;
}

export function SavingsVaultsCard({ className }: { className?: string }) {
  const [vaults, setVaults] = useState<Vault[]>([
    {
      id: 'vault-1',
      name: 'Cadangan Server & Cloud',
      currentAmount: 450,
      targetAmount: 500,
      icon: Server,
    },
    {
      id: 'vault-2',
      name: 'Dana Darurat Likuid',
      currentAmount: 300,
      targetAmount: 600,
      icon: Shield,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');

  function handleCreateVault(e: React.FormEvent) {
    e.preventDefault();
    if (!newVaultName || !newVaultTarget) return;

    setVaults([
      ...vaults,
      {
        id: `vault-${Date.now()}`,
        name: newVaultName,
        currentAmount: 0,
        targetAmount: parseFloat(newVaultTarget) || 100,
        icon: Target,
      },
    ]);

    setNewVaultName('');
    setNewVaultTarget('');
    setIsModalOpen(false);
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-5 text-slate-100',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40">
            <Target className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              Brankas & Target Tabungan
            </h2>
            <p className="text-[11px] text-slate-400">
              Alokasi dana USD khusus terpisah dari batas belanja kartu virtual
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 text-xs font-medium border-slate-800 bg-slate-900 text-teal-400 hover:text-teal-300"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Brankas Baru</span>
        </Button>
      </div>

      {/* Vault List */}
      <div className="space-y-3.5">
        {vaults.map((vault) => {
          const Icon = vault.icon;
          const percentage = Math.min(100, Math.round((vault.currentAmount / vault.targetAmount) * 100));
          return (
            <div
              key={vault.id}
              className="rounded-2xl border border-slate-800 bg-[#0c121e] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-teal-400 border border-slate-800">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">
                      {vault.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Target: ${vault.targetAmount.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white tabular-nums block">
                    ${vault.currentAmount.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-400 font-mono">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="h-2 w-full rounded-full bg-slate-800 overflow-hidden"
                role="progressbar"
                aria-valuenow={vault.currentAmount}
                aria-valuemin={0}
                aria-valuemax={vault.targetAmount}
                aria-label={vault.name}
              >
                <div
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* New Vault Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Brankas USD Baru"
        description="Pisahkan sebagian saldo USD Anda ke dalam brankas khusus yang aman dari transaksi kartu virtual harian."
        className="bg-[#111726] border-slate-800 text-slate-100"
      >
        <form onSubmit={handleCreateVault} className="space-y-4 pt-2">
          <Input
            label="Nama Tujuan Brankas"
            placeholder="Contoh: Perpanjangan Domain & Server Tahunan"
            value={newVaultName}
            onChange={(e) => setNewVaultName(e.target.value)}
            className="border-slate-800 bg-[#0c121e] text-white"
            required
          />

          <Input
            label="Target Nominal (USD)"
            placeholder="500.00"
            type="number"
            step="0.01"
            value={newVaultTarget}
            onChange={(e) => setNewVaultTarget(e.target.value)}
            className="border-slate-800 bg-[#0c121e] text-white font-mono"
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-teal-500"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>Buat Brankas</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
