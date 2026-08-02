import { LovelaceCardConfig } from "custom-card-helpers";

export interface SmaailcardConfig extends LovelaceCardConfig {
  /** Always "custom:smaail-card". */
  type: string;
  /** Title shown at the top of the card body. */
  name?: string;
  /** Optional ha-card header, rendered above the body. */
  header?: string;
  /** Optional entity whose state is displayed as an example. */
  entity?: string;
}
