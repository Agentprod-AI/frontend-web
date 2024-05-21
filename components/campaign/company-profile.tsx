"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Field {
  label: string;
  items: string[];
  actionLabel?: string;
}

interface CompanyProfileProps {
  value: Field[];
  onChange: (value: Field[]) => void;
}

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  value,
  onChange,
}) => {
  const [detailsInput, setDetailsInput] = useState<string>("");

  const handleFieldChange = (
    index: number,
    itemIndex: number,
    newValue: string
  ) => {
    const updatedFields = value.map((field, i) => {
      if (i === index) {
        const updatedItems = field.items.map((item, j) =>
          j === itemIndex ? newValue : item
        );
        return { ...field, items: updatedItems };
      }
      return field;
    });
    onChange(updatedFields);
  };

  const handleAddItem = (type: string) => {
    if (detailsInput.trim()) {
      const updatedFields = value.map((field) => {
        if (field.label === type) {
          const updatedItems = [...field.items, detailsInput.trim()];
          return { ...field, items: updatedItems };
        }
        return field;
      });

      onChange(updatedFields);
      setDetailsInput("");
    }
  };

  return (
    <div>
      {value.map((field, index) => (
        <Card key={field.label} className="mb-4">
          <CardHeader className="pb-2">
            <CardDescription>{field.label}</CardDescription>
          </CardHeader>
          <CardContent>
            {field.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between items-center mt-2"
              >
                <Input
                  value={item}
                  onChange={(e) =>
                    handleFieldChange(index, itemIndex, e.target.value)
                  }
                  className="mr-4"
                />
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    const updatedFields = value.map((f, i) => {
                      if (i === index) {
                        const updatedItems = f.items.filter(
                          (_, j) => j !== itemIndex
                        );
                        return { ...f, items: updatedItems };
                      }
                      return f;
                    });
                    onChange(updatedFields);
                  }}
                >
                  <Icons.trash size={16} />
                </Button>
              </div>
            ))}
            {field.actionLabel && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mt-4 text-sm font-normal"
                    variant={"outline"}
                  >
                    Add {field.actionLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add {field.actionLabel}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="newItem" className="text-right">
                        {field.actionLabel}
                      </Label>
                      <Input
                        id="newItem"
                        value={detailsInput}
                        onChange={(e) => setDetailsInput(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        onClick={() => handleAddItem(field.label)}
                      >
                        Add
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
