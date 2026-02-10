import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// FDI numbering: upper right 11-18, upper left 21-28, lower left 31-38, lower right 41-48
const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

type ToothStatus = "healthy" | "cavity" | "filling" | "crown" | "extraction" | "planned";

const toothStatusColors: Record<ToothStatus, string> = {
  healthy: "bg-emerald-200 hover:bg-emerald-300 text-emerald-900",
  cavity: "bg-red-200 hover:bg-red-300 text-red-900",
  filling: "bg-blue-200 hover:bg-blue-300 text-blue-900",
  crown: "bg-amber-200 hover:bg-amber-300 text-amber-900",
  extraction: "bg-gray-300 hover:bg-gray-400 text-gray-700 line-through",
  planned: "bg-purple-200 hover:bg-purple-300 text-purple-900",
};

// Mock tooth data for a selected patient
const mockToothData: Record<number, { status: ToothStatus; notes: string }> = {
  14: { status: "filling", notes: "Composite filling placed on 2026-01-15" },
  16: { status: "crown", notes: "PFM crown placed on 2025-12-10" },
  26: { status: "cavity", notes: "Mesial cavity detected - treatment planned" },
  36: { status: "extraction", notes: "Extracted on 2025-11-20 - impacted wisdom tooth" },
  45: { status: "planned", notes: "Root canal planned for Feb 2026" },
  47: { status: "filling", notes: "Amalgam filling - old, monitor for replacement" },
};

export default function DentalChartsPage() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const selectedData = selectedTooth ? mockToothData[selectedTooth] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dental Charts</h1>
        <p className="text-sm text-muted-foreground">Visual tooth chart with FDI numbering</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">Patient: Chinedu Obi</CardTitle>
              <CardDescription>ID: PAT-003 · Last updated: Feb 10, 2026</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(toothStatusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1">
                  <span className={`h-3 w-3 rounded-sm ${color.split(" ")[0]}`} />
                  <span className="text-[10px] text-muted-foreground capitalize">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Upper Teeth */}
          <div className="mb-2">
            <p className="text-[10px] text-muted-foreground text-center mb-1">Upper</p>
            <div className="flex justify-center gap-1">
              {upperTeeth.map((tooth) => {
                const data = mockToothData[tooth];
                const status: ToothStatus = data?.status || "healthy";
                return (
                  <button
                    key={tooth}
                    onClick={() => setSelectedTooth(tooth)}
                    className={`w-9 h-10 rounded-t-lg border text-xs font-mono flex flex-col items-center justify-center transition-all ${toothStatusColors[status]} ${selectedTooth === tooth ? "ring-2 ring-secondary scale-110" : ""}`}
                  >
                    <span className="text-[10px] leading-none">{tooth}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lower Teeth */}
          <div>
            <div className="flex justify-center gap-1">
              {lowerTeeth.map((tooth) => {
                const data = mockToothData[tooth];
                const status: ToothStatus = data?.status || "healthy";
                return (
                  <button
                    key={tooth}
                    onClick={() => setSelectedTooth(tooth)}
                    className={`w-9 h-10 rounded-b-lg border text-xs font-mono flex flex-col items-center justify-center transition-all ${toothStatusColors[status]} ${selectedTooth === tooth ? "ring-2 ring-secondary scale-110" : ""}`}
                  >
                    <span className="text-[10px] leading-none">{tooth}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1">Lower</p>
          </div>

          {/* Selected tooth info */}
          {selectedTooth && (
            <div className="mt-6 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm">Tooth #{selectedTooth}</h3>
                <Badge className={`text-[10px] ${toothStatusColors[selectedData?.status || "healthy"].split(" ").slice(0, 2).join(" ")}`}>
                  {selectedData?.status || "healthy"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedData?.notes || "No procedures recorded. Tooth is healthy."}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs">Add Procedure</Button>
                <Button size="sm" variant="outline" className="text-xs">Add Notes</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
