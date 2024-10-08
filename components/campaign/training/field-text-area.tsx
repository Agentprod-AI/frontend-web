"use client";

import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Editor, Transforms, Range, createEditor } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
} from "slate-react";
import ReactDOM from "react-dom";
import { cn } from "@/lib/utils";
import { allFieldsListType } from "@/components/campaign/training/types";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
import { getAutogenerateTrainingEmail } from "./training.api";

const FieldTextArea = ({
  fieldsList,
  emailContent,
}: {
  fieldsList: allFieldsListType | any;
  emailContent?: string;
}) => {
  const [isAIWriting, setIsAIWriting] = useState(false);
  const [autogeneratedEmail, setAutogeneratedEmail] = useState("");
  const ref = useRef<HTMLDivElement | null>();
  const [target, setTarget] = useState<Range | undefined | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );
  const searchLower = search.toLowerCase();
  // const charList = Object.keys(fieldsList).flatMap((key) =>
  //   fieldsList[key]
  //     .filter(({ val }: { val: string }) =>
  //       val.toLowerCase().startsWith(searchLower)
  //     )
  //     .slice(0, 10)
  // );
  const charList = useMemo(() => {
    return Object.keys(fieldsList).flatMap((key) => {
      const items = fieldsList[key];
      if (Array.isArray(items)) {
        // Ensure items is an array
        return items
          .filter(({ val }) => val.toLowerCase().startsWith(searchLower))
          .slice(0, 10);
      }
      return []; // Return an empty array if not an array
    });
  }, [fieldsList, searchLower]);

  // make chars a list of strings
  const chars = charList.map((c) => c.val);

  const onKeyDown = useCallback(
    (event: any) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el: any = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  // const toggleAIWriting = async (value: string) => {
  //   setIsAIWriting(value === "ai");
  //   if (value === "ai") {
  //     try {
  //       // Assuming 'campaignId' can be sourced elsewhere or is fixed
  //       const campaignId = "some-campaign-id"; // You need to modify this according to your context
  //       const email = await getAutogenerateTrainingEmail(campaignId);
  //       setAutogeneratedEmail(email);
  //     } catch (error) {
  //       console.error("Error fetching autogenerated email:", error);
  //       // Handle the error appropriately (e.g., show an error message)
  //     }
  //   } else {
  //     setAutogeneratedEmail("");
  //   }
  // };
  return (
    <div className="w-full">
      <Slate
        editor={editor}
        initialValue={
          isAIWriting
            ? [{ type: "paragraph", children: [{ text: autogeneratedEmail }] }]
            : initialValue
        }
        onChange={() => {
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^\{(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }

          setTarget(null);
        }}
      >
        <Editable
          className="outline outline-secondary mt-2 focus:outline-1 focus:outline-primary p-3 w-full"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="Enter some text..."
          readOnly={isAIWriting}
        />
        {target && chars.length > 0 && (
          <Portal>
            <div
              // @ts-ignore
              ref={ref}
              style={{
                top: "-9999px",
                left: "-9999px",
                position: "absolute",
                zIndex: 1,
                borderRadius: "4px",
                boxShadow: "0 1px 5px rgba(0,0,0,.2)",
              }}
              data-cy="mentions-portal"
            >
              {chars.map((char, i) => (
                <div
                  key={char}
                  onClick={() => {
                    Transforms.select(editor, target);
                    insertMention(editor, char);
                    setTarget(null);
                  }}
                  className={cn(
                    "p-2 text-accent-foreground",
                    i === index ? "bg-accent" : "bg-popover"
                  )}
                >
                  {char}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </Slate>
    </div>
  );
};
const withMentions = (editor: any) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element: any) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element: any) => {
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const insertMention = (editor: any, character: any) => {
  const mention: MentionElement = {
    type: "mention",
    character,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "mention":
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Mention = ({ attributes, children, element }: any) => {
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: "3px 3px 2px",
    margin: "0 1px",
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    // backgroundColor: "gray",
    fontSize: "0.9em",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(" ", "-")}`}
      style={style}
      className="bg-accent"
    >
      {"{"}
      {element.character}
      {"}"}
      {children}
    </span>
  );
};

const initialValue: any[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
  // {
  //   type: "paragraph",
  //   children: [
  //     {
  //       text: "This example shows how you might implement a simple ",
  //     },
  //     {
  //       text: "start -> { and end -> }",
  //       bold: true,
  //     },
  //     {
  //       text: " feature that lets users autocomplete mentioning a user by their username. Which, in this case means Star Wars characters. The ",
  //     },
  //     {
  //       text: "mentions",
  //       bold: true,
  //     },
  //     {
  //       text: " are rendered as ",
  //     },
  //     {
  //       text: "void inline elements",
  //       code: true,
  //     },
  //     {
  //       text: " inside the document.",
  //     },
  //   ],
  // },
  // {
  //   type: "paragraph",
  //   children: [
  //     {
  //       type: "mention",
  //       character: "R2-D2",
  //       children: [{ text: "", bold: true }],
  //     },
  //     { text: " or " },
  //     {
  //       type: "mention",
  //       character: "Mace Windu",
  //       children: [{ text: "" }],
  //     },
  //     { text: "!" },
  //   ],
  // },
  // {
  //   type: "paragraph",
  //   children: [{ text: "hello!" }],
  // },
];

export default FieldTextArea;
