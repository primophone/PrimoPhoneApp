import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full min-h-screen py-52 justify-center">
      <SignIn
        appearance={{
          elements: {
            footer: "hidden",
          },
        }}
      />
    </div>
  );
}
