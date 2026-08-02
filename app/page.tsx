"use client";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const RoleCard = ({
  role,
  description,
  image,
}: {
  role: string;
  description: string;
  image: string;
}) => {
  return (
    <Link
      href={`/${role.toLowerCase()}`}
      className="flex flex-col shrink-0 items-center justify-center p-4 rounded-lg shadow-md cursor-pointer w-full md:w-1/2 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
    >
      <Image
        src={image}
        alt={role}
        width={64}
        height={64}
        className="mb-4"
        loading="eager"
      />
      <h2 className="text-xl sm:text-2xl font-bold">{role}</h2>
      <p className="text-gray-600 text-xs text-center sm:text-base">
        {description}
      </p>
    </Link>
  );
};

function RoleTitle({ title }: { title: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayText(title.slice(0, index + 1));
      index++;

      if (index === title.length) {
        clearInterval(interval);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [title]);

  return (
    <h1 className="font-mono text-4xl font-bold text-primary">
      {displayText}
      <span className="ml-1 animate-pulse">_</span>
    </h1>
  );
}

const Role = [
  {
    ROLE: "Patient",
    DESCRIPTION: "Input your information.",
    IMAGE: "/patient.png",
  },
  {
    ROLE: "Staff",
    DESCRIPTION: "Monitor and manage patient data.",
    IMAGE: "/staff.png",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="flex flex-col p-8 gap-10 w-full md:max-w-3xl">
        <div className="gap-2 text-center">
          <RoleTitle title="Please select your role" />
          <p className="text-base">
            <span className="text-primary font-bold">Care</span>
            <span className="text-blue-500 font-bold">Terminal</span> is a <span className="text-blue-600">real-time{" "}</span>
            patient information monitoring system that enables staff to securely
            observe and manage patient form sessions as information is entered.
            Built with a <span className="text-yellow-600">responsive</span> interface and real-time communication, it
            keeps staff updated on patient <span className="text-green-600">activity</span>, form changes, and
            submission status.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {Role.map((role) => (
            <RoleCard
              key={role.ROLE}
              role={role.ROLE}
              description={role.DESCRIPTION}
              image={role.IMAGE}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
