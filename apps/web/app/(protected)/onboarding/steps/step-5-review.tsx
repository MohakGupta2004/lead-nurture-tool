'use client'

import { useOnboarding } from '../onboarding-context'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { api } from '@/lib/api'
import { useState } from 'react'
export default function Step5Review() {
    const { data, prevStep, goToStep } = useOnboarding()
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()
    const router = useRouter()

    const handleFinish = async () => {
        console.log('Onboarding Data:', JSON.stringify(data, null, 2))
        //  TODO: In a real app, you would send this to your backend here
        const token = await getToken()
        setLoading(true)
        const response = await api.post('/api/users/onboarding', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        setLoading(false)
        router.push('/dashboard')
    }

    const ReviewItem = ({ label, value, step, isImage = false }: { label: string, value: string | number | undefined, step: number, isImage?: boolean }) => (
        <div className="group relative">
            <div className="space-y-1">
                <Label className="text-zinc-500 text-xs uppercase tracking-wider">{label}</Label>
                {isImage && typeof value === 'string' && value ? (
                    <div className="mt-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Brand Logo" className="h-10 w-auto object-contain rounded-sm" />
                    </div>
                ) : (
                    <p className="text-white font-medium">{value || '-'}</p>
                )}
            </div>
            <Button
                variant="link"
                className="absolute top-0 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity h-auto p-0 text-xs"
                onClick={() => goToStep(step)}
            >
                Edit
            </Button>
            <div className="h-px bg-zinc-800 mt-3" />
        </div>
    )

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Review & Confirm</h2>
                <p className="text-zinc-400">Please verify your information.</p>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <ReviewItem label="First Name" value={data.firstName} step={1} />
                <ReviewItem label="Last Name" value={data.lastName} step={1} />
                <ReviewItem label="Phone" value={data.phoneNumber} step={1} />
                <ReviewItem label="Email" value={data.professionalEmail} step={1} />
                <ReviewItem label="Years in Business" value={`${data.yearsInBusiness} years`} step={1} />

                <ReviewItem label="Company Name" value={data.businessName} step={2} />
                <ReviewItem label="Markets" value={data.markets.join(', ')} step={2} />

                <ReviewItem label="Realtor Type" value={data.realtorType === 'Individual' ? 'Individual' : 'Agency'} step={3} />
                <ReviewItem label="Brokerage Name" value={data.brokerageName} step={4} />
                <ReviewItem label="Brand Logo" value={data.brokerageLogoUrl} step={4} isImage />
                <ReviewItem label="Brand Logo" value={data.brandLogoUrl} step={4} isImage />
                <ReviewItem label="Signature Image" value={data.signatureImageUrl} step={4} isImage />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 items-start">
                <AlertTriangle className="text-yellow-500 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200/80">
                    Please make sure all information is correct before proceeding. You can update some details later in your profile settings.
                </p>
            </div>

            <div className="pt-4 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    disabled={loading}
                >
                    Back
                </Button>
                <Button
                    onClick={handleFinish}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finishing...
                        </>
                    ) : (
                        'Finish'
                    )}
                </Button>
            </div>
        </div>
    )
}
