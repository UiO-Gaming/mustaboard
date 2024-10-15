import React from "react";
import vipps from "../../public/images/vipps.png";
import Image from 'next/image';
import SanityPeople from "../people";

const InfoCard: React.FC = () => {
  interface Person {
    name: string;
    telephone: string;
  }

  interface Event {
    name: string;
    date: string;
    time: string;
    timeDiffMs?: number;
  }

  const data: Person[] = SanityPeople();
  const person = data.find((person: Person) => person.telephone) || { name: "", telephone: "" };

  return (
    <div className="flex flex-col bg-primary rounded-lg p-3">
      <div className="flex flex-row gap-3 place-content-between items-center">
        <div className="w-1/4">
          <Image src={vipps} alt="Vipps"/>
        </div>
        <div className="flex flex-1 flex-col items-end">
          <p className="parabold">{person.name}</p>
          <p className="para">{person.telephone}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
