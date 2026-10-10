import i18n from '../i18n'

// Locale dùng cho Intl / toLocaleDateString theo ngôn ngữ đang chọn
export const getLocale = () => (i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US')
