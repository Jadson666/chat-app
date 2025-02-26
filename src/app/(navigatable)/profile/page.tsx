import { UserProfile } from './UserProfile';

export const Title = ({ text }: { text: string }) => {
  return <h1 className='text-2xl'>{text}</h1>;
};

export default function ProfilePage() {
  return (
    <div className='p-8'>
      <Title text='Profile'></Title>
      <UserProfile />
    </div>
  );
}
