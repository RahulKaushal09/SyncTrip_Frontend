import React from 'react';

type Variant = 'filled' | 'outlined';

type Props = {
  Icon: React.ElementType; // e.g., FontAwesome5
  title: string;
  subtitle: string;
  variant?: Variant; // "filled" for light background, "outlined" for white background with subtle border/shadow
  containerStyle?: object; // Additional styles for the container
};

export default function LocationCardShortDescription({
  Icon,
  title,
  subtitle,
  variant = 'filled',
  containerStyle,
}: Props) {
  const isFilled = variant === 'filled';

  return (
    <div style={{ 
      ...styles.card, 
      ...(isFilled ? styles.cardFilled : styles.cardOutlined), 
      ...(containerStyle || {}) 
    }}>
      {/* <FontAwesome5
        name={icon}
        size={18}
        style={[styles.icon, isFilled ? styles.iconFilled : styles.iconOutlined]}
      /> */}
      <Icon style={{ ...styles.icon, ...(isFilled ? styles.iconFilled : styles.iconOutlined) }} />
      <div style={styles.textWrapper}>
        <p style={styles.title}>{title}</p>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 16,
    // marginBottom: 12,
  },
  cardFilled: {
    backgroundColor: 'var(--secondary-4)',
  },
  cardOutlined: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f1f3',
  },
  icon: {
    marginRight: 14,
  },
  iconFilled: {
    color: '#3a3f47',
  },
  iconOutlined: {
    color: '#3a3f47',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#3a3f47', // Replace COLORS.secondary[1] with a valid color or import COLORS if needed
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#5e646f',
  },
};
