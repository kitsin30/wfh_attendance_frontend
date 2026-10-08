// components/Button.jsx
import './Button.css';

const Button = ({ childrenComponent, type = 'button', onClick, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {childrenComponent}
    </button>
  );
};

export default Button;
