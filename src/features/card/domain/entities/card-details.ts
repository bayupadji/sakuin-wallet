export interface CardDetails {
  id: string;
  cardholderName: string;
  last4: string;
  expiry: string;
  issuingCountry: string;
  isFrozen: boolean;
  monthlyLimit: number;
  onlineTransactions: boolean;
  non3dsTransactions: boolean;
  atmWithdrawals: boolean;
}
