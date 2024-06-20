import React from 'react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

const TeamSelector = ({ handleTeamSelect }: {
    handleTeamSelect: (team: string) => void
}) => {
    const [teamRole, setTeamRole] = useState('');
    return (
        <Card className='flex flex-col'>
            <CardHeader>
                <CardTitle>Select your team</CardTitle>
                <CardDescription>Choose between spymaster and operative.</CardDescription>
            </CardHeader>
            <CardContent>
                <ToggleGroup type="single" className='flex flex-col items-start gap-2 mb-8' onValueChange={(teamRole: string) => setTeamRole(teamRole)}>
                    <div>
                        <p className='opacity-50 text-sm font-normal'>Team Red</p>
                        <ToggleGroupItem value="red-sm" variant={'outline'} className='me-2 mt-1 hover:bg-orange-700 data-[state=on]:bg-orange-700'>Spymaster</ToggleGroupItem>
                        <ToggleGroupItem value="red-op" variant={'outline'} className='me-2 mt-1 hover:bg-orange-700 data-[state=on]:bg-orange-700'>Operative</ToggleGroupItem>
                    </div>
                    <div>
                        <p className='opacity-50 text-sm font-normal'>Team Blue</p>
                        <ToggleGroupItem value="blue-sm" variant={'outline'} className='me-2 mt-1 hover:bg-indigo-700 data-[state=on]:bg-indigo-700'>Spymaster</ToggleGroupItem>
                        <ToggleGroupItem value="blue-op" variant={'outline'} className='me-2 mt-1 hover:bg-indigo-700 data-[state=on]:bg-indigo-700'>Operative</ToggleGroupItem>
                    </div>
                </ToggleGroup>
                <Button className='w-full hover:bg-foreground hover:text-background' variant={'outline'} onClick={() => handleTeamSelect(teamRole)}>Submit Team & Role</Button>
            </CardContent>
        </Card>
    )
}

export default TeamSelector