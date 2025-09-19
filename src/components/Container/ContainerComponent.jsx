
import React, {useState, useEffect} from 'react'
import styles from './ContainerComponent.module.css'
import { NavbarComponent } from '../Navbar/NavbarComponent'
import ClockComponent from '../Clock/ClockComponent'
import { GlassCardComponent } from '../GlassCard/GlassCardComponent'


export const ContainerComponent = (props) => {
    const [error, setError] = useState(null);    
    const [operaio, setOperaio] = useState({
        nome: 'Filippo',
        cognome: 'Filippino',
        inizioTurno: '',
        pausaPranzo: '',
        finePausaPranzo: '',
        fineTurno: ''
    });
    const [locations, setLocations] = useState({
        locationInizioTurno: '',
        locationPausa: '',
        locationFineTurno: ''
    })

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    const handleTimbratura = () => {        
        getLocation()
        const date = new Date();
        var currentTime = '';
        if(date.getMinutes() < 10){
            currentTime = `${date.getHours()}:0${date.getMinutes()}`;
        } else { 
            currentTime = `${date.getHours()}:${date.getMinutes()}`;
        }
        const steps = ["inizioTurno", "pausaPranzo", "finePausaPranzo", "fineTurno"];

        const nextStep = steps.find((key) => operaio[key] === "");

        if (nextStep) {
            setOperaio({
                ...operaio,
                [nextStep]: currentTime,
            });
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    getAddress(lat, lng);  // passiamo direttamente le coordinate corrette
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocalizzazione non supportata dal browser");
        }
    };

    const getAddress = async (lat, lng) => {
        try {
            const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            console.log("Indirizzo:", data.address);
            const steps = ["locationInizioTurno", "locationPausa", "locationFineTurno"];
            const nextStep = steps.find((key) => locations[key] === "");
            if (nextStep) {
                setLocations({
                    ...locations,
                    [nextStep]: data.address.road,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };


    return(
        <>
            <NavbarComponent nomeOperaio={operaio.nome}/>
            <div className={styles.container}>
                    <GlassCardComponent isMobile={isMobile}>
                        <ClockComponent isMobile={isMobile}/>
                    </GlassCardComponent>
                    { operaio.fineTurno ? "" : 
                        <button className={`
                            ${styles.button} 
                            ${
                                operaio.inizioTurno === ''
                                ? styles.green
                                : operaio.pausaPranzo === ''
                                ? styles.orange
                                : operaio.finePausaPranzo === ''
                                ? styles.orange
                                : operaio.fineTurno === ''
                                ? styles.red
                                : ''
                            }
                            ${!isMobile ? styles.desktopButton : ""}`}
                            onClick={handleTimbratura}
                            disabled = {operaio.fineTurno ? true : false}
                            >Timbra {
                                operaio.inizioTurno === ''
                                ? "Entrata"
                                : operaio.pausaPranzo === ''
                                ? "Pausa"
                                : operaio.finePausaPranzo === ''
                                ? "Fine Pausa"
                                : operaio.fineTurno === ''
                                ? "Uscita"
                                : ''
                        }</button>
                    }
                    {
                        operaio.inizioTurno ?
                        <div>
                            {/* <p><b>Operaio: </b>{operaio.nome + " " + operaio.cognome}</p> */}
                            {operaio.inizioTurno ? 
                            <GlassCardComponent className={styles.shiftInfo} displayInfo={true} isMobile={isMobile}>
                                <div className={styles.info}>
                                    <p><b>Inizio turno: </b>{operaio.inizioTurno}</p>
                                    <p><b>Indirizzo:</b><br/> {locations.locationInizioTurno}</p>
                                </div>
                            </GlassCardComponent> : ''}

                            { operaio.pausaPranzo ? 
                            <GlassCardComponent className={styles.shiftInfo} displayInfo={true} isMobile={isMobile}>
                                <div className={styles.info}>
                                    <p><b>Inizio pausa: </b>{operaio.pausaPranzo}</p>
                                    {operaio.finePausaPranzo ? <p><b>Fine pausa: </b>{operaio.finePausaPranzo}</p> : ""}
                                    <p><b>Indirizzo:</b><br/> {locations.locationPausa}</p>
                                </div>
                            </GlassCardComponent> : ""
                            }
                            { operaio.fineTurno ? 
                            <GlassCardComponent className={styles.shiftInfo} displayInfo={true} isMobile={isMobile}>
                                <div className={styles.info}>
                                    <p><b>Fine turno: </b>{operaio.fineTurno}</p>
                                    <p><b>Indirizzo:</b><br/> {locations.locationFineTurno}</p>
                                </div>
                            </GlassCardComponent> : ""
                            }

                        </div>
                        
                        : ""
                    }
                <div className={styles.riepilogo}>
                     <h1>Riepilogo Turni</h1>   
                    <GlassCardComponent displayInfo={true} isMobile={isMobile}>
                        <h2>Settimanale</h2>
                        <p><b>Ore lavorate:</b> 34</p>
                        <p><b>Km percorsi:</b> 650</p>
                    </GlassCardComponent>

                    <GlassCardComponent displayInfo={true} isMobile={isMobile}>
                        <h2>Mensile</h2>
                        <p><b>Ore lavorate:</b> 250</p>
                        <p><b>Km percorsi:</b> 2830</p>
                    </GlassCardComponent>
                </div>   
            </div>
        </>
    )
}
