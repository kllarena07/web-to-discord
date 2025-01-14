import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import spinningCat from "../../public/spinning-cat.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex flex-col w-dvh h-dvh items-center justify-center gap-2">
      <Image src={spinningCat} alt="Spinning cat" />
      <Button>
        <LoginLink>Enter Manny Control Panel</LoginLink>
      </Button>
    </section>
  );
}
