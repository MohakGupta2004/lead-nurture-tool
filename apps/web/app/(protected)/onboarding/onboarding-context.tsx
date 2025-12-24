'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface OnboardingData {
    // Step 1: Personal Information
    firstName: string
    lastName: string
    businessName: string
    licenseNumber: string
    phoneNumber: string
    address: string
    professionalEmail: string
    yearsInBusiness: number
    calendlyLink?: string
    markets: string[] // Cities
    realtorType: 'Individual' | 'Agency'
    signatureImageUrl: string // URL from Cloudinary
    brandLogoUrl: string // URL from Cloudinary
    brokerageLogoUrl: string // URL from Cloudinary
    brokerageName: string
    subscriptionPlan: 'free' | 'pro' | 'premium' | 'enterprise'
}

interface OnboardingContextType {
    currentStep: number
    totalSteps: number
    data: OnboardingData
    updateData: (data: Partial<OnboardingData>) => void
    nextStep: () => void
    prevStep: () => void
    goToStep: (step: number) => void
}

const defaultData: OnboardingData = {
    firstName: '',
    lastName: '',
    businessName: '',
    licenseNumber: '',
    phoneNumber: '',
    address: '',
    professionalEmail: '',
    yearsInBusiness: 0,
    calendlyLink: '',
    markets: [],
    realtorType: 'Individual',
    signatureImageUrl: '',
    brandLogoUrl: '',
    brokerageLogoUrl: '',
    brokerageName: '',
    subscriptionPlan: 'free',
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 5
    const [data, setData] = useState<OnboardingData>(defaultData)

    const updateData = (newData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...newData }))
    }

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const goToStep = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step)
        }
    }

    return (
        <OnboardingContext.Provider
            value={{
                currentStep,
                totalSteps,
                data,
                updateData,
                nextStep,
                prevStep,
                goToStep,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}

export function useOnboarding() {
    const context = useContext(OnboardingContext)
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider')
    }
    return context
}
