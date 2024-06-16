import React from 'react'
import useLogsStore, { LogsState } from '../state/logsStore'

const Logs = () => {
    const logs = useLogsStore((state: LogsState) => state.logs);
    console.log(logs)
    return (
        <div className='bg-white w-full rounded mt-2 p-3 text-start'>
            <p className='font-bold text-md text-black'>Logs</p>
            <div>
                {
                    logs?.map(log => {
                        return (<p key={log} className='text-black'>
                            {log}
                        </p>)
                    })
                }
            </div>
        </div>
    )
}

export default Logs