// /* eslint-disable import/no-unresolved */
"use client";
// import React from "react";
// import { Pencil, Eye } from "lucide-react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import EditorContent from "./editor-content";
// import PreviewContent from "./preview-content";
// import { getAutogenerateTrainingEmail } from "./training.api";
// import { useCampaignContext } from "@/context/campaign-provider";

// export default function Training() {
//   const [activeTab, setActiveTab] = React.useState("editor");
//   const [previewData, setPreviewData] = React.useState("");
//   const { campaigns } = useCampaignContext();
//   console.log(campaigns);

//   const handleGenerateWithAI = async () => {
//     setActiveTab("preview"); // This sets the active tab to 'preview'
//     try {
//       const campaignId = "be5b96c7-7356-47d2-9bde-735679d4d0ba";
//       const data = await getAutogenerateTrainingEmail(campaignId);
//       console.log("data commingg -> ", data);
//       setPreviewData(data); // Assuming the response has a 'result' field
//       setActiveTab("preview"); // Switch to the Preview tab after fetching
//     } catch (error) {
//       console.error("Failed to fetch training data:", error);
//     }
//   };

//   return (
//     <>
//       <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
//         <div className="ml-4">Training</div>
//         <div className="flex items-center flex-row">
//           <Tabs
//             value={activeTab} // This binds the active tab state to the Tabs component
//             onValueChange={setActiveTab} // This changes the active tab state when a tab is manually clicked
//             className="w-[200px]"
//           >
//             <TabsList>
//               <TabsTrigger value="editor" className="flex gap-1">
//                 <Pencil className="h-3 w-3" />
//                 Editor
//               </TabsTrigger>
//               <TabsTrigger value="preview" className="flex gap-1">
//                 <Eye className="h-3 w-3" />
//                 Preview
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>
//           <Button>Start campaign</Button>
//         </div>
//       </div>
//       {activeTab === "editor" ? (
//         <EditorContent onGenerateWithAI={handleGenerateWithAI} />
//       ) : (
//         <PreviewContent previewData={previewData} />
//       )}
//     </>
//   );
// }

import React from "react";
import { Pencil, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditorContent from "./editor-content";
import PreviewContent from "./preview-content";
import { getAutogenerateTrainingEmail } from "./training.api";
import { useUserContext } from "@/context/user-context";
import { useCampaignContext } from "@/context/campaign-provider";

export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState("");
  const { user } = useUserContext();
  const { campaignId } = useCampaignContext();

  console.log("campaignIdFromTrainingPGEE", campaignId);

  const handleGenerateWithAI = async () => {
    setActiveTab("preview");
    try {
      const data = await getAutogenerateTrainingEmail(
        "a37d8526-316a-41eb-90e3-1a0c7a8e6e76",
        user.id
      );
      console.log("Data coming from AI generation:", data);
      setPreviewData(data);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="ml-4">Training</div>
        <div className="flex items-center flex-row">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-[200px]"
          >
            <TabsList>
              <TabsTrigger value="editor" className="flex gap-1">
                <Pencil className="h-3 w-3" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex gap-1">
                <Eye className="h-3 w-3" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>Start campaign</Button>
        </div>
      </div>
      {activeTab === "editor" ? (
        <EditorContent onGenerateWithAI={handleGenerateWithAI} />
      ) : (
        <PreviewContent previewData={previewData} />
      )}
    </>
  );
}
