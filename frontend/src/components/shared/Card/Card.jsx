import React from 'react'
import styles from './Card.module.css'

const Card = ({ title, icon, children }) => {
    return (
        <div className={`${styles.card}`}>
            <div className={`${styles.headingWrapper}`}>
                {/* Using the short circuit concept */}
                {icon && <img className={`${styles.headingLogo}`} src={`/images/${icon}.png`} alt="logo" />}
                {title && <h1 className={`${styles.headingText}`}>{title}</h1>}
            </div>

            {children}
        </div>
    )
}

export default Card