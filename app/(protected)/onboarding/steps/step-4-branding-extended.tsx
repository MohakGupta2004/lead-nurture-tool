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
    const [isUploading, setIsUploading] = useState(false)

    const handleNext = () => {
        if (!data.brokerageName) {
            alert('Please enter brokerage name')
            return
        }
        nextStep()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setIsUploading(true)

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
                if (result.secure_url) {
                    updateData({ brandLogo: result.secure_url })
                }
            } catch (error) {
                console.error('Error uploading image:', error)
                alert('Failed to upload image. Please check your Cloudinary configuration.')
            } finally {
                setIsUploading(false)
            }
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Branding Details</h2>
                <p className="text-zinc-400">Complete your brand profile.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-zinc-300">Realtor Type</Label>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-md text-white capitalize">
                        {data.realtorType === 'solo' ? 'Solo Agent' : 'Team Brand'}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-300">Upload Brand Logo</Label>
                    <Card className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer relative overflow-hidden group">
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <div className="flex flex-col items-center justify-center py-8 text-zinc-400 group-hover:text-yellow-500 transition-colors">
                            {isUploading ? (
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-yellow-500" />
                                    <p className="text-sm text-yellow-500">Uploading...</p>
                                </div>
                            ) : data.brandLogo ? (
                                <div className="text-center relative z-20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={data.brandLogo}
                                        alt="Brand Logo"
                                        className="h-16 w-auto object-contain mx-auto mb-2 rounded-md"
                                    />
                                    <p className="text-xs">Click to change</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mb-2" />
                                    <p className="text-sm">Click to upload or drag and drop</p>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="brokerage" className="text-zinc-300">Brokerage Name</Label>
                    <Input
                        id="brokerage"
                        placeholder="e.g. Keller Williams"
                        value={data.brokerageName}
                        onChange={(e) => updateData({ brokerageName: e.target.value })}
                        className="bg-zinc-900 border-zinc-800 text-white focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={isUploading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
