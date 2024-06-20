import React from 'react'
import useLogsStore, { LogsState } from '../state/logsStore'
import { ScrollArea } from './ui/scroll-area';

const Logs = () => {
    const logs = useLogsStore((state: LogsState) => state.logs);
    return (
        <div className='bg-white w-full rounded mt-2 p-3 text-start'>
            <p className='font-bold text-[1.5vw] text-black'>Logs</p>
            <ScrollArea className='h-[20vh]'>
                <div>
                    {
                        logs?.map(log => {
                            return (<p key={log} className='text-black list-disc text-[1vw]'>
                                - {log}
                            </p>)
                        })
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

export default Logs