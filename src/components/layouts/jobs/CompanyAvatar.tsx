import { useState } from 'react'
import { Building2 } from 'lucide-react'

function getCompanyLogoUrl(company: string, providedUrl?: string): string {
  const norm = (company || '').toLowerCase().trim()
  if (norm.includes('momo') || norm.includes('m_service')) return '/logos/momo.svg'
  if (norm.includes('vng')) return '/logos/vng.svg'
  if (norm.includes('fpt')) return '/logos/fpt.svg'
  if (norm.includes('viettel')) return '/logos/viettel.svg'
  if (norm.includes('shopee')) return '/logos/shopee.svg'

  // Nếu providedUrl là các link hỏng cũ đã biết, bỏ qua
  if (
    providedUrl &&
    !providedUrl.includes('wikimedia.org') &&
    !providedUrl.includes('vng.com.vn/assets') &&
    !providedUrl.includes('fptsoftware.com/assets')
  ) {
    return providedUrl
  }

  return ''
}

interface CompanyAvatarProps {
  company: string
  logoUrl?: string
  className?: string
  iconSize?: string
}

export default function CompanyAvatar({
  company,
  logoUrl,
  className = 'w-11 h-11',
  iconSize = 'w-5 h-5',
}: CompanyAvatarProps) {
  const [hasError, setHasError] = useState(false)
  const resolvedUrl = getCompanyLogoUrl(company, logoUrl)
  const cleanCompany = (company || '').replace(/\([^)]*\)/g, '').trim() || company
  const initial = cleanCompany.charAt(0).toUpperCase() || 'C'

  return (
    <div
      className={`${className} rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center shrink-0 shadow-xs overflow-hidden select-none`}
    >
      {resolvedUrl && !hasError ? (
        <img
          src={resolvedUrl}
          alt={cleanCompany}
          onError={() => setHasError(true)}
          className='w-full h-full object-contain p-1.5 transition-transform duration-300 hover:scale-105'
          loading='lazy'
        />
      ) : (
        <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20'>
          {cleanCompany.length > 0 ? (
            <span className='font-black text-sm text-indigo-600 dark:text-[#A99DFF]'>{initial}</span>
          ) : (
            <Building2 className={`${iconSize} text-indigo-600 dark:text-[#A99DFF]`} />
          )}
        </div>
      )}
    </div>
  )
}
