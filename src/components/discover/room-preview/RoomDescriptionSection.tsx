import { useState } from "react";
import { FileText } from "lucide-react";

interface RoomDescriptionSectionProps {
  description: string;
}

export default function RoomDescriptionSection({
  description,
}: RoomDescriptionSectionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isLongDescription = description.length > 150;

  return (
    <section>
      <h3 className="text-sm font-semibold text-heading mb-2 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Description
      </h3>
      <p className="text-sm text-para">
        {showFullDescription || !isLongDescription
          ? description
          : `${description.slice(0, 150)}...`}
      </p>
      {isLongDescription && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-sm text-primary hover:text-primary/80 font-medium mt-2"
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </button>
      )}
    </section>
  );
}
