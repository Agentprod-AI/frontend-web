import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

function WarningBanner() {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-screen bg-red-500/80 text-white z-50 p-4 h-16 flex items-center justify-center space-x-5">
      <span className="font-semibold">You have not subscribed to any plan</span>
      <Button className="bg-transparent border-2 border-white text-white hover:bg-black">
        Click to view Plan
      </Button>
      <div className="">
        <button
          className="ml-4 text-white "
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
