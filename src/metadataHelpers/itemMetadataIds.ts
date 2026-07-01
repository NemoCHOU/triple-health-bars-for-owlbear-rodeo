export type StatMetadataID =
  | "health"
  | "max health"
  | "temporary health"
  | "health 2"
  | "max health 2"
  | "temporary health 2"
  | "health 3"
  | "max health 3"
  | "temporary health 3"
  | "armor class"
  | "hide";

export const HEALTH_METADATA_ID: StatMetadataID = "health";
export const MAX_HEALTH_METADATA_ID: StatMetadataID = "max health";
export const TEMP_HEALTH_METADATA_ID: StatMetadataID = "temporary health";
export const HEALTH_2_METADATA_ID: StatMetadataID = "health 2";
export const MAX_HEALTH_2_METADATA_ID: StatMetadataID = "max health 2";
export const TEMP_HEALTH_2_METADATA_ID: StatMetadataID = "temporary health 2";
export const HEALTH_3_METADATA_ID: StatMetadataID = "health 3";
export const MAX_HEALTH_3_METADATA_ID: StatMetadataID = "max health 3";
export const TEMP_HEALTH_3_METADATA_ID: StatMetadataID = "temporary health 3";
export const ARMOR_CLASS_METADATA_ID: StatMetadataID = "armor class";
export const HIDE_METADATA_ID: StatMetadataID = "hide";

export type TokenSortingMetadataID = "group" | "index";

export const GROUP_METADATA_ID: TokenSortingMetadataID = "group";
export const INDEX_METADATA_ID: TokenSortingMetadataID = "index";
