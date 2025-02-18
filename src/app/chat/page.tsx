'use client';

import { FormEventHandler, SetStateAction, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { socket } from '@/socket';

interface IChat {
  id: number;
  room_id: number;
  sender_id: number;
  display_name: string;
  text: string;
  create_at: string;
}

export default function CardsChat() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId') ?? '';
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const inputLength = input.trim().length;

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (_transport: { name: SetStateAction<string> }) => {
        setTransport(_transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    if (socket.connected) {
      onConnect();
    }

    const onReceiveMsg = ({
      roomId: _roomId,
      senderId,
      content
    }: {
      roomId: number;
      senderId: number;
      content: string;
    }) => {
      const user = JSON.parse(localStorage.getItem('curUser') ?? '{}');
      if (roomId !== String(_roomId) || user.id === senderId) {
        return;
      }
      setMessages((msg) => [
        ...msg,
        {
          role: 'partner',
          content
        }
      ]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessageToAllClient', onReceiveMsg);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessageToAllClient', onReceiveMsg);
    };
  }, [roomId]);

  useEffect(() => {
    const getChats = async () => {
      const user = JSON.parse(localStorage.getItem('curUser') ?? '{}');
      const res = await fetch('/chat/current?' + new URLSearchParams({ roomId }).toString());
      const json: { chats: IChat[] } = await res.json();
      setMessages(
        json.chats.map((chat) => ({ role: chat.sender_id === user.id ? 'user' : 'partner', content: chat.text }))
      );
    };

    getChats();
  }, [roomId]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (inputLength === 0) return;
    setMessages([
      ...messages,
      {
        role: 'user',
        content: input
      }
    ]);
    setInput('');
    const user = JSON.parse(localStorage.getItem('curUser') ?? '{}');
    socket.emit('newMessage', { roomId, senderId: user.id, content: input });
  };
  return (
    <div className='p-4'>
      <div>
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        <p>Transport: {transport}</p>
      </div>
      <Card>
        <CardHeader className='flex flex-row items-center'>
          <div className='flex items-center space-x-4'>
            <Avatar>
              <AvatarImage src='/avatars/01.png' alt='Image' />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm font-medium leading-none'>Sofia Davis</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                  message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className='flex w-full items-center space-x-2'>
            <Input
              id='message'
              placeholder='Type your message...'
              className='flex-1'
              autoComplete='off'
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type='submit' size='icon' disabled={inputLength === 0}>
              <Send />
              <span className='sr-only'>Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
