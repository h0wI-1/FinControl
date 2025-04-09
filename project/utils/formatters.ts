import { CURRENCIES, Currency } from '@/store/settings-store';

export const formatCurrency = (amount: number, currencyCode: Currency = 'USD'): string => {
  const currencyInfo = CURRENCIES[currencyCode];
  
  if (currencyCode === 'RUB') {
    // Russian style formatting
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateWithTime = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const getRelativeTimeString = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return locale === 'ru' ? 'только что' : 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    if (locale === 'ru') {
      const minutes = diffInMinutes;
      let minutesText = 'минут';
      if (minutes % 10 === 1 && minutes % 100 !== 11) {
        minutesText = 'минуту';
      } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
        minutesText = 'минуты';
      }
      return `${minutes} ${minutesText} назад`;
    }
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    if (locale === 'ru') {
      const hours = diffInHours;
      let hoursText = 'часов';
      if (hours % 10 === 1 && hours % 100 !== 11) {
        hoursText = 'час';
      } else if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) {
        hoursText = 'часа';
      }
      return `${hours} ${hoursText} назад`;
    }
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    if (locale === 'ru') {
      const days = diffInDays;
      let daysText = 'дней';
      if (days % 10 === 1 && days % 100 !== 11) {
        daysText = 'день';
      } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
        daysText = 'дня';
      }
      return `${days} ${daysText} назад`;
    }
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateString, locale);
};