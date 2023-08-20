import { Link } from "react-router-dom";
import Button from "../../components/inputs/button"
import Input from "../../components/inputs/input" 
import axios from "axios";
import { useState } from "react";

export default function SignUp(){
    const [message, setMessage] = useState<String>("");
    const handleSubmit = (e: any)=>{
        e.preventDefault()
        const {username, email, password} = e.target;
        axios.post("http://localhost:3001/auth/register",{username: username.value, password: password.value, email: email.value }).then((res)=>{
            alert("cadastro realizado!! faça o login para entrar no sistema!!");
            window.location.href = '/login';
        }).catch((err)=>{
            alert("Erro no servidor");
            console.log("error")
        })
       
    }
    return(
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-1/3 h-96 p-10 bg-slate-100 border-solid border-indigo-500 border-4 flex flex-col justify-center items-center rounded-lg mt-10">
                <p className="text-xl mb-10">Cadastre-se Aqui </p>
                <Input placeholder="digite seu usuario" type="name" name="username"  id="cadastro"/>
                <Input placeholder="digite seu email" type="email" name="email"  id="cadastro"/>
                <Input placeholder="digite sua senha" type="password" name="password"  id="senha" />
                <Button title="Cadastrar" type="submit"/>
                <Link to="/login" className="mt-2 text-indigo-600">Ja tem conta? vá a tela de login clicando aqui</Link>
            </form>

            
        </div>
    )
}