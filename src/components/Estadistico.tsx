import { Dispatch, SetStateAction, useRef } from "react";
import styles from './Estadistico.module.css'

type InputsType = {
  muestra1: {
    media: React.RefObject<HTMLInputElement | null>;
    varianza: React.RefObject<HTMLInputElement | null>;
    tamano: React.RefObject<HTMLInputElement | null>;
    muestras_tomadas: React.RefObject<HTMLInputElement | null>;
  };
  muestra2: {
    media: React.RefObject<HTMLInputElement | null>;
    varianza: React.RefObject<HTMLInputElement | null>;
    tamano: React.RefObject<HTMLInputElement | null>;
    muestras_tomadas: React.RefObject<HTMLInputElement | null>;
  };
  poblacion1: {
    media: React.RefObject<HTMLInputElement | null>;
    varianza: React.RefObject<HTMLInputElement | null>;
    tamano: React.RefObject<HTMLInputElement | null>;
    distr_normal: React.RefObject<HTMLInputElement | null>;  // Fixed: 'distr_normal' not 'distr'
  };
  poblacion2: {
    media: React.RefObject<HTMLInputElement | null>;
    varianza: React.RefObject<HTMLInputElement | null>;
    tamano: React.RefObject<HTMLInputElement | null>;
    distr_normal: React.RefObject<HTMLInputElement | null>;
  };
};

export const Estadistico = ({
    caso,
    set_parameters_store,
}:{
    caso : String;
    set_parameters_store : Dispatch<SetStateAction<{}>>
})=>{
  
  const inputs : InputsType = {
    muestra1: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null), muestras_tomadas:useRef<HTMLInputElement>(null) },
    muestra2: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null), muestras_tomadas:useRef<HTMLInputElement>(null) },
    poblacion1: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null), distr_normal: useRef<HTMLInputElement>(null) },
    poblacion2: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null), distr_normal: useRef<HTMLInputElement>(null) }
  };

  const buildJSON = ()=>{
    return (
      <>
        <button 
        className={styles.send}
        onClick={() => {
          const data: Record<string, Record<string, string>> = {};
          Object.entries(inputs).forEach(set => {
            const [set_key, set_value] = set;
            
            Object.entries(set_value).forEach(sample_set => {
              const [sample_key, sample_value] = sample_set;
              const element = sample_value.current;
              
              if(!element) return;

              let value : any;

              if ( element?.type == 'checkbox' ) {
                value = element.checked;
              } else if ( element?.type == 'number' ) {
                value = element.value === '' ? undefined : parseFloat(element.value);
              } else {
                value = element?.value;
              }

              // Only add if value exists and is not empty string
              if (value && value !== '') {
                // Initialize object only when we have data to add
                if (!data[set_key]) {
                  data[set_key] = {};
                }
                data[set_key][sample_key] = value;
              }
            });
          });
          
          // data[set_key] will ONLY exist if it had at least one non-empty value
          set_parameters_store(data);
        }}
        >
          Enviar
        </button>
      </>
    )
  }
    

  const muestra_js = (title : string, input_ref : any )=>{
    return (
        <div className={styles.container}>
            <div className={styles.input_group}>
              <div className="bg-blue-50 text-blue-500 font-medium px-3 py-1 mb-2">
                <label>{title}</label>
              </div>
              <input required ref={{...input_ref}.media} type="number" placeholder="Media" />
              <input required ref={{...input_ref}.varianza} type="number" placeholder="Varianza" />
              <input required ref={{...input_ref}.tamano} type="number" placeholder="Tamaño de muestra" />
              {caso=='2'? 
                <input required ref={{...input_ref}.muestras_tomadas} type="number" placeholder="Muestras tomadas" />
                :<></>
              }
            </div>
        </div>
    )
  }
  const poblacion_js = (title : string, input_ref : any )=>{
    return (
        <div className={styles.container}>
            <div className={styles.input_group}>
              <div className="bg-blue-50 text-blue-500 font-medium px-3 py-1 mb-2">
                <label>{title}</label>
              </div>
              <input required ref={{...input_ref}.media} type="number" placeholder="Media" />
              <input required ref={{...input_ref}.varianza} type="number" placeholder="Varianza" />
              
              {caso=='2'?
                <>
                  <input required ref={{...input_ref}.tamano} type="number" placeholder="Tamaño de poblacion" />
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        required 
                        ref={{...input_ref}.distr_normal}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-linear-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-4"></div>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                      Distribucion normal de la poblacion
                    </span>
                  </label>
                </>
                : <></>
              }
            </div>   
        </div>
    )
  }
  if (!caso) return null;

  switch (caso) {
    case '1':
    case '3':
      return(
      <div>
        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap md:items-start items-center md:justify-center">
            {poblacion_js("Poblacion correspondiente a muestra 1",inputs.poblacion1)}
            {poblacion_js("Poblacion correspondiente a muestra 2",inputs.poblacion2)}
            
            {muestra_js("Muestra 1",inputs.muestra1)}
            {muestra_js("Muestra 2",inputs.muestra2)}
        </div>
        <div className="flex flex-col items-center">
            {buildJSON()}
        </div>
      </div>
      )
    case '2':
    case '4':
      return(
      <div className="container">
        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap md:items-start md:justify-center items-center">
            {poblacion_js("Poblacion",inputs.poblacion1)}

            {muestra_js("Muestra",inputs.muestra1)}
        </div>
        <div className="flex flex-col items-center">
          {buildJSON()}
        </div>
      </div>
      )
  }
}