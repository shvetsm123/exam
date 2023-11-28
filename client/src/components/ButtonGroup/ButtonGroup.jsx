import React from 'react';
import Button from './Button/Button';
import styles from './ButtonGroup.module.css';

const ButtonGroup = () => {
  return (
    <div className={styles.div}>
      <Button h3="Yes" p="The Domain should exactly match the name" />
      <Button
        h3="Yes"
        p={
          <>
            But minor variations are allowed <br />
            (Recomended)
          </>
        }
      />
      <Button h3="No" p="I am looking for a name, not a Domain" />
    </div>
  );
};

export default ButtonGroup;
