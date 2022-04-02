import React, { useState } from 'react'
import StepPhoneEmail from '../RegisterSteps/StepPhoneEmail/StepPhoneEmail'
import StepOtp from '../RegisterSteps/StepOtp/StepOtp'

// As we know that Login also have some steps same as the Register first 2 step of getting number and otp is same.
const authenticateSteps = {
    1: StepPhoneEmail,
    2: StepOtp,
}

const Authenticate = () => {
    const [stepNumber, setStepNumber] = useState(1);
    const AuthenticateStepPage = authenticateSteps[stepNumber];

    // This method is used for going to the next step of the authentication process
    const onNext = () => {
        setStepNumber(stepNumber + 1);
    }

    return (
        <AuthenticateStepPage onNext={onNext} />
    )
}

// Here we are doing the Prop Drilling of onNext function several times so to get the rid of this we can use the context API x

export default Authenticate;