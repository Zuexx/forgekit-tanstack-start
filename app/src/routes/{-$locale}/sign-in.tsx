import { createFileRoute } from '@tanstack/react-router'

import { SignInPage } from '#/pages/sign-in'

export const Route = createFileRoute('/{-$locale}/sign-in')({ component: SignInPage })
