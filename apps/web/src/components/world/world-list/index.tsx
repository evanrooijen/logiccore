import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteWorldAction } from "@/lib/world";

interface Props {
  data: { id: number }[];
}

const WorldList = (props: Props) => (
  <ul className="grid grid-cols-4 gap-4 p-4 mx-auto container">
    {props.data.map(({ id }) => (
      <li key={id} className="">
        <Card className="relative pt-0 group min-h-full">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 group-hover:grayscale-0 group-hover:brightness-100"
          />
          <CardHeader>
            <CardAction>
              <form action={deleteWorldAction}>
                <input type="hidden" name="worldId" value={id} />
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
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
export default WorldList;
