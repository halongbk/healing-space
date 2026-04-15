"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: 'Trông như Email hoặc mật khẩu không chính xác.' };
  }

  revalidatePath('/rooms');
  redirect('/rooms');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Lỗi Đăng ký Supabase:", error);
    if (error.message.includes('already registered')) {
        return { error: 'Email này đã tồn tại trong Healing Space rồi.' };
    }
    return { error: `Đăng ký thất bại: ${error.message}` };
  }

  // Chú ý: Nếu user không set "Disable Confirm Email" trên Supabase
  // Lúc này đăng ký sẽ thành công nhưng cần check email. Để đơn giản bước này giả sử đã disable config.
  revalidatePath('/rooms');
  redirect('/rooms');
}
