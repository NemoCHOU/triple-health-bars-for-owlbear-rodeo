import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import {
  ARMOR_CLASS_METADATA_ID,
  HEALTH_2_METADATA_ID,
  HEALTH_3_METADATA_ID,
  HEALTH_METADATA_ID,
  HIDE_METADATA_ID,
  MAX_HEALTH_2_METADATA_ID,
  MAX_HEALTH_3_METADATA_ID,
  MAX_HEALTH_METADATA_ID,
  StatMetadataID,
  TEMP_HEALTH_2_METADATA_ID,
  TEMP_HEALTH_3_METADATA_ID,
  TEMP_HEALTH_METADATA_ID,
} from "./metadataHelpers/itemMetadataIds";

export type InputName =
  | "health"
  | "maxHealth"
  | "tempHealth"
  | "health2"
  | "maxHealth2"
  | "tempHealth2"
  | "health3"
  | "maxHealth3"
  | "tempHealth3"
  | "armorClass"
  | "hideStats";

const inputNames: InputName[] = [
  "health",
  "maxHealth",
  "tempHealth",
  "health2",
  "maxHealth2",
  "tempHealth2",
  "health3",
  "maxHealth3",
  "tempHealth3",
  "armorClass",
  "hideStats",
];

export function isInputName(id: string): id is InputName {
  return inputNames.includes(id as InputName);
}

export async function writeTokenValueToItem(
  itemId: string,
  name: InputName,
  value: number | boolean,
) {
  const id = convertInputNameToMetadataId(name);

  await OBR.scene.items.updateItems([itemId], (items) => {
    // Throw error if more than one token selected
    if (items.length > 1) {
      throw "Selection exceeded max length, expected 1, got: " + items.length;
    }

    // Modify item
    for (let item of items) {
      const itemMetadata = item.metadata[getPluginId("metadata")];
      item.metadata[getPluginId("metadata")] = {
        ...(typeof itemMetadata === "object" ? itemMetadata : {}),
        ...{ [id]: value },
      };
    }
  });
}

export function getNewStatValue(
  name: InputName,
  inputContent: string,
  previousValue: number,
): number {
  return restrictValueRange(
    convertInputNameToMetadataId(name),
    inlineMath(inputContent, previousValue),
  );
}

function inlineMath(inputContent: string, previousValue: number): number {
  const newValue = parseFloat(inputContent);

  if (Number.isNaN(newValue)) return 0;
  if (inputContent.startsWith("+") || inputContent.startsWith("-")) {
    return Math.trunc(previousValue + Math.trunc(newValue));
  }

  return newValue;
}

function restrictValueRange(id: StatMetadataID, value: number): number {
  switch (id) {
    case HEALTH_METADATA_ID:
    case MAX_HEALTH_METADATA_ID:
    case HEALTH_2_METADATA_ID:
    case MAX_HEALTH_2_METADATA_ID:
    case HEALTH_3_METADATA_ID:
    case MAX_HEALTH_3_METADATA_ID:
      if (value > 9999) {
        value = 9999;
      } else if (value < -999) {
        value = -999;
      }
      break;
    case TEMP_HEALTH_METADATA_ID:
    case TEMP_HEALTH_2_METADATA_ID:
    case TEMP_HEALTH_3_METADATA_ID:
    case ARMOR_CLASS_METADATA_ID:
      if (value > 999) {
        value = 999;
      } else if (value < -999) {
        value = -999;
      }
      break;
    default:
      break;
  }
  return value;
}

function convertInputNameToMetadataId(id: InputName): StatMetadataID {
  switch (id) {
    case "health":
      return HEALTH_METADATA_ID;
    case "maxHealth":
      return MAX_HEALTH_METADATA_ID;
    case "tempHealth":
      return TEMP_HEALTH_METADATA_ID;
    case "health2":
      return HEALTH_2_METADATA_ID;
    case "maxHealth2":
      return MAX_HEALTH_2_METADATA_ID;
    case "tempHealth2":
      return TEMP_HEALTH_2_METADATA_ID;
    case "health3":
      return HEALTH_3_METADATA_ID;
    case "maxHealth3":
      return MAX_HEALTH_3_METADATA_ID;
    case "tempHealth3":
      return TEMP_HEALTH_3_METADATA_ID;
    case "armorClass":
      return ARMOR_CLASS_METADATA_ID;
    case "hideStats":
      return HIDE_METADATA_ID;
  }
}
