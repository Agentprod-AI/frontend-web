/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";

import { useState, useEffect } from "react";
import { ChevronDown, Trash } from "lucide-react";
import { Contact, useLeads } from "@/context/lead-user";
import { useCampaignContext } from "@/context/campaign-provider";
import axiosInstance from "@/utils/axiosInstance"; // Ensure you have this utility setup for making API requests
import { toast } from "sonner"; // For error notifications
import { LoadingCircle } from "@/app/icons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  simple?: boolean;
  deleteAction?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  simple,
  deleteAction,
}: DataTableProps<TData, TValue>) {
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [campaign, setCampaign] = useState<{
    campaignName: string;
    campaignId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { campaigns } = useCampaignContext();
  const { existingLeads, setExistingLeads } = useLeads();
  const allCampaigns = campaigns.map((campaign) => ({
    campaignName: campaign.campaign_name,
    campaignId: campaign.id,
    additionalInfo: campaign.additional_details,
  }));

  useEffect(() => {
    if (!campaign) {
      setFilteredData(data);
      setLoading(false);
    } else {
      fetchLeadsForCampaign(campaign.campaignId);
    }
  }, [campaign, data]);

  useEffect(() => {
    let newFilteredData = data;

    if (searchTerm) {
      newFilteredData = newFilteredData.filter((item) =>
        (item as any)[searchKey]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(newFilteredData);
  }, [searchTerm, searchKey, data]);

  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const leads: Contact[] = selectedRows.map((row) => row.original as Contact);
    setExistingLeads(leads as Contact[]);
    console.log("selected leads:", leads);
  }, [table.getFilteredSelectedRowModel().rows]);

  const fetchLeadsForCampaign = (campaignId: string) => {
    setLoading(true);
    axiosInstance
      .get(`v2/lead/campaign/${campaignId}`)
      .then((response) => {
        setFilteredData(response.data);
        console.log("my data " + response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leads for campaign:", error);
        setLoading(false);
        toast.error(`Error fetching leads for campaign: ${error}`);
        setFilteredData([]);
      });
  };

  if (loading)
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingCircle />
        <span>Loading Leads</span>
      </div>
    );

  return (
    <>
      <div className="flex space-x-5 items-center">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
                  {deleteAction && (
                    <TableCell>
                      <Button variant={"ghost"} className={`p-3  rounded-xl`}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        {!simple && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
