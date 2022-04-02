import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'

const Email = ({ onNext }) => {
    const [emailId, setEmailId] = useState('');

    return (
        <Card title="Enter Your Email Id" icon="email_page_emoji">

            <TextInput placeholder="google@gmail.com" size="20" value={emailId} onChange={(e) => setEmailId(e.target.value)} />

            <div>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={onNext} btnText="Next" />
                </div>
                <p className={styles.termsText}>By entering your email, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!</p>
            </div>

        </Card >
    )
}

export default Email