import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, Flag, Building2, 
  Globe, LogOut, HelpCircle, Plus, Search, 
  Edit2, Trash2, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Paises.css';

interface Continente {
  id: number;
  nome: string;
}

interface Pais {
  id: number;
  nome: string;
  populacao: number;
  idioma_oficial: string;
  moeda: string;
  id_continente: number;
  continente?: Continente;
  cidades?: number;
}

const dicionarioSiglas: Record<string, string> = {
  'brasil': 'BR',
  'portugal': 'PT',
  'argentina': 'AR',
  'frança': 'FR',
  'franca': 'FR',
  'alemanha': 'DE',
  'japão': 'JP',
  'japao': 'JP',
  'china': 'CN',
  'estados unidos': 'US',
  'itália': 'IT',
  'italia': 'IT',
  'espanha': 'ES',
  'inglaterra': 'GB',
  'reino unido': 'GB',
  'canadá': 'CA',
  'canada': 'CA'
};

export function Paises() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroContinente, setFiltroContinente] = useState('');


  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idioma, setIdioma] = useState('');
  const [moeda, setMoeda] = useState('');
  const [idContinente, setIdContinente] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [paisesData, continentesData] = await Promise.all([
        apiService.getPaises(),
        apiService.getContinentes()
      ]);
      setPaises(paisesData);
      setContinentes(continentesData);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);


  const paisesFiltrados = paises.filter(p => {
    const termoBusca = searchTerm.toLowerCase();
    const matchBusca = p.nome.toLowerCase().includes(termoBusca) || p.idioma_oficial.toLowerCase().includes(termoBusca);
    const matchContinente = filtroContinente ? p.id_continente.toString() === filtroContinente : true;
    return matchBusca && matchContinente;
  });

  const obterUrlBandeira = (nomePais: string) => {
    const nomeFormatado = nomePais.toLowerCase().trim();
    const sigla = dicionarioSiglas[nomeFormatado];
    
    if (sigla) {
      return `https://flagsapi.com/${sigla}/flat/64.png`;
    }
    return null;
  };


  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const dados = {
      nome,
      populacao: Number(populacao),
      idioma_oficial: idioma,
      moeda,
      id_continente: Number(idContinente)
    };

    try {
      if (editingId) {
        await apiService.updatePais(editingId, dados);
        alert('País atualizado!');
      } else {
        await apiService.createPais(dados);
        alert('País criado!');
      }
      fecharModal();
      carregarDados(); 
    } catch (error) {
      alert('Erro ao salvar o país.');
    }
  };

  const abrirEdicao = (item: Pais) => {
    setEditingId(item.id);
    setNome(item.nome);
    setPopulacao(item.populacao.toString());
    setIdioma(item.idioma_oficial);
    setMoeda(item.moeda);
    setIdContinente(item.id_continente.toString());
    setIsModalOpen(true);
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja apagar este país?')) return;
    try {
      await apiService.deletePais(id);
      carregarDados();
    } catch (error) {
      alert('Erro ao apagar o país. Cidades podem estar vinculadas a ele.');
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNome(''); setPopulacao(''); setIdioma(''); setMoeda(''); setIdContinente('');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-box"><Map size={20} color="#fff" /></div>
          <div className="logo-text"><h2>GeoManager</h2><span>v1.0.0</span></div>
        </div>
        <nav className="sidebar-nav">
          <a onClick={() => navigate('/dashboard')} className="nav-item" style={{cursor: 'pointer'}}><LayoutDashboard size={18} /> Dashboard</a>
          <a onClick={() => navigate('/continentes')} className="nav-item" style={{cursor: 'pointer'}}><Globe size={18} /> Continentes</a>
          <a onClick={() => navigate('/paises')} className="nav-item active teal-active" style={{cursor: 'pointer'}}><Flag size={18} /> Países</a>
          <a onClick={() => navigate('/cidades')} className="nav-item" style={{cursor: 'pointer'}}><Building2 size={18} /> Cidades</a>
        </nav>
        <div className="sidebar-summary">
          <span className="summary-title">RESUMO</span>
          <div className="summary-item"><span>Continentes</span><span className="summary-value text-purple">{continentes.length}</span></div>
          <div className="summary-item"><span>Países</span><span className="summary-value text-teal">{paises.length}</span></div>
          <div className="summary-item"><span>Cidades</span><span className="summary-value text-green">15</span></div>
        </div>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info"><strong>Admin</strong><span>admin@geo.com</span></div>
          </div>
          <button className="btn-logout" onClick={() => navigate('/')}><LogOut size={16} /> Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div className="title-section">
            <div className="page-icon bg-teal-dark"><Flag size={24} className="text-teal" /></div>
            <div>
              <h1>Países</h1>
              <p>{paisesFiltrados.length} registros encontrados</p>
            </div>
          </div>
          <button className="btn-new-teal" onClick={() => { fecharModal(); setIsModalOpen(true); }}>
            <Plus size={18} /> Novo País
          </button>
        </header>

        <div className="search-section filter-group">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar país ou idioma..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={filtroContinente}
            onChange={(e) => setFiltroContinente(e.target.value)}
          >
            <option value="">Todos os continentes</option>
            {continentes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Carregando dados...</div>
          ) : paisesFiltrados.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Nenhum país encontrado.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '120px', textAlign: 'center' }}>BANDEIRA</th>
                  <th>PAÍS</th>
                  <th>CONTINENTE</th>
                  <th>POPULAÇÃO</th>
                  <th>IDIOMA</th>
                  <th>MOEDA</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {paisesFiltrados.map((item) => {
                  const urlBandeira = obterUrlBandeira(item.nome);
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px' }}>
                        {urlBandeira ? (
                          <img 
                            src={urlBandeira} 
                            alt={`Bandeira ${item.nome}`} 
                            style={{ width: '64px', height: '48px', objectFit: 'contain', borderRadius: '6px', filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.3))', verticalAlign: 'middle' }} 
                          />
                        ) : (
                          <div style={{ width: '64px', height: '48px', background: '#1e293b', borderRadius: '6px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                        )}
                      </td>
                      <td className="font-medium text-teal">{item.nome}</td>
                      <td className="text-muted">{item.continente?.nome || 'Desconhecido'}</td>
                      <td className="text-green font-medium">{item.populacao.toLocaleString()}</td>
                      <td className="text-muted">{item.idioma_oficial}</td>
                      <td className="text-muted">{item.moeda}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon edit" onClick={() => abrirEdicao(item)}><Edit2 size={16} /></button>
                          <button className="btn-icon delete" onClick={() => handleDeletar(item.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-container modal-wide" onSubmit={handleSalvar}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar País' : 'Novo País'}</h2>
              <button type="button" className="btn-close-modal" onClick={fecharModal}><X size={18} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="input-group">
                  <label>Nome do País</label>
                  <input type="text" placeholder="Ex: Brasil" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>População</label>
                  <input type="number" placeholder="Ex: 215000000" value={populacao} onChange={(e) => setPopulacao(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Idioma</label>
                  <input type="text" placeholder="Ex: Português" value={idioma} onChange={(e) => setIdioma(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Moeda</label>
                  <input type="text" placeholder="Ex: Real (BRL)" value={moeda} onChange={(e) => setMoeda(e.target.value)} required />
                </div>
              </div>
              
              <div className="input-group mt-3">
                <label>Continente</label>
                <select className="filter-select w-full" value={idContinente} onChange={(e) => setIdContinente(e.target.value)} required>
                  <option value="">Selecione um continente...</option>
                  {continentes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={fecharModal}>Cancelar</button>
              <button type="submit" className="btn-create-teal">{editingId ? 'Salvar' : 'Criar'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}