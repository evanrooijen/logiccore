"use client";

import { tables } from "@logiccore/spacetimedb";
import Image from "next/image";
import Link from "next/link";
import { useTable } from "spacetimedb/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteWorldForm } from "@/components/world/delete-world-form";

interface Props {
  initialData: { id: bigint }[];
}

const WorldList = ({ initialData }: Props) => {
  const [worlds, isReady] = useTable(tables.world);

  // Use server data until the live subscription is applied
  const displayWorlds = isReady ? worlds : initialData;
  return (
    <ul className="grid grid-cols-4 gap-4 p-4 mx-auto container">
      {displayWorlds.map(({ id }) => (
        <li key={id} className="">
          <Card className="relative pt-0 group min-h-full">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Image
              src="/shadcn1.png"
              width={120}
              height={120}
              loading="eager"
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 group-hover:grayscale-0 group-hover:brightness-100"
            />
            <CardHeader>
              <CardAction>
                <DeleteWorldForm worldId={id} />
              </CardAction>
              <CardTitle>World #{id}</CardTitle>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button
                nativeButton={false}
                className="w-fit"
                render={<Link href={`/worlds/${id}`}>Enter World</Link>}
              ></Button>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
};
export default WorldList;
