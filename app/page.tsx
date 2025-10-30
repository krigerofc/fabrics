'use client'

import { useState } from "react"


export default function Home() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setconfirm_password] = useState('');

  const HandlerRegister = async (e:React.FormEvent) => {
    e.preventDefault();
    try{
      const res = await fetch('/api/backend/user/register', {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, name:name, password:password, confirm_password:confirm_password})
      })

      const data = await res.json();
      if(res){
        console.log(data);
      } else{
        console.log('error')
      }

    } catch(error){
      console.log(error)
    }
  } 

  return (
    <>
      <form className="bg-white flex flex-col p-6 gap-4 rounded-xl shadow-md w-80 mx-auto mt-10"
      onSubmit={HandlerRegister}>
        <input
          type="email"
          value={email}
          placeholder="seuemail@email.com"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 rounded text-black"
        />

        <input
          type="text"
          value={name}
          placeholder="seu nome"
          required
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded text-black"
        />

        <input
          type="password"
          value={password}
          placeholder="sua senha"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded text-black"
        />

        <input
          type="password"
          value={confirm_password}
          placeholder="sua senha"
          required
          onChange={(e) => setconfirm_password(e.target.value)}
          className="border border-gray-300 p-2 rounded text-black"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
        >
          Enviar
        </button>
      </form>
    </>
  )
}
