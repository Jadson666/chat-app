'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MailList({ items }: { items: any[] }) {
  const router = useRouter();

  return (
    <ScrollArea className='h-screen'>
      <div className='flex flex-col gap-2 p-4 pt-0'>
        {items.map((item) => (
          <button
            key={item.roomId}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent'
            )}
            onClick={() => router.push(`/chat?roomId=${item.roomId}`)}
          >
            <div className='flex w-full flex-col gap-1'>
              <div className='flex items-center'>
                <div className='flex items-center gap-2'>
                  <div className='font-semibold'>{item.name}</div>
                  {!item.read && <span className='flex h-2 w-2 rounded-full bg-blue-600' />}
                </div>
              </div>
              {/* <div className='text-xs font-medium'>{item.subject}</div> */}
            </div>
            <div className='line-clamp-2 text-xs text-muted-foreground'>{item.text.substring(0, 300)}</div>
            {/* {item.labels.length ? (
              <div className='flex items-center gap-2'>
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

export default function Chats() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const user = JSON.parse(localStorage.getItem('curUser') ?? '{}');
      const res = await fetch('/chats/list?' + new URLSearchParams({ userId: user.id }).toString());
      const json = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setChats(json.chats.map((chat: any) => ({ roomId: chat.roomId, name: chat.roomName, text: chat.lastChat })));
    };

    getChats();
  }, []);
  return (
    <div>
      <MailList items={chats} />
    </div>
  );
}
