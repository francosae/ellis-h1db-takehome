"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useRouter } from "next/navigation";

import { useState } from "react";

interface SearchResult {
  CASE_NUMBER: string;
  CASE_STATUS: string;
  EMPLOYER_NAME: string;
  EMPLOYER_NAME_NORMALIZED: string;
  JOB_TITLE: string;
  RECEIVED_DATE: string;
  WAGE_RATE_OF_PAY_FROM: number;
  WORKSITE_CITY: string;
  WORKSITE_STATE: string;
  BEGIN_DATE: string;
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchResults = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${query}&page=${pageNum}&size=25`,
      );
      if (!response.ok) {
        throw new Error("err");
      }
      const data = (await response.json()) as SearchResult[];
      setResults(data);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => fetchResults(1);

  const handlePrevious = async () => {
    if (page > 1) {
      await fetchResults(page - 1);
    }
  };

  const handleNext = async () => {
    if (results.length > 0) {
      await fetchResults(page + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-black">
      <h1 className="mb-4 text-lg font-bold text-black">Search Salaries</h1>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-md border border-black px-4 py-2 text-black"
          placeholder="Amazon"
        />
        <Button
          onClick={handleSearch}
          className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          disabled={isLoading}
        >
          Search
        </Button>
      </div>
      {isLoading && <p className="mt-4">Loading...</p>}
      {results.length > 0 && (
        <div>
          <Table className="mt-4 border-collapse border border-black">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-black px-4 py-2 text-black">
                  Employer
                </TableHead>
                <TableHead className="border border-black px-4 py-2 text-black">
                  Job Title
                </TableHead>
                <TableHead className="border border-black px-4 py-2 text-black">
                  Base Salary
                </TableHead>
                <TableHead className="border border-black px-4 py-2 text-black">
                  Location
                </TableHead>
                <TableHead className="border border-black px-4 py-2 text-black">
                  Submit Date
                </TableHead>
                <TableHead className="border border-black px-4 py-2 text-black">
                  Start Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <TableRow
                    key={result.CASE_NUMBER}
                    onClick={() => router.push(`/case/${result.CASE_NUMBER}`)}
                  >
                    <TableCell className="border border-gray-200 px-4 py-2">
                      {result.EMPLOYER_NAME}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2">
                      {result.JOB_TITLE}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2">
                      {result.WAGE_RATE_OF_PAY_FROM}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2">
                      {result.WORKSITE_CITY}, {result.WORKSITE_STATE}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2">
                      {result.RECEIVED_DATE}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2">
                      {result.BEGIN_DATE}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="border border-gray-200 px-4 py-2 text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex w-full flex-row justify-between">
            <Button
              onClick={handlePrevious}
              className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
