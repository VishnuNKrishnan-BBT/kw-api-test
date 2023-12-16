import React from 'react'
import GlobalStyles from '../../global.module.css'

function GoogleIcon({ ...props }) {
    return (
        <span className={`material-symbols-outlined ${GlobalStyles.mNone} ${GlobalStyles.pNone}`} style={props.style}>{props.iconName}</span>
    )
}

export default GoogleIcon
