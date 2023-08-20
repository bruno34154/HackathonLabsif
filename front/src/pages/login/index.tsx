import { Link } from "react-router-dom";
import Button from "../../components/inputs/button";
import Input from "../../components/inputs/input";
import axios from "axios";
import {BiExit} from "react-icons/bi"

export default function Login() {
  const handleSubmit = (e: any) => {
    e.preventDefault();

     const {username, password} = e.target;
        axios.post("http://localhost:3001/auth/login",{username: username.value, password: password.value}).then((res)=>{
            console.log(res.data);
            if(res.data.token){
                window.location.href = "/";
            }
            else{
                alert("usuario ou senha errados tente novamente")
            }
        
        }).catch((err)=>{
            alert("usuario ou senha errados tente novamente");
           
        })
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-1/3 h-96 p-10 bg-slate-100 border-solid border-indigo-500 border-4 flex flex-col justify-center items-center rounded-lg mt-10"
      >
        <p className="text-xl mb-10">Faça o login Aqui </p>
        <Input
          placeholder="digite seu usuario"
          type="name"
          name="username"
          title="Digite o email"
          id="cadastro"
        />
        <Input
          placeholder="digite sua senha"
          type="password"
          name="password"
          title="Digite o email"
          id="senha"
        />
        <Button title="Login" type="submit" />
        <Link to="/signUp" className="mt-2 text-indigo-600">
          Ainda não tem conta no nosso sistema? Cadastre-se aqui
        </Link>
      </form>
    </div>
  );
}
