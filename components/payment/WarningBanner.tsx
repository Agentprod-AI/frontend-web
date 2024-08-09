import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PriceCard from "./PriceCard";

function WarningBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleCheckoutStart = () => {
    setIsLoading(true);
    handleDialogClose();
  };

  const handleCheckoutComplete = () => {
    setIsLoading(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-screen bg-red-500/80 text-white z-20 p-4 h-16 flex items-center justify-center space-x-5">
      <span className="font-semibold">You have not subscribed to any plan</span>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition duration-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Click to view Plan"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-8xl h-screen overflow-y-scroll ">
          <PriceCard
            onClose={handleDialogClose}
            onCheckoutComplete={handleCheckoutComplete}
          />
        </DialogContent>
      </Dialog>

      <div className="">
        <button
          className="ml-4 text-white mt-1 "
          onClick={handleClose}
          aria-label="Close"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default WarningBanner;
