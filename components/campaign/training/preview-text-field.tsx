import React from "react";

interface TextFieldProps {
  text: string;
}

const TextField: React.FC<TextFieldProps> = ({ text }) => {
  return (
    <div className="p-2 border rounded w-full h-72 ">
      <textarea
        value={text}
        readOnly
        className="w-full h-full text-base  text-white bg-transparent resize-none focus:outline-none"
        aria-readonly="true"
      />
    </div>
  );
};

export default TextField;
