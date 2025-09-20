
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
        locationInizioTurno: null,
        locationPausa: null,
        locationFineTurno: null
    });

    useEffect(() => {
        const handleLocation = async () => {
            const steps = ["inizioTurno", "pausaPranzo", "fineTurno"];
            const locationKeys = {
                inizioTurno: "locationInizioTurno",
                pausaPranzo: "locationPausa",
                fineTurno: "locationFineTurno"
            };
            const nextStep = steps.find((key) => operaio[key] !== "" && !locations[locationKeys[key]]);

            if (!nextStep) return;

            if (nextStep === "inizioTurno") {
                getLocation(locationKeys.inizioTurno);
            } else if (nextStep === "pausaPranzo" && locations.locationInizioTurno) {
                // Simulate 100km move
                const newLat = locations.locationInizioTurno.lat + 0.9;
                const newLng = locations.locationInizioTurno.lng;
                const locationKey = locationKeys.pausaPranzo;
                setLocations(prev => ({...prev, [locationKey]: {lat: newLat, lng: newLng, address: ''}}));
                getAddress(newLat, newLng, locationKey);
            } else if (nextStep === "fineTurno" && locations.locationPausa) {
                // Simulate another 100km move
                const newLat = locations.locationPausa.lat - 0.5;
                const newLng = locations.locationPausa.lng + 0.8;
                const locationKey = locationKeys.fineTurno;
                setLocations(prev => ({...prev, [locationKey]: {lat: newLat, lng: newLng, address: ''}}));
                getAddress(newLat, newLng, locationKey);
            }
        };
        handleLocation();
    }, [operaio, locations]);

    const handleTimbratura = () => {        
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

    const getLocation = (locationKey) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setLocations(prev => ({...prev, [locationKey]: {lat, lng, address: ''}}));
                    getAddress(lat, lng, locationKey);
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocalizzazione non supportata dal browser");
        }
    };

    const getAddress = async (lat, lng, locationKey) => {
        try {
            const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            setLocations(prev => ({...prev, [locationKey]: {...prev[locationKey], address: data.display_name}}));
        } catch (err) {
            console.error(err);
        }
    };


    return(
        <>
            <NavbarComponent nomeOperaio={operaio.nome}/>
            <div className={styles.container}>
                    <GlassCardComponent customClassName={styles.clockCard}>
                        <ClockComponent/>
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
                            }`}
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
                            {operaio.inizioTurno ? 
                            <GlassCardComponent location={locations.locationInizioTurno}>
                                <div className={styles.info}>
                                    <p><b>Inizio turno: </b>{operaio.inizioTurno}</p>
                                    <p><b>Indirizzo:</b><br/> {locations.locationInizioTurno?.address}</p>
                                </div>
                            </GlassCardComponent> : ''}

                            { operaio.pausaPranzo ? 
                            <GlassCardComponent location={locations.locationPausa}>
                                <div className={styles.info}>
                                    <p><b>Inizio pausa: </b>{operaio.pausaPranzo}</p>
                                    {operaio.finePausaPranzo ? <p><b>Fine pausa: </b>{operaio.finePausaPranzo}</p> : ""}
                                    <p><b>Indirizzo:</b><br/> {locations.locationPausa?.address}</p>
                                </div>
                            </GlassCardComponent> : ""
                            }
                            { operaio.fineTurno ? 
                            <GlassCardComponent location={locations.locationFineTurno}>
                                <div className={styles.info}>
                                    <p><b>Fine turno: </b>{operaio.fineTurno}</p>
                                    <p><b>Indirizzo:</b><br/> {locations.locationFineTurno?.address}</p>
                                </div>
                            </GlassCardComponent> : ""
                            }

                        </div>
                        
                        : ""
                    }
                <div className={styles.riepilogo}>
                     <h1>Riepilogo Turni</h1>   
                    <GlassCardComponent>
                        <h2>Settimanale</h2>
                        <p><b>Ore lavorate:</b> 34</p>
                        <p><b>Km percorsi:</b> 650</p>
                    </GlassCardComponent>

                    <GlassCardComponent>
                        <h2>Mensile</h2>
                        <p><b>Ore lavorate:</b> 250</p>
                        <p><b>Km percorsi:</b> 2830</p>
                    </GlassCardComponent>
                </div>   
            </div>
        </>
    )
}
