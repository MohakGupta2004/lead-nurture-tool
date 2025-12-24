'use client'

import { useOnboarding } from '../onboarding-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

export default function Step1Personal() {
    const { data, updateData, nextStep } = useOnboarding()

    const handleNext = () => {
        // Basic validation
        if (!data.phoneNumber || !data.professionalEmail) {
            alert('Please fill in required fields')
            return
        }
        nextStep()
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Personal Information</h2>
                <p className="text-zinc-400">Let's get to know you better.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex gap-2 w-full">
                        <div className="w-1/2">
                            <Label htmlFor='firstname' className='text-zinc-300 pb-2'>First Name</Label>
                            <Input
                                id="firstname"
                                type="text"
                                placeholder="John"
                                value={data.firstName}
                                onChange={(e) => updateData({ firstName: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-white focus:ring-yellow-500 focus:border-yellow-500"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor='lastname' className='text-zinc-300 pb-2'>Last Name</Label>
                            <Input
                                id="lastname"
                                type="text"
                                placeholder="Doe"
                                value={data.lastName}
                                onChange={(e) => updateData({ lastName: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-white focus:ring-yellow-500 focus:border-yellow-500"
                            />
                        </div>
                    </div>
                    <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel" // Use type="tel" for phone number input
                        placeholder="+1 (555) 000-0000"
                        value={data.phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow digits, spaces, hyphens, parentheses, and a leading plus sign
                            const phoneRegex = /^[\d\s\-\(\)\+]*$/;
                            if (phoneRegex.test(value) || value === '') {
                                updateData({ phoneNumber: value });
                            }
                        }}
                        className="bg-zinc-900 border-zinc-800 text-white focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Professional Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={data.professionalEmail}
                        onChange={(e) => {
                            updateData({ professionalEmail: e.target.value })
                        }}
                        className="bg-zinc-900 border-zinc-800 text-white focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label className="text-zinc-300">Years in Business</Label>
                        <span className="text-yellow-500 font-medium">{data.yearsInBusiness} years</span>
                    </div>
                    <Slider
                        value={[data.yearsInBusiness]}
                        onValueChange={(vals) => updateData({ yearsInBusiness: vals[0] })}
                        max={40}
                        step={1}
                        className="py-4"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="calendly" className="text-zinc-300">Calendly Link (Optional)</Label>
                    <Input
                        id="calendly"
                        placeholder="https://calendly.com/your-link"
                        value={data.calendlyLink}
                        onChange={(e) => updateData({ calendlyLink: e.target.value })}
                        className="bg-zinc-900 border-zinc-800 text-white focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button
                    onClick={handleNext}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
