export type WhatsappContact = { whatsappNumber: string; whatsappText: string };

export function whatsappHref({ whatsappNumber, whatsappText }: WhatsappContact): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappText)}`;
}

export function mailtoHref(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}
