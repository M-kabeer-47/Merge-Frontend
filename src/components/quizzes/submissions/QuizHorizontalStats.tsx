import Icon from "@/components/ui/Icon";

interface QuizHorizontalStatsProps {
  totalAttempts: number;
  totalQuestions: number;
  totalPoints: number;
  averageScore: number;
}

export default function QuizHorizontalStats({
  totalAttempts,
  totalQuestions,
  totalPoints,
  averageScore,
}: QuizHorizontalStatsProps) {
  const stats = [
    {
      icon: "/icons/submissions.png",
      label: "Submissions",
      value: totalAttempts,
    },
    {
      icon: "/icons/question.png",
      label: "Questions",
      value: totalQuestions,
    },
    {
      icon: "/icons/score.png",
      label: "Total Pts",
      value: totalPoints,
    },
    {
      icon: "/icons/average.png",
      label: "Avg Score",
      value: averageScore.toFixed(1),
    },
  ];

  return (
    <div className="bg-background border border-light-border rounded-xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 px-4 py-2.5 bg-secondary/5 rounded-lg border border-light-border/50 h-[80px]"
          >
            <div className="w-8 h-8 flex-shrink-0">
              <Icon src={stat.icon} width={32} height={32} alt={stat.label} />
            </div>
            <div>
              <p className="text-xl font-bold text-heading leading-none">
                {stat.value}
              </p>
              <p className="text-xs text-para-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
