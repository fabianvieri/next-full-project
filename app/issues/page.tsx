import Link from "next/link";
import { Button } from "@radix-ui/themes";

export default function Page() {
  return (
    <div>
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
}
