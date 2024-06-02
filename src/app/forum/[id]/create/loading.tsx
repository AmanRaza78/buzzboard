import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1000px] flex flex-col mx-auto mt-4 items-center">
      <Skeleton className="w-[600px] h-[800px]" />
    </div>
  );
}
