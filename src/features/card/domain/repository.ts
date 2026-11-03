import { CardDetails } from './entities/card-details';

export interface RevealedCardSecrets {
  cardNumberFormatted: string;
  cvv: string;
  expiresInSeconds: number;
}

export interface CardRepository {
  getCardDetails(userId?: string): Promise<CardDetails>;
  toggleFreezeCard(isFrozen: boolean): Promise<boolean>;
  updateCardControls(controls: Partial<CardDetails>): Promise<CardDetails>;
  revealCardDetails(password: string): Promise<RevealedCardSecrets>;
}
