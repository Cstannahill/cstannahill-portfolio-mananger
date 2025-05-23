import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const CardImageSkeleton: React.FC = () => (
  <Skeleton className="w-full sm:w-72 md:w-64 lg:w-80 aspect-video rounded-xl" />
);

export const AvatarSkeleton: React.FC = () => (
  <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full" />
);

export const HeroImageSkeleton: React.FC = () => (
  <Skeleton className="w-full h-48 sm:h-64 md:h-80 lg:h-[32rem] rounded-b-2xl" />
);
