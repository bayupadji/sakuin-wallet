import { CardDetails } from './entities/card-details';

export interface CardRepository {
  getCardDetails(userId?: string): Promise<CardDetails>;
  toggleFreezeCard(isFrozen: boolean): Promise<boolean>;
  updateCardControls(controls: Partial<CardDetails>): Promise<CardDetails>;
}
