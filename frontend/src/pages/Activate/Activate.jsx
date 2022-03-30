import React, { useState } from 'react'
import StepName from '../RegisterSteps/StepName/StepName'
import StepAvatar from '../RegisterSteps/StepAvatar/StepAvatar'

// As we know that Login also have some steps same as the Register first 2 step of getting number and otp is same.
const activateSteps = {
    1: StepName,
    2: StepAvatar,
}

const Activate = () => {
    const [stepNumber, setStepNumber] = useState(1);
    const ActivateStepPage = activateSteps[stepNumber];

    const onNext = () => {
        setStepNumber(stepNumber + 1);
    }

    return (
        <ActivateStepPage onNext={onNext} />
    )
}

export default Activate;