require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// Configurações do Servidor
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.static('public'));

// Rota da API
app.get('/api/placafipe/:placa', async (req, res) => {
  try {
    const { placa } = req.params;
    
    // Validação do Token
    if (!process.env.FIPE_API_TOKEN) {
      throw new Error('Token não configurado no servidor');
    }

    const response = await axios.get(
      `https://api.placafipe.com.br/getplacafipe/${placa}/${process.env.FIPE_API_TOKEN}`,
      {
        headers: {
          'User-Agent': 'ConsultaFIPE/1.0'
        }
      }
    );

    // Tratamento de respostas da API externa
    if (response.data.erro) {
      throw new Error(response.data.msg || 'Erro na API FIPE');
    }

    res.json(response.data);

  } catch (error) {
    console.error('Erro no backend:', error.message);
    res.status(500).json({
      error: error.message,
      tipo: 'ERRO_INTERNO'
    });
  }
});

// Rota para servir o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'consulta.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando: http://localhost:${PORT}`);
});