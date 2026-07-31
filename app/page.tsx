"use client";
import Link from "next/dist/client/link";
import Image from "next/image";

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
      className="flex flex-col items-center justify-center p-4 rounded-lg shadow-md cursor-pointer w-1/2 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
    >
      <Image src={image} alt={role} width={64} height={64} className="mb-4" loading="eager" />
      <h2 className="text-2xl font-bold">{role}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

const Role = [
  {
    ROLE: "Patient",
    DESCRIPTION: "Input your health information.",
    IMAGE: "/patient.png",
  },
  {
    ROLE: "Staff",
    DESCRIPTION: "Monitering and manage patient data.",
    IMAGE: "/staff.png",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <div className="flex flex-col p-8 gap-10 w-full md:max-w-3xl">
        <div className="gap-2 text-center">
          <h1 className="text-4xl font-bold text-primary">
            Please select your role
          </h1>
          <p className="text-base">
            This is a data collection app for patients and staff. The app allows
            patients to input their health information and staff to monitor and
            manage patient data.
          </p>
        </div>
        <div className="flex justify-between gap-10">
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
