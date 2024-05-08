// components/ui/TextField.tsx
import React from "react";

interface TextFieldProps {
  text: string; // Text to be displayed in the text field
}

const TextField: React.FC<TextFieldProps> = ({ text }) => {
  return (
    <div className="p-2 border  rounded w-full">
      <textarea
        value={text}
        readOnly
        className="w-full h-full text-white bg-transparent resize-none focus:outline-none"
        aria-readonly="true" // Accessibility property for read-only state
      />
    </div>
  );
};

export default TextField;
