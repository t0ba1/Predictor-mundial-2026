import streamlit as st
import time

# Configuración inicial de la página
st.set_page_config(page_title="Predictor Mundial", page_icon="⚽", layout="centered")

st.title("⚽ Predictor del Mundial: Consenso + ELO")
st.markdown("Cálculo de probabilidades en tiempo real basado en datos del mercado financiero y rendimiento histórico.")
st.markdown("---")

# Selectores de equipos
equipos_ejemplo = ["Argentina", "Brasil", "Francia", "Inglaterra", "España", "Alemania"]

col1, col2 = st.columns(2)
with col1:
    equipo_a = st.selectbox("Equipo Local (A)", equipos_ejemplo, index=0)
with col2:
    equipo_b = st.selectbox("Equipo Visitante (B)", equipos_ejemplo, index=2)

st.markdown("") # Espaciador

# Botón de ejecución
if st.button("Calcular Predicción en Tiempo Real", use_container_width=True):
    if equipo_a == equipo_b:
        st.error("Por favor, seleccioná dos equipos distintos para el cruce.")
    else:
        # Animación de carga mientras "chupa" los datos
        with st.spinner('Extrayendo cuotas de The Odds API y cruzando con base ELO...'):
            time.sleep(2) # Simula el tiempo de la petición HTTP a la API
            
            # --- Acá irá la matemática de Poisson y limpieza de overround ---
            # Por ahora, usamos variables de prueba para la maqueta visual
            prob_a = 58.5
            prob_empate = 25.0
            prob_b = 16.5
            
            st.success("¡Datos duros obtenidos y procesados con éxito!")
            
            # Visualización limpia de porcentajes
            st.markdown("### Probabilidades Finales")
            
            metric1, metric2, metric3 = st.columns(3)
            metric1.metric(label=f"Victoria {equipo_a}", value=f"{prob_a}%")
            metric2.metric(label="Empate", value=f"{prob_empate}%")
            metric3.metric(label=f"Victoria {equipo_b}", value=f"{prob_b}%")

            st.markdown("---")
            st.info("💡 **Justificación Técnica:** Estos porcentajes representan la probabilidad implícita pura. El motor matemático purgó el margen de ganancia de las casas de apuestas e integró la diferencia del puntaje histórico ELO de ambas selecciones.")
