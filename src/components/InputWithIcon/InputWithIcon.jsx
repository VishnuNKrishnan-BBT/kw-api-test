import React from 'react'
import Styles from './InputWithIcon.module.css'
import GoogleIcon from '../GoogleIcon/GoogleIcon'

function InputWithIcon({ ...props }) {
    return (
        <div className={`${Styles.wrapper}`} style={props.style ? props.style : {}}>
            <div className={`${Styles.iconHolder}`}>
                {props.icon && <GoogleIcon iconName={props.icon} style={{ fontSize: '24px' }} />}
            </div>
            <input className={`${Styles.input}`} type={props.inputType ? props.inputType : 'text'} placeholder={props.placeholder ? props.placeholder : ''} value={props.value} onChange={e => props.onChange(e.target.value)} />
        </div>
    )
}

export default InputWithIcon
