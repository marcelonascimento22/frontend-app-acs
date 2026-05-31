import { useParams } from 'react-router-dom';
import { usePessoa } from '../hooks/usePessoa';

import InfoPessoa from './pessoaDetalhe/infoPessoa';
import InfoComorbidade from './pessoaDetalhe/infoComorbidade';
import { InfoVacina } from './pessoaDetalhe/infoVacina';
import InfoGestacao from './pessoaDetalhe/infoGestacao';
import calculateAge from '../utils/calculateAge';
import InfoConsultas from './pessoaDetalhe/infoConsultas';
import InfoAgendamentos from './pessoaDetalhe/infoAgendamentos';
import { Loading } from '../utils/Loading';



export default function PessoaDetalhe() {

  const { id } = useParams();

  //Pessoa
  const { data: pessoa, isLoading: loadingPessoa } = usePessoa(id);
  

  if (loadingPessoa) {
    return <Loading />;
  }

  if (!pessoa) {
    return <p className="text-center p-4">Pessoa não encontrada</p>;
  }
  
  ////console.log('Pessoa : ', pessoa)

  ////console.log(typeof calculateAge(pessoa.dataNascimento))

  ////console.log('Sexo', pessoa.sexo)

  //const idade = calculateAge(pessoa?.dataNascimento);
//const isFeminino = pessoa?.sexo?.toLowerCase().startsWith('f');

////console.log({ idade, isFeminino });
const podeMostrarGestacao =
  pessoa?.sexo?.toUpperCase() === 'F' &&
  calculateAge(pessoa?.dataNascimento) > 10;

  return (
    <>
      <div className="p-4 md:p-6 flex justify-center">

        <div className="w-full max-w-4xl">

          {/* Card dados Pessoais */}
          <InfoPessoa/>

          {/* Card Agendamentos */}
          <InfoAgendamentos />

          {/* Card Consultass */}
          <InfoConsultas/>

          {/* Card Gestação */}
          {podeMostrarGestacao && <InfoGestacao />}


          {/* Card Vacinas */}
          <InfoVacina/>

          {/* Card Comorbidade */}
          <InfoComorbidade/>

        </div>
      </div>

      
    </>
  );
}