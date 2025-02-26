'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  habit: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  country: z.string().min(1, {
    message: 'Username must be at least 1 characters.'
  }),
  dateOfBirth: z.string().nonempty()
});

export const UserProfile = () => {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habit: '',
      country: '',
      dateOfBirth: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = JSON.parse(localStorage.getItem('curUser') ?? '{}');
    const res = await fetch('/profile/data', { method: 'PUT', body: JSON.stringify({ ...values, userId: user.id }) });
    const json = await res.json();

    if (json.success) {
      // notification or something
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem('curUser') ?? '{}');
      startTransition(async () => {
        const res = await fetch('/profile/data?' + new URLSearchParams({ userId: user.id }).toString());
        const json = await res.json();
        form.setValue('habit', json.user.habit);
        form.setValue('country', json.user.country);
        form.setValue('dateOfBirth', json.user.date_of_birth);
      })
    };

    fetchProfile();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-8'>
        <FormField
          control={form.control}
          name='habit'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit</FormLabel>
              <FormControl>
                <Input disabled={isPending} type='text' placeholder='Habit' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input disabled={isPending} type='text' placeholder='COuntry' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dateOfBirth'
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>DateOfBirth</FormLabel>
              <FormControl>
                <Input type='text' placeholder='DateOfBirth' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Update</Button>
      </form>
    </Form>
  );
};
