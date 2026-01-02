'use client'

import { useState } from 'react'
import { useOnboarding } from '../onboarding-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Loader2 } from 'lucide-react'

export default function Step4BrandingExtended() {
    const { data, updateData, nextStep, prevStep } = useOnboarding()
    const [isBrandLogoUploading, setIsBrandLogoUploading] = useState(false)
    const [isSignatureUploading, setIsSignatureUploading] = useState(false)
    const [isBrokerageLogoUploading, setIsBrokerageLogoUploading] = useState(false)

    const handleNext = () => {
        if (!data.brokerageName) {
            alert('Please enter brokerage name')
            return
        }
        nextStep()
    }

    const handleUpload = async (file: File, func: (value: boolean) => void) => {
        func(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const result = await response.json()
            return result.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please check your Cloudinary configuration.')
        } finally {
            func(false)
        }
    }

    const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const secureUrl = await handleUpload(file, setIsBrandLogoUploading)
            updateData({ brandLogoUrl: secureUrl })
        }
    }

    const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const secureUrl = await handleUpload(file, setIsSignatureUploading)
            updateData({ signatureImageUrl: secureUrl })
        }
    }

    const handleBrokerageLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const secureUrl = await handleUpload(file, setIsBrokerageLogoUploading)
            updateData({ brokerageLogoUrl: secureUrl })
        }
    }


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">Branding Details</h2>
                <p className="text-muted-foreground">Complete your brand profile.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-foreground">Realtor Type</Label>
                    <div className="p-3 bg-muted border border-border rounded-md text-foreground capitalize">
                        {data.realtorType === 'Individual' ? 'Individual' : 'Agency'}
                    </div>
                </div>

                {/* Grouping upload sections into a grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Brand Logo */}
                    <div className="space-y-2">
                        <Label className="text-foreground">Upload Brand Logo</Label>
                        <Card className="border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative overflow-hidden group">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
                                onChange={handleBrandLogoUpload}
                                disabled={isBrandLogoUploading}
                            />
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground group-hover:text-primary transition-colors">
                                {isBrandLogoUploading ? (
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
                                        <p className="text-sm text-primary">Uploading...</p>
                                    </div>
                                ) : data.brandLogoUrl ? (
                                    <div className="text-center relative z-20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={data.brandLogoUrl}
                                            alt="Brand Logo"
                                            className="h-16 w-auto object-contain mx-auto mb-2 rounded-md"
                                        />
                                        <p className="text-xs">Click to change</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center p-2 text-center'>
                                        <Upload className="w-8 h-8 mb-2" />
                                        <p className="text-sm">Click to upload or drag and drop</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Signature */}
                    <div className="space-y-2">
                        <Label className="text-foreground">Upload Signature</Label>
                        <Card className="border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative overflow-hidden group">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
                                onChange={handleSignatureUpload}
                                disabled={isSignatureUploading}
                            />
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground group-hover:text-primary transition-colors">
                                {isSignatureUploading ? (
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
                                        <p className="text-sm text-primary">Uploading...</p>
                                    </div>
                                ) : data.signatureImageUrl ? (
                                    <div className="text-center relative z-20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={data.signatureImageUrl}
                                            alt="Brand Logo"
                                            className="h-16 w-auto object-contain mx-auto mb-2 rounded-md"
                                        />
                                        <p className="text-xs">Click to change</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center p-2 text-center'>
                                        <Upload className="w-8 h-8 mb-2" />
                                        <p className="text-sm">Click to upload or drag and drop</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Brokerage Logo */}
                    <div className="space-y-2">
                        <Label className="text-foreground">Upload brokerage logo</Label>
                        <Card className="border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative overflow-hidden group">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
                                onChange={handleBrokerageLogoUpload}
                                disabled={isBrokerageLogoUploading}
                            />
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground group-hover:text-primary transition-colors">
                                {isBrokerageLogoUploading ? (
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
                                        <p className="text-sm text-primary">Uploading...</p>
                                    </div>
                                ) : data.brokerageLogoUrl ? (
                                    <div className="text-center relative z-20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={data.brokerageLogoUrl}
                                            alt="Brand Logo"
                                            className="h-16 w-auto object-contain mx-auto mb-2 rounded-md"
                                        />
                                        <p className="text-xs">Click to change</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center p-2 text-center'>
                                        <Upload className="w-8 h-8 mb-2" />
                                        <p className="text-sm">Click to upload or drag and drop</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="brokerage" className="text-foreground">Brokerage Name</Label>
                    <Input
                        id="brokerage"
                        placeholder="e.g. Keller Williams"
                        value={data.brokerageName}
                        onChange={(e) => updateData({ brokerageName: e.target.value })}
                        className="bg-background border-input text-foreground focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={isBrandLogoUploading || isSignatureUploading || isBrokerageLogoUploading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
