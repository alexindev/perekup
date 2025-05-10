import { UserInfoCardProps } from '../types/components/user.types';

export const UserInfoCard = ({ userData }: UserInfoCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-semibold text-dark mb-0">
        Привет, {userData?.fullName || 'Пользователь'}!
      </h1>
    </div>
  );
}; 