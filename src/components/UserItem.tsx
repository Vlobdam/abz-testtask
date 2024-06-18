/* eslint-disable @next/next/no-img-element */
import styles from '@/styles/UserItem.module.scss';
import { User } from '@/types/User';
import { Text } from './Text';
import { Font } from './Font';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import React from 'react';

const getNumberString = (number: string) => {
  const beautify = (n: string) =>  `+38 (0${n.substring(4, 6)}) ${n.substring(6, 9)} ${n.substring(9, 11)} ${n.substring(11)}`;
  
  if (number.length < 13) {
    return beautify(number + '0'.repeat(13 - number.length));
  }
  
  return beautify(number);  
}

export const UserItem = ({user}: {user: User}) => (
  <div className={styles.userItem}>
    <img className={styles.userImage} src={user.photo} alt={user.name} />
    
    <Text data-tooltip-id={`${user.id}-name`}  data-tooltip-content={user.name} className={styles.userText}>
      {user.name}
    </Text>

    <Tooltip 
      id={`${user.id}-name`}
      place='bottom'
    />
    
    <div className={styles.userDescription}>
      
      {Object.entries({
        position: user.position,
        email: user.email,
        phone: user.phone,
      }).map((([key, value]) => (
        <React.Fragment key={key}>
          <Font className={styles.userText} data-tooltip-id={`${user.id}-${key}`}  data-tooltip-content={value}>
            { key === 'phone' ? getNumberString(value) : value }
          </Font>
        
          <Tooltip id={`${user.id}-${key}`} place='bottom'/>
        </React.Fragment>
      )))}
    
    </div>
  </div>
)