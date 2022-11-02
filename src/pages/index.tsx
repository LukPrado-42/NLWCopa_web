import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
    const [poolTitle, setPoolTitle] = useState("");

    async function createPool(event: FormEvent) {
      event.preventDefault();

      try {
        const response = await api.post("/pools", {
          title: poolTitle,
        });

        const { code } =response.data;
        await navigator.clipboard.writeText( code );
        alert(`Bolão criado com sucesso, o código é ${ code } e foi copiado para a área de transferência`);
        setPoolTitle("")

      } catch (err) {
        alert("Falha ao criar o bolão, tente novamente!")
      }
    }

    return (
      <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center" >
        <main>
          <Image src={ logoImg } alt="NLW Copa"/>
          <h1 
            className="mt-7 text-white text-5xl font-bold leading-tight" >
              Crie seu próprio bolão da copa e compartilhe entre amigos!
          </h1>

          <div className="mt-7 flex items-center gap-2">
            <Image src={ usersAvatarExampleImg } alt="" />
            <strong className='text-nlwGray-100 text-xl'>
              <span className='text-nlwGreen-500'>+{props.userCount}</span> pessoas já estão usando
            </strong>
          </div>

          <form onSubmit={ createPool } className='mt-7 flex gap-2'>
            <input 
              className='flex-1 px-6 py-4 rounded bg-nlwGray-800 border-nlwGray-600 text-sm text-nlwGray-200'
              type="text" 
              required 
              placeholder="Qual nome do seu bolão?" 
              onChange={ event => setPoolTitle( event.target.value ) }
              value = {poolTitle}
            />
            <button 
              className='bg-nlwYellow-500 px-6 py-4 rounded text-nlwGray-900 font-bold text-sm uppercase
                hover:bg-nlwYellow-700'
              type="submit" 
            >Criar meu bolão</button>
          </form>

          <p className="max-w-[400px] mt-4 text-nlwGray-300 text-sm leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
          </p>

          <div className="mt-5 pt-5 border-t border-nlwGray-600 divide-x divide-nlwGray-600 grid grid-cols-2 text-nlwGray-100">
            <div className="flex items-center gap-6 justify-center">
              <Image src={ iconCheckImg } alt="" />
              <div className="flex flex-col leading-snug">
                <span className="text-2xl font-bold">+{props.poolCount}</span>
                <span className="text-base">Bolões criados</span>
              </div>
            </div>

            <div className="flex items-center gap-6 justify-center">
              <Image src={ iconCheckImg } alt="" /> 
              <div className="flex flex-col leading-snug">
                <span className="text-2xl font-bold">+{props.guessCount}</span>
                <span className="text-base">palpites enviados</span>
              </div>
            </div>
          </div>
        </main>

        <Image 
          src={ appPreviewImg } 
          alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
          quality={100}
        />
      </div>
  )
}

export const getServerSideProps = async () => {
  const [ 
    poolCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
