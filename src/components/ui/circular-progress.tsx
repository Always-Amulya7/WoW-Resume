"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
  value: number;
  strokeWidth?: number;
}
export const CircularProgress = ({
  value = 0,
  strokeWidth = 10,
  className,
  ...props
}: CircularProgressProps) => {
  const radius = 45 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = React.useState(circumference);
  React.useEffect(() => {
    const progressOffset = ((100 - value) / 100) * circumference;
    setOffset(progressOffset);
  }, [value, circumference, setOffset]);
  const colorClass =
    value > 80
      ? "text-green-500"
      : value > 50
      ? "text-yellow-500"
      : "text-red-500";
  return (
    <div className="relative w-40 h-40">
      <svg
        width="160"
        height="160"
        viewBox="0 0 100 100"
        className={cn("transform -rotate-90 absolute top-0 left-0", className)}
        {...props}
      >
        <circle
          className="text-muted/20"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={cn("transition-all duration-1000 ease-in-out", colorClass)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{`${Math.round(
          value
        )}`}</span>
        <span className="text-lg text-muted-foreground">%</span>
      </div>
    </div>
  );
};
