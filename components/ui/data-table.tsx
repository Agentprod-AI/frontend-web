/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "./button";
import { ChevronDown } from "lucide-react";
import { useCampaignContext } from "@/context/campaign-provider";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  simple?: boolean;
  onDelete?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  simple,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [campaign, setCampaign] = useState<{
    campaignName: string;
    campaignId: string;
  } | null>(null);
  const { campaigns } = useCampaignContext();

  console.log("Dropdown", campaigns);

  const table = useReactTable({
    data: data || [], // Provide an empty array if data is undefined
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    if (table.getPageCount() > 0) {
      table.setPageSize(10);
    }
  }, [table]);

  const rows = table.getRowModel()?.rows ?? [];

  const allCampaigns = campaigns.map((campaign) => ({
    campaignName: campaign.campaign_name,
    campaignId: campaign.id,
    additionalInfo: campaign.additional_details,
  }));

  return (
    <>
      <div className="flex space-x-5 items-center">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full md:max-w-sm my-3"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <span>
                {campaign ? campaign.campaignName : "Select Campaign"}
              </span>
              <ChevronDown size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px] w-full rounded-md border p-2">
                <DropdownMenuItem onClick={() => setCampaign(null)}>
                  <p className="cursor-pointer">All Campaigns</p>
                </DropdownMenuItem>
                {allCampaigns?.map((campaignItem) => (
                  <DropdownMenuItem
                    key={campaignItem.campaignId}
                    onClick={() =>
                      setCampaign({
                        campaignName: campaignItem.campaignName,
                        campaignId: campaignItem.campaignId,
                      })
                    }
                  >
                    <p className="cursor-pointer">
                      {campaignItem.campaignName}{" "}
                      {campaignItem.additionalInfo &&
                        `- ${campaignItem.additionalInfo}`}
                    </p>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="rounded-md border h-[50vh]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {!simple && rows.length > 0 && (
        <div className="flex-1 text-sm text-muted-foreground pt-4">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}
    </>
  );
}
