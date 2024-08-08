import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { BsStars } from "react-icons/bs";

const SuggestionDisplay = ({ suggestions }: { suggestions: string }) => {
  const [showAll, setShowAll] = useState(false);

  if (!suggestions || suggestions.trim() === "") {
    return null;
  }

  const suggestionArray = suggestions
    .split(/(?=Suggestion \d+:)/)
    .filter((s) => s.trim() !== "");
  const displaySuggestions = showAll
    ? suggestionArray
    : suggestionArray.slice(0, 1);

  return (
    <div className="flex flex-col w-full mt-2 mr-4">
      <div className="flex items-center gap-3">
        <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
          <BsStars className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-xs ml-1">
          Sally completed the proof-reading. These are the suggestions.
        </div>
      </div>
      <Card className="mt-4 mr-5 ml-10 border-none outline outline-cyan-950 outline-offset-4">
        <CardHeader></CardHeader>
        <CardContent className="text-xs -ml-3 -mt-4">
          <div className="space-y-2">
            {displaySuggestions.map((suggestion: string, index: number) => (
              <p key={index}>{suggestion.trim()}</p>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end text-xs items-center">
          {!showAll && suggestionArray.length > 1 && (
            <Button
              variant="link"
              onClick={() => setShowAll(true)}
              className="p-0 h-auto text-blue-500 hover:text-blue-700"
            >
              See more
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuggestionDisplay;
