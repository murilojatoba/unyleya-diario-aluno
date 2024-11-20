import axios from 'axios';
import { useState, useEffect } from "react";
import { TfiTrash, TfiPencilAlt } from "react-icons/tfi";
import { Aluno } from '../../models/aluno';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './home.css'

export default function Home() {

  const URL_BASE = 'https://api-aluno.vercel.app/aluno';

  // const [nome, setNome] = useState('');
  // const [matricula, setMatricula] = useState('');
  // const [curso, setCurso] = useState('');
  // const [bimestre, setBimestre] = useState('');

  const [form, setForm] = useState({} as Aluno);

  const [erro, setErro] = useState({} as Aluno);

  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    obterAlunos();
  }, []);

  async function obterAlunos() {

    setIsLoading(true);
    try {
      const response = await axios.get(URL_BASE);

      if (response) {
        setAlunos(response.data);
      }

    } catch (e) {
      toast('Hourve erro ao obter alunos.', {style: {background: '#ff8c8c', color: '#fff'}});

    } finally {
      setIsLoading(false);
    }
  }

  function validar() {
    let hasError = false;
    let erro = {} as Aluno;
    setErro(erro);

    if (!form.nome) {
      erro = { ...erro, nome: 'O nome é obrigatório' };
      hasError = true;
    }
    if (!form.matricula) {
      erro = { ...erro, matricula: 'A matrícula é obrigatória' };
      hasError = true;
    }
    if (!form.curso) {
      erro = { ...erro, curso: 'O curso é obrigatório' };
      hasError = true;
    }
    if (!form.bimestre) {
      erro = { ...erro, bimestre: 'O bimestre é obrigatório' };
      hasError = true;
    }

    if (hasError) {
      setErro(erro);
      return;
    }

    !form._id ? incluir(form): editar(form);
  }

  async function incluir(aluno: Aluno) {
    try {
      await axios.post(URL_BASE, aluno);
      obterAlunos();
      resetForm();

    } catch (e) {
      toast('Hourve erro ao incluir o aluno.', {style: {background: '#ff8c8c', color: '#fff'}});
    }
  }

  function resetForm() {
    const formVazio: Aluno = {
      _id: '',
      nome: '',
      matricula: '',
      curso: '',
      bimestre: '',
    };
    setForm(formVazio);
  }

  async function editar(aluno: Aluno) {
    try {
      await axios.put(`${URL_BASE}/${aluno._id}`, aluno);
      obterAlunos();
      resetForm();

    } catch (e) {
      toast('Hourve erro ao editar o aluno.', {style: {background: '#ff8c8c', color: '#fff'}});
    }
  }

  async function remover(aluno: Aluno) {
    const url = `${URL_BASE}/${aluno._id}`;

    try {
      await axios.delete(url);
      obterAlunos();

    } catch (e) {
      toast('Hourve erro ao excluir o aluno.', {style: {background: '#ff8c8c', color: '#fff'}});
    }
  }

  return (
    <div>
      <div className="container-home">
        <h1>Diário Eletrốnico</h1>
        <form className="form">
          <div className="form-field">
            <input type="text" placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <div className="error">{erro.nome}</div>
          </div>
          <div className="form-field">
            <input type="text" placeholder="Matrícula" value={form.matricula} onChange={e => setForm({ ...form, matricula: e.target.value })} />
            <div className="error">{erro.matricula}</div>
          </div>
          <div className="form-field">
            <select name="" id="" value={form.curso} onChange={e => setForm({ ...form, curso: e.target.value })}>
              <option value="">Selecione</option>
              <option value="Back-end">Back-end</option>
              <option value="Front-end">Front-end</option>
            </select>
            <div className="error">{erro.curso}</div>
          </div>
          <div className="form-field">
            <input type="text" placeholder="Bimestre" value={form.bimestre} onChange={e => setForm({ ...form, bimestre: e.target.value })} />
            <div className="error">{erro.bimestre}</div>
          </div>
        </form>
        <div className="container-botooes">
          <button type="button" className="btn" onClick={validar}>Salvar</button>
        </div>
      </div>
      <div className="container-table">
        <h2>Alunos Cadastrados</h2>

        {isLoading ? <p>Carregando</p> :
          <table>
            <tr>
              <th className="flex05">Ordem</th>
              <th className="flex2">Nome</th>
              <th className="flex1">Matricula</th>
              <th className="flex1">Curso</th>
              <th className="flex05">Bimestre</th>
              <th className="flex05">Açoes</th>
            </tr>

            {
              alunos.map((aluno, index) => {
                return (
                  <tr key={aluno._id}>
                    <td className="flex05">{index + 1}</td>
                    <td className="flex2">{aluno.nome}</td>
                    <td className="flex1">{aluno.matricula}</td>
                    <td className="flex1">{aluno.curso}</td>
                    <td className="flex05">{aluno.bimestre}</td>
                    <td className="flex05 acoes">
                      <TfiPencilAlt size='24px' color='#0fba3f' aria-label="Editar" onClick={e => setForm(aluno)} />
                      <TfiTrash size='24px' color='#900000' aria-label="Remover" onClick={e => remover(aluno)} />
                    </td>
                  </tr>
                )
              })
            }
          </table>
        }

      </div>
      <ToastContainer />
    </div>
  )
}