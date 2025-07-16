import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// clsx là thư viện giúp kết nối các class lại với nhau, cho phép
// truyền nhiều định dạng giúp thuận tiện hơn trong việc viết các class

// tailwind-merge là thư viện giúp giải quyết xung đột các class trong tailwind
// khi có 2 class giống nhau trở lên, tailwind chỉ lấy class override cuối cúng
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
