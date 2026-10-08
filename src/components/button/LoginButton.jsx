import './LoginButton.css';

const LoginButton = ({ childrenComponent, type = 'button', onClick, disabled }) => {
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

export default LoginButton;
