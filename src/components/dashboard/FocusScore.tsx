"use client";

export default function FocusScore() {
  return (
    <div className="bg-background border border-light-border rounded-lg p-4">
      <h3 className="font-raleway font-semibold text-heading mb-3">Focus Score</h3>
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">87%</p>
          <p className="text-xs text-para-muted mt-1">[Graph]</p>
        </div>
      </div>
    </div>
  );
}
