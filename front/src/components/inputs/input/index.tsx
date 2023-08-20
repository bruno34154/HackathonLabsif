import { InputHTMLAttributes } from 'react';
type InputType = InputHTMLAttributes<HTMLInputElement> & {
  small?: boolean;
  danger?: boolean;
  info?: boolean;
  warn?: boolean;
  sucess?: boolean;
  invalid?: boolean;
};


const Input = ({ title, id, invalid, ...rest }: InputType) => {
  return (
    <div className='w-full'>
      <input id={id} className="mb-5 bg-gray-300 border  text-gray-900 text-sm rounded-lg ring-blue-500 border-blue-500 block w-full p-2.5 " {...rest}></input>
    </div>
  );
};
export default Input;