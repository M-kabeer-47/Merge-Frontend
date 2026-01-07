interface InstructionsSectionProps {
  description: string;
}

export default function InstructionsSection({
  description,
}: InstructionsSectionProps) {
  return (
    <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-heading mb-3">Instructions</h2>
      <div className="text-para text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
        {description}
      </div>
    </section>
  );
}
