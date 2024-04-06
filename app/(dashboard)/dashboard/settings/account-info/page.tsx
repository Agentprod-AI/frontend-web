"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';

type Info = {
  id: string;
  value: string | number;
  isEditable: boolean;
};

const initialAccountInfo: Info[] = [
  { id: "ID", value: 315, isEditable: false },
  { id: "Sender First Name", value: "Siddhant", isEditable: true },
  { id: "Sender Last Name", value: "Goswami", isEditable: true },
  { id: "Sender Job", value: "CTO", isEditable: true },
  { id: "Email", value: "siddhant@100xengineers.com", isEditable: true },
  { id: "Company", value: "100xengineers", isEditable: true },
  { id: "Company ID", value: 126, isEditable: false },
  { id: "Notifications", value: "siddhant@100xengineers.com", isEditable: true },
  { id: "Plan", value: "Starter", isEditable: false },
  { id: "Leads used", value: "876/1000", isEditable: false }
];

export default function Page () {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState(initialAccountInfo);

  const handleInputChange = (id: string, value: string) => {
    setAccountInfo(accountInfo.map(info => info.id === id ? {...info, value} : info));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <div className="rounded-md border border-collapse mb-8">
        <Table className="w-full text-left">
          <TableBody>
            {accountInfo.map((info) => (
              <TableRow key={info.id} className="hover:bg-transparent">
                <TableCell className="font-medium px-4 py-2 border-r bg-muted/50 w-1/3">
                  {info.id}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {isEditing && info.isEditable ? (
                    <Input
                      type="text"
                      value={info.value.toString()}
                      onChange={(e) => handleInputChange(info.id, e.target.value)}
                    />
                  ) : (
                    info.value
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleEditClick}>
          {isEditing ? 'Update' : 'Edit'}
        </Button>
        {isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
        {!isEditing && (
          <Button variant="outline">
            Manage your subscription
          </Button>
        )}
      </div>
    </div>
  );
};