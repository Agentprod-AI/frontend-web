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
import { toast } from "sonner";

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
    { id: "Phone", value: "", isEditable: true },
    { id: "Company", value: "", isEditable: true },
    { id: "Company ID", value: "", isEditable: false },
    { id: "Notifications", value: "", isEditable: true },
    { id: "Plan", value: "", isEditable: false },
    { id: "Leads used", value: "", isEditable: false },
  ]);

  const fetchDataInfo = () => {
    if (user?.id) {
      axiosInstance
        .get(`/v2/settings/${user.id}`)
        .then((response) => {
          const data = response.data;

          const initialAccountInfo = [
            {
              id: "ID",
              value: data.user_id || user.id,
              isEditable: false,
            },
            {
              id: "Sender First Name",
              value: data.first_name,
              isEditable: true,
            },
            {
              id: "Sender Last Name",
              value: data.last_name,
              isEditable: true,
            },
            { id: "Sender Job", value: data.job_title, isEditable: true },
            { id: "Email", value: data.email || user.email, isEditable: true },
            { id: "Phone", value: data.phone_number, isEditable: true },
            { id: "Company", value: data.company, isEditable: true },
            { id: "Company ID", value: data.companyId, isEditable: true },
            {
              id: "Notifications",
              value: data.notifications,
              isEditable: false,
            },
            { id: "Plan", value: data.plan, isEditable: false },
            { id: "Leads used", value: data.leads_used, isEditable: false },
          ];
          setAccountInfo(initialAccountInfo);
          updateUser({
            id: data.user_id,
            firstName: data.first_name,
            lastName: data.last_name,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
          setAccountInfo(dummyAccountInfo);
        });
    } else {
      setAccountInfo(dummyAccountInfo);
    }
  };

  React.useEffect(() => {
    fetchDataInfo();
  }, []);

  const handleInputChange = (id: string, value: string) => {
    const newAccountInfo = accountInfo.map((item) => {
      if (item.id === id) {
        return { ...item, value: value }; // explicitly spread previous item and update value
      }
      return item;
    });
    setAccountInfo(newAccountInfo);
  };

  const handleUpdateClick = async () => {
    const updatePayload = accountInfo.reduce((acc: any, { id, value }) => {
      // Convert the ID for API compatibility: 'First Name' becomes 'first_name'
      const key = id.replace(/ /g, "_").toLowerCase();

      return acc;
    }, {});

    const payload = {
      user_id: accountInfo[0].value,
      first_name: accountInfo[1].value,
      last_name: accountInfo[2].value,
      job_title: accountInfo[3].value,
      email: accountInfo[4].value,
      phone_number: accountInfo[5].value,
      company: accountInfo[6].value,
      company_id: accountInfo[7].value,
      notifications: accountInfo[8].value,
      plan: accountInfo[9].value,
      leads_used: accountInfo[10].value,
    };
    try {
      const response = await axiosInstance.put(`/v2/settings`, payload);
      setAccountInfo(
        accountInfo.map((info) => {
          const newInfo =
            response.data[info.id.replace(/ /g, "_").toLowerCase()];
          return newInfo !== undefined ? { ...info, value: newInfo } : info;
        })
      );
      toast.success("User details updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user details:", error);
      toast.error("Error in updating user details.");
    }
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
                      value={info?.value?.toString() ?? ""}
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
        <Button onClick={isEditing ? handleUpdateClick : handleEditClick}>
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
