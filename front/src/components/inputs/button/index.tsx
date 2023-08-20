   import { ButtonHTMLAttributes } from 'react';


type ButtonType = ButtonHTMLAttributes<HTMLButtonElement> & {
  small?: boolean;
  danger?: boolean;
  info?: boolean;
  warn?: boolean;
  sucess?: boolean;
};

const Button = ({
  title,
  small,
  danger,
  info,
  warn,
  sucess,
  ...rest
}: ButtonType) => {
  return (
    <div>
      <button className='hover:text-indigo-700 hover:bg-slate-200 text-white bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800' {...rest}>{title}</button>
    </div>
  );
};
export default Button;
