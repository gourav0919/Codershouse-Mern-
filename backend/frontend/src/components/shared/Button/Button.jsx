import React from 'react'
import styles from './Button.module.css'

const Button = ({ btnText, onClick }) => {
    return (
        <button onClick={onClick} className={`${styles.btn}`}>
            <span>{btnText}</span>
            <img className={`${styles.btnArrow}`} src='/images/arrow_forward.png' alt='Forward Arrow sign' />
        </button>
    )
}

export default Button