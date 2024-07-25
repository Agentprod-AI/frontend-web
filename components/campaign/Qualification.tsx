"use client";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Info, Plus, Sparkles, Trash } from "lucide-react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

function Qualification() {
  const [criteria, setCriteria] = useState<any>([]);

  const addCriteria = () => {
    setCriteria([
      ...criteria,
      { question: "", answer: "", addToCampaign: false },
    ]);
  };

  const updateCriteria = (index: number, updatedCriterion: any) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = updatedCriterion;
    setCriteria(updatedCriteria);
  };

  // const deleteCriterion = (index: number) => {
  //   const updatedCriteria = criteria.filter((_: any, i: number) => i !== index);
  //   setCriteria(updatedCriteria);
  // };

  return (
    <div>
      {/* {JSON.stringify(criteria)} */}
      <Card className="text-xl flex justify-between py-4 items-center px-5">
        <div className="pl-10 ">Qualification</div>
        <Button>Start Qualification</Button>
      </Card>
      <div className="mt-10 ml-14">
        <Card className=" py-2 dark:text-white/50 light:text-black/20 max-w-4xl">
          <div className="pl-4 flex items-center">
            <Info className="mr-3" width={20} height={20} />
            Contact and company are enriched
          </div>
        </Card>

        {criteria.map((criterion: any, index: number) => (
          <TextInput
            key={index}
            criterion={criterion}
            onUpdate={(updatedCriterion: any) =>
              updateCriteria(index, updatedCriterion)
            }
            // onDelete={() => deleteCriterion(index)}
          />
        ))}

        <div className="my-3">
          <Button
            className="bg-transparent dark:text-white border dark:border-white dark:hover:bg-white dark:hover:text-black"
            onClick={addCriteria}
          >
            <Plus width={17} height={17} className="mr-2" /> Add qualification
            criteria
          </Button>
        </div>
      </div>
    </div>
  );
}

function TextInput({ criterion, onUpdate }: any) {
  const [localCriterion, setLocalCriterion] = useState(criterion);

  const handleUpdate = () => {
    onUpdate(localCriterion);
  };

  return (
    <div className="my-5 flex items-center max-w-4xl">
      <span className="font-semibold">AND</span>
      <div className="relative ml-4 flex items-center dark:bg-[#1F1F1F] rounded w-full">
        <Sparkles
          className="absolute left-4 text-gray-400"
          width={19}
          height={19}
        />

        <Dialog>
          <DialogTrigger className="w-full">
            <Input
              className="pl-10 bg-transparent w-full dark:text-white/70 placeholder:dark:text-white/20"
              placeholder={`Filter Question: Ask a yes-no question, such as "Is this company remote work friendly?"`}
              value={localCriterion.question}
              onChange={(e) =>
                setLocalCriterion({
                  ...localCriterion,
                  question: e.target.value,
                })
              }
            />
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-start">Filter question</DialogTitle>
              <DialogDescription className="">
                <div className="mt-4">
                  <Input
                    className="bg-transparent w-full dark:text-white/70 placeholder:dark:text-white/20"
                    value={localCriterion.question}
                    onChange={(e) =>
                      setLocalCriterion({
                        ...localCriterion,
                        question: e.target.value,
                      })
                    }
                  />
                  <div className="my-3 dark:text-white/40 text-start">
                    Ask a yes-no question, such as "Is this company remote work
                    friendly?"
                  </div>
                  <div className="text-start">
                    Add to Campaign if answer is..
                  </div>
                  <RadioGroup
                    className="my-3"
                    value={localCriterion.answer}
                    onValueChange={(value) =>
                      setLocalCriterion({ ...localCriterion, answer: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="option-one" />
                      <Label htmlFor="option-one">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="option-two" />
                      <Label htmlFor="option-two">No</Label>
                    </div>
                  </RadioGroup>
                  <div className="flex mt-6 space-x-2">
                    <Checkbox
                      id="terms2"
                      className="mt-1"
                      checked={localCriterion.addToCampaign}
                      onCheckedChange={(checked) =>
                        setLocalCriterion({
                          ...localCriterion,
                          addToCampaign: checked,
                        })
                      }
                    />
                    <label
                      htmlFor="terms2"
                      className="text-sm font-medium text-start leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Also add to Campaign if we are unable to answer the filter
                      question
                    </label>
                  </div>
                  <DialogClose asChild>
                    <Button className="my-1 mt-6" onClick={handleUpdate}>
                      Save qualification
                    </Button>
                  </DialogClose>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* <Trash className="ml-3 cursor-pointer" onClick={onDelete} /> */}
    </div>
  );
}

export default Qualification;
