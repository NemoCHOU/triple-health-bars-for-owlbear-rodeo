import "../index.css";
import "./editStatsStyle.css";
import Token from "../metadataHelpers/TokenType";
import { useEffect, useState } from "react";
import {
  getNewStatValue,
  InputName,
  isInputName,
  writeTokenValueToItem,
} from "../statInputHelpers";
import OBR from "@owlbear-rodeo/sdk";
import {
  getSelectedItems,
  parseItems,
} from "../metadataHelpers/itemMetadataHelpers";
import BarInput from "../components/BarInput";
import BubbleInput from "../components/BubbleInput";
import NameInput from "../components/NameInput";
import IconButton from "../components/IconButton";
import MagicIcon from "../components/MagicIcon";
import { Button } from "@/components/ui/button";
import BookLock from "@/components/icons/BookLock";
import BookOpen from "@/components/icons/BookOpen";
import { cn } from "@/lib/utils";
import {
  getName,
  getSelectedItemNameProperty,
  writeNameToSelectedItem,
} from "@/metadataHelpers/nameHelpers";
import getGlobalSettings from "@/background/getGlobalSettings";

export default function StatsMenuApp({
  initialToken,
  initialTokenName,
  initialNameTagsEnabled,
  role,
}: {
  initialToken: Token;
  initialTokenName: string;
  initialNameTagsEnabled: boolean;
  role: "GM" | "PLAYER";
}): JSX.Element {
  const [token, setToken] = useState<Token>(initialToken);

  useEffect(
    () =>
      OBR.scene.items.onChange(() => {
        const updateStats = (tokens: Token[]) => {
          let currentToken = tokens[0];
          setToken(currentToken);
        };
        getSelectedItems().then((selectedItems) => {
          updateStats(parseItems(selectedItems));
          setTokenName(getName(selectedItems[0]));
        });
      }),
    [],
  );

  function handleStatUpdate(target: HTMLInputElement, previousValue: number) {
    const name = target.name;
    if (!isInputName(name)) throw "Error: invalid input name.";

    const value = getNewStatValue(name, target.value, previousValue);

    setToken((prev) => ({ ...prev, [name]: value }) as Token);
    writeTokenValueToItem(token.item.id, name, value);
  }

  function toggleHide() {
    const name: InputName = "hideStats";
    if (!isInputName(name)) throw "Error: invalid input name.";

    const value = !token.hideStats;
    setToken((prev) => ({ ...prev, [name]: value }) as Token);
    writeTokenValueToItem(token.item.id, name, value);
  }

  const [tokenName, setTokenName] = useState(initialTokenName);

  const [nameTagsEnabled, setNameTagsEnabled] = useState(
    initialNameTagsEnabled,
  );

  useEffect(() =>
    OBR.scene.onMetadataChange(async (sceneMetadata) => {
      const nameTagsEnabled = (
        await getGlobalSettings(undefined, sceneMetadata, undefined)
      ).settings.nameTags;
      setNameTagsEnabled(nameTagsEnabled);
    }),
  );
  useEffect(() =>
    OBR.room.onMetadataChange(async (roomMetadata) => {
      const nameTagsEnabled = (
        await getGlobalSettings(undefined, undefined, roomMetadata)
      ).settings.nameTags;
      setNameTagsEnabled(nameTagsEnabled);
    }),
  );

  const NameField: JSX.Element = (
    <div className="grid grid-cols-[1fr,auto,1fr] place-items-center">
      <div></div>
      <div className="w-[144px]">
        <NameInput
          updateHandler={(target) => {
            const updateName = target.value.replaceAll(" ", "") !== "";
            writeNameToSelectedItem(target.value, updateName);
          }}
          inputProps={{
            placeholder: "Name",
            value: tokenName,
            onChange: (e) => {
              setTokenName(e.target.value);
            },
          }}
          animateOnlyWhenRootActive={true}
        ></NameInput>
      </div>
      {tokenName === "" && (
        <div className="right-0 top-0">
          <IconButton
            Icon={MagicIcon}
            onClick={() => {
              getSelectedItemNameProperty().then((name) => {
                setTokenName(name);
                writeNameToSelectedItem(name);
              });
            }}
            padding=""
            animateOnlyWhenRootActive={true}
          ></IconButton>
        </div>
      )}
    </div>
  );

  const healthRows = [
    {
      label: "HP 1",
      health: token.health,
      maxHealth: token.maxHealth,
      healthName: "health" as const,
      maxHealthName: "maxHealth" as const,
    },
    {
      label: "HP 2",
      health: token.health2,
      maxHealth: token.maxHealth2,
      healthName: "health2" as const,
      maxHealthName: "maxHealth2" as const,
    },
    {
      label: "HP 3",
      health: token.health3,
      maxHealth: token.maxHealth3,
      healthName: "health3" as const,
      maxHealthName: "maxHealth3" as const,
    },
  ];

  const StatsMenu: JSX.Element = (
    <div className="rounded-lg bg-mirage-950/[0.07] fill-text-secondary p-2 dark:bg-mirage-50/[0.07] dark:fill-text-secondary-dark">
      <div className="grid grid-cols-[auto,1fr] items-center gap-x-2 gap-y-1">
        {healthRows.map((row) => (
          <div className="contents" key={row.label}>
            <h2 className="w-9 text-center text-2xs font-medium tracking-wider text-text-secondary dark:text-text-secondary-dark">
              {row.label}
            </h2>
            <BarInput
              parentValue={row.health}
              parentMax={row.maxHealth}
              color={"RED"}
              valueUpdateHandler={async (target) =>
                handleStatUpdate(target, row.health)
              }
              maxUpdateHandler={async (target) =>
                handleStatUpdate(target, row.maxHealth)
              }
              valueName={row.healthName}
              maxName={row.maxHealthName}
              animateOnlyWhenRootActive={true}
            ></BarInput>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 place-items-center gap-2">
        <div className="grid justify-items-center gap-1">
          <h2 className="text-center text-2xs font-medium tracking-wider text-text-secondary dark:text-text-secondary-dark">
            TEMP HP
          </h2>
          <BubbleInput
            parentValue={token.tempHealth}
            color="GREEN"
            updateHandler={(target) =>
              handleStatUpdate(target, token.tempHealth)
            }
            name="tempHealth"
            animateOnlyWhenRootActive={true}
          />
        </div>
        <div className="grid justify-items-center gap-1">
          <h2 className="text-center text-2xs font-medium tracking-wider text-text-secondary dark:text-text-secondary-dark">
            AC
          </h2>
          <BubbleInput
            parentValue={token.armorClass}
            color="BLUE"
            updateHandler={(target) =>
              handleStatUpdate(target, token.armorClass)
            }
            name={"armorClass"}
            animateOnlyWhenRootActive={true}
          />
        </div>
      </div>
    </div>
  );

  const HideButton: JSX.Element = (
    <div>
      <Button
        variant={"ghost"}
        className={cn(
          "size-full rounded-lg bg-mirage-950/[0.07] text-base font-normal text-text-primary hover:bg-mirage-950/15 dark:bg-mirage-50/[0.07] dark:text-text-primary-dark dark:hover:bg-mirage-50/15",
        )}
        onClick={() => toggleHide()}
      >
        {token.hideStats && true ? (
          <div className="inline-flex items-center gap-2 text-primary-800 hover:text-primary-800 dark:text-primary-dark-300 dark:hover:text-primary-dark-300">
            <BookLock />
            <div>Dungeon Master Only</div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2">
            <BookOpen />
            <div>Player Editable</div>
          </div>
        )}
      </Button>
    </div>
  );

  return (
    <div className="h-full space-y-2 overflow-hidden px-2 py-1">
      {nameTagsEnabled && NameField}
      {StatsMenu}
      {role === "GM" && HideButton}
    </div>
  );
}

