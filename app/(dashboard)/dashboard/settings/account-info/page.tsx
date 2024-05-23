/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/user-context";
import axiosInstance from "@/utils/axiosInstance";
// import { first, last } from "slate";
// import { da, pl } from "date-fns/locale";

type Info = {
  id: string;
  value: string | undefined | null | number;
  isEditable: boolean;
};

export default function Page() {
  const { user, updateUser } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState<Info[]>([]);
  const [dummyAccountInfo, setDummyAccountInfo] = useState<Info[]>([
    { id: "ID", value: "", isEditable: false },
    { id: "Sender First Name", value: "", isEditable: true },
    { id: "Sender Last Name", value: "", isEditable: true },
    { id: "Sender Job", value: "", isEditable: true },
    { id: "Email", value: "", isEditable: true },
    { id: "Company", value: "", isEditable: true },
    { id: "Company ID", value: "", isEditable: false },
    { id: "Notifications", value: "", isEditable: true },
    { id: "Plan", value: "", isEditable: false },
    { id: "Leads used", value: "", isEditable: false },
  ]);

  console.log("usering user", user);
  React.useEffect(() => {
    if (user?.id) {
      axiosInstance
        .get(`/v2/settings/${user.id}`)
        .then((response) => {
          const data = response.data;
          const initialAccountInfo = [
            { id: "ID", value: data.user_id, isEditable: false },
            {
              id: "Sender First Name",
              value: data.first_name,
              isEditable: true,
            },
            { id: "Sender Last Name", value: data.last_name, isEditable: true },
            { id: "Sender Job", value: data.job, isEditable: true },
            { id: "Email", value: data.email, isEditable: true },
            { id: "Company", value: data.company, isEditable: true },
            { id: "Company ID", value: data.companyId, isEditable: false },
            {
              id: "Notifications",
              value: data.notifications,
              isEditable: true,
            },
            { id: "Plan", value: data.plan, isEditable: false },
            { id: "Leads used", value: data.leads_used, isEditable: false },
          ];
          setAccountInfo(initialAccountInfo);
          updateUser({
            id: data.user_id,
            firstName: data.first_name,
            lastName: data.last_name,
            company: data.company,
            companyID: data.companyId,
            notification: data.notifications,
            plan: data.plan,
            leadUsed: data.leads_used,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
          setAccountInfo(dummyAccountInfo);
        });
    } else {
      setAccountInfo(dummyAccountInfo);
    }
  }, [user]);

  const handleInputChange = (id: string, value: string) => {
    setAccountInfo(
      accountInfo.map((info) => (info.id === id ? { ...info, value } : info))
    );
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const infoToShow = accountInfo.length > 0 ? accountInfo : dummyAccountInfo;

  return (
    <div>
      <div className="rounded-md border border-collapse mb-8">
        <Table className="w-full text-left">
          <TableBody>
            {infoToShow.map((info) => (
              <TableRow key={info.id} className="hover:bg-transparent">
                <TableCell className="font-medium px-4 py-2 border-r bg-muted/50 w-1/3">
                  {info.id}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing && info.isEditable ? (
                    <Input
                      type="text"
                      value={info?.value?.toString()}
                      onChange={(e) =>
                        handleInputChange(info.id, e.target.value)
                      }
                    />
                  ) : (
                    info?.value
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleEditClick}>
          {isEditing ? "Update" : "Edit"}
        </Button>
        {isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
        {!isEditing && (
          <Button variant="outline">Manage your subscription</Button>
        )}
      </div>
    </div>
  );
}
