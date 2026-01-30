"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

export default function Page() {
  return (
    <>
      {/* <SectionCards /> */}
      {/* <div className="px-4 lg:px-6"> */}
        {/* <ChartAreaInteractive /> */}
      {/* </div> */}
      {/* <DataTable data={data} /> */}
      <div className="flex w-full min-h-screen  justify-center items-center">
            <h2 className="text-2xl font-semibold">Wellcome to Cribbit Dashboard</h2>
      </div>
    </>
  )
}
