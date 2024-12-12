import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full min-h-screen pt-40 justify-center bg-slate-200">
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
