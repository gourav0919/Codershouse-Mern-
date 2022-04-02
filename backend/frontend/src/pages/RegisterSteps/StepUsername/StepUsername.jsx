import React from 'react'
import styles from './StepUsername.module.css'

const StepUsername = ({ onNext }) => {
    return (
        <>
            <div>StepUsername</div>
            <button onClick={onNext}>next</button>
        </>
    )
}

export default StepUsername