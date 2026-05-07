import { useState, useRef, useEffect } from "react";
import { flask_POST } from "@/api/flask";
import { json } from "stream/consumers";

const Estadistico = ({
    caso,
}:{
    caso : String,
})=>{
  
  const inputs = {
    muestra1: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null) },
    muestra2: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null) },
    poblacion: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null) }
  };
  
  const [ json_package, setJsonPackage ] = useState({});
  useEffect(() => {
    if (json_package && Object.keys(json_package).length > 0) {
      console.log('Updated state:', json_package);
      flask_POST(JSON.stringify(json_package));
    }
  }, [json_package]);


  const buildJSON = ()=>{
    return (
      <>
        <button 
        onClick={() => {
          const data: Record<string, Record<string, string>> = {};
          Object.entries(inputs).forEach(set => {
            const [set_key, set_value] = set;
            
            Object.entries(set_value).forEach(sample_set => {
              const [sample_key, sample_value] = sample_set;
              const value = sample_value.current?.value;
              
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
          setJsonPackage(data);
        }}
        >
          Enviar
        </button>
      </>
    )
  }
    
  if (!caso) return null;

  switch (caso) {
    case '1':
      return(
      <>
          <div className="input-group">
              <label>Muestra 1</label>
              <input required ref={inputs.muestra1.media} type="number" placeholder="Media" />
              <input required ref={inputs.muestra1.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.muestra1.tamano} type="number" placeholder="Tamaño de muestra" />
          </div>
          <div className="input-group">
              <label>Muestra 2</label>
              <input required ref={inputs.muestra2.media} type="number" placeholder="Media" />
              <input required ref={inputs.muestra2.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.muestra2.tamano} type="number" placeholder="Tamaño de muestra" />
          </div>
          {buildJSON()}
      </>
      )
    case '2':
      return(
      <>
          <div className="input-group">
              <label>Poblacion</label>
              <input required ref={inputs.poblacion.media} type="number" placeholder="Media" />
              <input required ref={inputs.poblacion.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.poblacion.tamano} type="number" placeholder="Tamaño de poblacion" />
          </div>
          <div className="input-group">
              <label>Muestra</label>
              <input required ref={inputs.muestra1.media} type="number" placeholder="Media" />
              <input required ref={inputs.muestra1.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.muestra1.tamano} type="number" placeholder="Tamaño de muestra" />
          </div>
          {buildJSON()}
      </>
      )
    case '4':
      return(
      <>
          <div className="input-group">
              <label>Poblacion</label>
              <input required ref={inputs.poblacion.varianza} type="number" placeholder="Varianza" />
          </div>
          <div className="input-group">
              <label>Muestra</label>
              <input required ref={inputs.muestra1.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.muestra1.tamano} type="number" placeholder="Tamaño de muestra" />
          </div>
          {buildJSON()}
      </>
      )    
    case '3':
      return(
      <>
          <div className="input-group">
              <label>Muestra 1</label>
              <input required ref={inputs.muestra1.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.muestra1.tamano} type="number" placeholder="Tamaño de muestra" />
          </div>
          <div className="input-group">
              <label>Muestra 2</label>
              <input required ref={inputs.muestra2.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.muestra2.tamano} type="number" placeholder="Tamaño de muestra" />
          </div>
          {buildJSON()}
      </>
      )    
    default:
      break;
  }
}

export const Formulario = () => {
    const test_type = useRef<HTMLSelectElement>(null);
    const [prob_type, set_prob_type] = useState(String);
    const [ test, setTest ] = useState(String)
    const sendData = async (data : any)=>{
      const data_string = JSON.stringify(data)
      const res = await flask_POST(data_string);
      console.log(res);
    };

    return (
    <div className="container">
      <div className="form-card">
        <div className="form-header">
          <h1>Formulario de Pruebas Estadísticas</h1>
        </div>
        
        <div className="form-body">
          <div className="form-group">
            <label className="required">Tipo de prueba</label>
            <select onChange={(e)=>{setTest(test_type.current ? test_type.current.value : '' )}} required ref={test_type}>
              <option value="0"></option>
              <option value="1">Diferencia de medias entre muestras</option>
              <option value="2">Diferencia de medias entre la población y la muestra</option>
              <option value="3">Diferencia de varianzas entre muestras</option>
              <option value="4">Diferencia de varianzas entre la población y la muestra</option>
            </select>
          </div>


          {test ?
            <>
              <div className="conditional-section">
                <div className="form-group">
                  <label>Probabilidad</label>
                  <select onChange={(e)=>{
                    e.target ? set_prob_type(e.target.value) : ''
                  }}>
                    <option value="0"></option>
                    <option value=">">X &gt; {test == '2' || test == '1' ? 'Z' : 'f'}</option>
                    <option value="<">X &lt; {test == '2' || test == '1' ? 'Z' : 'f'}</option>
                    <option value="<>">{test == '2' || test == '1' ? 'Z' : 'f'} &lt; X &lt; {test == '2' || test == '1' ? 'Z' : 'f'}</option>
                    <option value="!=">X ≠ {test == '2' || test == '1' ? 'Z' : 'f'}</option>
                  </select>
                  <input type="number" placeholder={test == '2' || test == '1' ? 'Z' : 'f'} />
                  
                  { prob_type && prob_type =="<>" ? (
                    <input type="number" placeholder={test == '2' || test == '1' ? 'Z' : 'f'} />
                  ) : <></> }
                
                </div>
              </div>
                <Estadistico
                  caso={test}
                />  
            </>
            : <></>
          }

        </div>
      </div>
    </div>
  );
};



