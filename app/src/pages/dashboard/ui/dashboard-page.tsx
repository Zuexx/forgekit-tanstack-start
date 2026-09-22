import { useTranslation } from 'react-i18next'

interface DashboardPageProps {
  user: { name: string }
}

export function DashboardPage({ user }: DashboardPageProps) {
  const { t } = useTranslation('common')

  return <h2>{t('dashboard.welcome', { name: user.name })}</h2>
}
