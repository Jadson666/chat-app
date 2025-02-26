import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'
import { UserProfile } from './UserProfile'

export default function ProfilePage() {
  return <div className='p-8'>
    <Link className={buttonVariants({ variant: "outline" })} href="/chats">My chats</Link>
    <UserProfile />
  </div>
}
