
interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: string;
}

export function AnalyticsCard({ title, value, icon }: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}