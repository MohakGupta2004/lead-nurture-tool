'use client'

import { useEffect, useState } from 'react'
import { OnboardingProvider, useOnboarding } from './onboarding-context'
import Step1Personal from './steps/step-1-personal'
import Step2Company from './steps/step-2-company'
import Step3Branding from './steps/step-3-branding'
import Step4BrandingExtended from './steps/step-4-branding-extended'
import Step5Review from './steps/step-5-review'
import { api } from '@/lib/api'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

function OnboardingContent() {
    const { currentStep, totalSteps } = useOnboarding()
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Personal />
            case 2: return <Step2Company />
            case 3: return <Step3Branding />
            case 4: return <Step4BrandingExtended />
            case 5: return <Step5Review />
            default: return <Step1Personal />
        }
    }
    useEffect(() => {
        const main = async () => {
            setLoading(true)
            const token = await getToken()
            const response = await api.get('/api/users/onboard-status', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response.data)
            if (response.data.isOnboarded) {
                router.push('/dashboard')
            }
            setLoading(false)
        }
        main()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {loading ? <div className="w-full max-w-xl">
                {/* Progress Header */}
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground text-lg">Loading...</p>
                </div>

            </div> : <div className="w-full max-w-xl">
                <div className="mb-8">
                    <p className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider">Step {currentStep} of {totalSteps}</p>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Card Container */}
                <div className="bg-card rounded-xl border-none p-6 md:p-8 shadow-sm ring-1 ring-black/5">
                    {renderStep()}
                </div>
            </div>}
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <OnboardingProvider>
            <OnboardingContent />
        </OnboardingProvider>
    )
}