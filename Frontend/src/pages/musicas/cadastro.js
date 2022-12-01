import React, { useState, useEffect } from 'react';
import { Button, Grid, MenuItem, TextField } from '@material-ui/core';

import api from "../../services/api";

function Cadastro(props) {

    const [id, setId] = useState(0);

    const [nome, setNome] = useState();
    const [nomeError, setnomeError] = useState("");

    const [album, setAlbum] = useState('');
    const [albumIdError, setAlbumIdError] = useState("");

    const [albuns, setAlbuns] = useState([]);

    useEffect(() => {       
        api.get("album")
        .then(response => {
            var content = []

            response.data.dados.forEach(row => {
                content.push({
                    id: row.id,
                    nome: row.nome 
                })                    
            });
            setAlbuns(content);
        })
        .catch((err) => {
            console.log("Error");
            console.log(err);
        });

        if (props.musica !== "") {
            defineAlteracao(props.musica);
        }
    }, []);

    function defineAlteracao(musica) {
        setId(musica.id);
        setNome(musica.nome);
        setAlbum(musica.album.id);      
    }

    function efetuaCadastro() {
        var validaOperacao = true;

        setnomeError("");
        setAlbumIdError("");

        if (nome === "" || nome == null) {
            validaOperacao = false;
            setnomeError("Necessário informar o Nome da música.");
        }

        if (validaOperacao) {
            console.log("Informações Válidas. Iniciando processo de cadastro...");            
        
            const headers = {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }

            if (id !== 0) {
                let data = {
                    id: id,
                    nome: nome,            
                    album_id: album
                }
                api.put(`musica?id=${id}`, data, headers)
                    .then(response => {
                        if (response.status === 200) {
                            props.cadastroSucesso()
                        } else {
                            props.cadastroFalha(response.data)
                        }
                    })
                    .catch((err) => {
                        props.cadastroFalha("Falha ao Alterar registro de Música. Por favor tente novamente mais tarde ou, se o problema persistir, contate nosso Suporte.");
                        console.log(err.stack);
                    });
            } else {
                let data = {
                    nome: nome,            
                    album_id: album
                }

                api.post("musica", data, headers)
                    .then(response => {
                        if (response.status === 201) {
                            props.cadastroSucesso();
                        } else {
                            props.cadastroFalha(response.data)
                        }
                    })
                    .catch((err) => {
                        props.cadastroFalha("Falha ao Cadastrar Música. Por favor tente novamente mais tarde ou, se o problema persistir, contate nosso Suporte.");
                        console.log(err.stack);
                    });
            }
        }
    }

    return (
        <Grid item xs={12}>
            <form>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        className="m-3"
                        id="nome"
                        label="Nome da Música"
                        variant="outlined"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        helperText={nomeError}
                        error={(nomeError !== "")}
                    />
                </Grid>         

                <Grid item xs={12} sm={4}>
                    <TextField
                        id="album"
                        fullWidth
                        className="m-3"
                        label="Albuns"
                        variant="outlined"
                        value={album}
                        onChange={(e) => { setAlbum(e.target.value) }}
                        helperText={albumIdError}
                        error={(albumIdError !== "")}
                        select>
                        {albuns.map(option => 
                            <MenuItem
                                key={option.id}
                                value={option.id}>
                                {option.nome}
                            </MenuItem>
                        )}
                    </TextField>
                </Grid>                   
                
                <Grid item xs={6} sm={4} md={3} lg={2} xl={1} className="mr-3 mb-3">
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        className="m-3"
                        onClick={efetuaCadastro}>
                        {id !== 0 && "Alterar"}
                        {id === 0 && "Cadastrar"}
                    </Button>
                </Grid>
            </form>
        </Grid>
    );
}

export default Cadastro;