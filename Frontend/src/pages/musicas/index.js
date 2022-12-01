import React, { Fragment, useEffect, useState } from 'react';
import { Card, Grid, Button, Container } from '@material-ui/core';
import { Alerta } from '../../components';

import api from "../../services/api";

import Listagem from './listagem';
import Cadastro from './cadastro.js';


function Musica() {


    /**
     * 0 => Listagem
     * 1 => Cadastro
     */
    const [pageTipe, setPageTipe] = useState(0);
    const [content, setContent] = useState([]);

    const [alert, setAlert] = useState("");
    const [alertType, setAlertType] = useState("");

    const [musica, setMusic] = useState("");

    useEffect(() => {
        api.get("musica")
            .then(response => {
                var content = []                
                response.data.dados.forEach(row => {
                    content.push({
                        id: row.id,
                        nome: row.nome,                        
                        album: row.album.nome 
                    })
                });
                setContent(content);
            })
            .catch((err) => {
                console.log("Error");
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageTipe]);

    function editar(id) {
        api.get(`musica?id=${id}`)
            .then(response => {
                let dataResponse = response.data.dados;
                let musica = {
                    id: dataResponse.id,
                    nome: dataResponse.nome,                                 
                    album: dataResponse.album                    
                }

                setMusic(musica);
                setPageTipe(2);
            })
            .catch((err) => {
                setAlertType("error");
                setAlert("Falha ao buscar informações da Música. Por favor tente novamente mais tarde ou contate o Suporte Técnico.");
                console.log("Error");
                console.log(err.stack);
            });
    }

    function remover(id) {
        api.delete(`musica?id=${id}`)
            .then(response => {
                if (response.status === 200) {
                    setAlertType("success");
                    setAlert("Música Removida com sucesso.");
                } else {
                    setAlertType("danger");
                    setAlert("Falha ao tentar remover Música. Por favor tente novamente mais tarde ou contate o Suporte Técnico.");
                }
                setPageTipe(1);
                setPageTipe(0);
            })
            .catch((err) => {
                setAlertType("danger");
                setAlert("Falha ao tentar remover Música. Por favor tente novamente mais tarde ou contate o Suporte Técnico.");
                console.log("Error");
                console.log(err.stack);
        });
    }

    function cadastroSucesso() {
        setAlertType("success");

        setAlert(
            (musica !== "")
                ? "Música Alterada com sucesso."
                : "Música Inserida com sucesso."
        );

        setPageTipe(0); // Retorna para lista de agentes.
    }

    function cadastroFalha(msg) {
        setAlertType("error");
        setAlert(msg);
        window.scrollTo(0, 0);
    }

    
    return (
        <Fragment>
            <Container>
                <h1>Gestão de Músicas</h1>

                {
                    alertType !== "" && <Alerta type={alertType} title={alertType === "success" ? 'Sucesso!' : 'Falha!'} message={alert} />
                }

                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12}>
                        <Card>
                            <Grid container item xs={12} justify="space-between" alignItems="center">
                                <Grid item></Grid>
                                <Grid item className="m-3">
                                    {pageTipe === 0 && (<h3>Listagem de Músicas</h3>)}
                                    {pageTipe === 1 && (<h3>Cadastro de Música</h3>)}
                                    {pageTipe === 2 && (<h3>Edição de Música</h3>)}
                                </Grid>
                                <Grid item className="m-2">
                                    {pageTipe === 0
                                        ? (<Button className="p-3" variant="contained" color="primary" onClick={() => { setMusic(""); setAlertType(""); setPageTipe(1) }}>Cadastrar Nova Música</Button>)
                                        : (<Button className="p-3" variant="contained" color="primary" onClick={() => { setMusic(""); setAlertType(""); setPageTipe(0) }}>Voltar</Button>)
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    {pageTipe === 0
                        ? (<Listagem
                            dataContent={content}
                            editar={editar}
                            remover={remover} />)
                        : (<Cadastro
                            cadastroSucesso={cadastroSucesso}
                            cadastroFalha={cadastroFalha}
                            musica={musica} />)
                    }
                </Grid>
            </Container>
        </Fragment>
    );
}

export default Musica;