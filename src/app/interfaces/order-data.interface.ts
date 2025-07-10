// اذهب إلى ملف الواجهات الخاص بالطلبات (مثلاً order-data.interface.ts)
// واستبدل محتواه بالكامل بهذا الكود

import { Book } from './book-details'; // تأكد من استيراد واجهة Book

/**
 * يمثل عنصراً واحداً داخل الطلب.
 * الـ Backend يرسل تفاصيل الكتاب ككائن متداخل.
 */
export interface OrderItem {
  book: Book; // ✅ تصحيح: العنصر يحتوي على كائن 'book'
  quantity: number;
  rating?: number; // التقييم يكون على العنصر داخل الطلب
  _id: string; // كل عنصر له ID خاص به
}

/**
 * يمثل كائن الطلب الكامل كما يأتي من الـ Backend.
 */
export interface Order {

  _id: string;
  user: string; // معرّف المستخدم

  books: OrderItem[]; // ✅ تصحيح: اسم الخاصية هو 'books'

  total: number; // ✅ تصحيح: اسم الخاصية هو 'total'

  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;

  // ✅ تصحيح: Mongoose يضيف هذه الحقول تلقائياً
  createdAt: string;
  updatedAt: string;
}
