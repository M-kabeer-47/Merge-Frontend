interface CharacterCountProps {
  current: number;
  max: number;
}

export function CharacterCount({ current, max }: CharacterCountProps) {
  return (
    <span className="text-xs text-para-muted">
      {current}/{max}
    </span>
  );
}
