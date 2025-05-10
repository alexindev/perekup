import { pluralizeDays } from "../utils/helpers";
import { SubscriptionCardProps } from "../types/components/subscription.types";

export const SubscriptionCard = ({
  userData,
  onExtend,
}: SubscriptionCardProps) => {
  return (
    <div className="bg-[#E85B01] rounded-xl shadow-lg p-6 text-white flex flex-col items-center space-y-5">
      <h2 className="text-xl font-medium opacity-90">Ваша подписка</h2>
      <div className="text-center">
        <p className="text-6xl font-bold text-white">{userData.daysLeft}</p>
        <p className="text-lg opacity-80 text-white">
          {pluralizeDays(userData.daysLeft)}
        </p>
        <p className="text-sm opacity-70 mt-1 text-white">до окончания</p>
      </div>
      <button
        onClick={onExtend}
        className="w-full max-w-xs bg-white/90 hover:bg-white text-[#E85B01] font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        Продлить подписку
      </button>
    </div>
  );
};
