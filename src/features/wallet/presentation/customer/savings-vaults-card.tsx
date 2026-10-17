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
      name: 'Cloud Infrastructure Reserve',
      currentAmount: 450,
      targetAmount: 500,
      icon: Server,
    },
    {
      id: 'vault-2',
      name: 'Emergency Buffer',
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
        'rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <Target className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Vaults & Savings Goals
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Reserved USD funds partitioned from card spending
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>New Vault</span>
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
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-900/40 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs dark:bg-slate-800 dark:text-slate-200">
                    <Icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {vault.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Target: ${vault.targetAmount.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums block">
                    ${vault.currentAmount.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 font-mono">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-800 overflow-hidden"
                role="progressbar"
                aria-valuenow={vault.currentAmount}
                aria-valuemin={0}
                aria-valuemax={vault.targetAmount}
                aria-label={vault.name}
              >
                <div
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-500"
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
        title="Create Dedicated Vault"
        description="Partition a portion of your USD wallet balance into a dedicated reserve safe from everyday virtual debit card purchases."
      >
        <form onSubmit={handleCreateVault} className="space-y-4 pt-2">
          <Input
            label="Vault Goal Name"
            placeholder="e.g. Annual Domain & Server Subscriptions"
            value={newVaultName}
            onChange={(e) => setNewVaultName(e.target.value)}
            required
          />

          <Input
            label="Target Amount (USD)"
            placeholder="500.00"
            type="number"
            step="0.01"
            value={newVaultTarget}
            onChange={(e) => setNewVaultTarget(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="gap-1.5">
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>Create Vault</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
