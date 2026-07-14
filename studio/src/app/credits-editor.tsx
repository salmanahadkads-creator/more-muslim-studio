/* Custom control for the Episode credits list (target: content.credits.list).
   Credits used to be one "Name — Role" line per row in a code textarea, which
   mis-split any name containing a hyphen or dash ("Yassmin Abdel-Magied" became
   name "Yassmin Abdel", role "Magied — Reporter"). Each credit is now its own
   row with separate Name and Title boxes, so no delimiter parsing can corrupt
   a name; rows are added and removed one by one.

   IMPORTANT: the controls panel invokes custom renderers as a plain function
   call (`CustomControl({...})`), not as a JSX element — there is no real
   component boundary, so this function must never call a React hook itself.
   <TextInput> and <Button> below are safe because they ARE rendered via JSX. */
"use client";

import { PlusIcon, XIcon } from "@phosphor-icons/react";

import type { ToolcraftCustomControlRenderer } from "@/toolcraft/runtime/react";
import { Button, ControlFieldLabel, Field, TextInput } from "@/toolcraft/ui";

import { readCreditsDraft, type Credit } from "./credits";

export const CreditsEditor: ToolcraftCustomControlRenderer = ({
  name,
  setValue,
  value,
}) => {
  const draft = readCreditsDraft(value);
  const rows: Credit[] = draft.length > 0 ? draft : [{ name: "", title: "" }];

  const commitRow = (index: number, patch: Partial<Credit>, meta?: Parameters<typeof setValue>[1]) => {
    const next = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, ...patch } : row,
    );

    setValue(next, meta);
  };

  return (
    <Field className="gap-2">
      <ControlFieldLabel>{name}</ControlFieldLabel>
      <div className="flex flex-col gap-2">
        {rows.map((row, index) => (
          <div className="flex items-center gap-1" key={index}>
            <div className="min-w-0 flex-1">
              <TextInput
                inputs={[
                  {
                    name: `Credit ${index + 1} name`,
                    onValueChange: (nextName, meta) => commitRow(index, { name: nextName }, meta),
                    showLabel: false,
                    value: row.name,
                  },
                  {
                    name: `Credit ${index + 1} title`,
                    onValueChange: (nextTitle, meta) => commitRow(index, { title: nextTitle }, meta),
                    showLabel: false,
                    value: row.title,
                  },
                ]}
                inputsPerRow={2}
              />
            </div>
            <Button
              aria-label={`Remove credit ${index + 1}`}
              disabled={rows.length <= 1}
              onClick={() => {
                setValue(rows.filter((_, rowIndex) => rowIndex !== index));
              }}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <XIcon />
            </Button>
          </div>
        ))}
        <Button
          aria-label="Add credit"
          onClick={() => {
            setValue([...rows, { name: "", title: "" }]);
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          <PlusIcon />
          Add credit
        </Button>
      </div>
    </Field>
  );
};
