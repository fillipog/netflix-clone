import React, { useEffect, useState } from 'react'
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'

import './App.css'

export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false)

    useEffect(() => {
        const loadAll = async () => {
            //pegando a lista total
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            // pegando o featured
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if(window.scrollY > 40) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false)
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    },[])

    // Header 
    // Destaque
    // As listas
    // Rodapé basicão

    return (
        <div className="page">

            <Header black={blackHeader}/>

        {featuredData &&
            <FeaturedMovie item={featuredData}/>
        }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            <footer>
                Feito por Fillipo Goldoni<br />
                Direitos de imagem <span className="red">NETFLIX</span><br />
                Dados do site <span className="blue">TheMovieDb.org</span>
            </footer>


            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
                </div>
            }
        </div>
    )
}