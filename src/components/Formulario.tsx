import { Dispatch, useState, useRef, useEffect, ReactElement, ReactEventHandler, SetStateAction } from "react";
import { flask_POST } from "@/api/flask";

type InputsType = {
  muestra1: {
    media: React.RefObject<HTMLInputElement | null>;
    varianza: React.RefObject<HTMLInputElement | null>;
    tamano: React.RefObject<HTMLInputElement | null>;
  };
  muestra2: {
    media: React.RefObject<HTMLInputElement | null>;
    varianza: React.RefObject<HTMLInputElement | null>;
    tamano: React.RefObject<HTMLInputElement | null>;
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

type ProbabilityResult = {
  result: number;
  distribution: string;
  condition: string;
};

type FlaskResponse = {
  probability: ProbabilityResult;
  status: string;
};

const Estadistico = ({
    caso,
    set_parameters_store,
}:{
    caso : String;
    set_parameters_store : Dispatch<SetStateAction<{}>>
})=>{
  
  const inputs : InputsType = {
    muestra1: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null) },
    muestra2: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null) },
    poblacion1: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null), distr_normal: useRef<HTMLInputElement>(null) },
    poblacion2: { media: useRef<HTMLInputElement>(null), varianza: useRef<HTMLInputElement>(null), tamano: useRef<HTMLInputElement>(null), distr_normal: useRef<HTMLInputElement>(null) }
  };

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
    
  if (!caso) return null;

  switch (caso) {
    case '1':
    case '3':
      return(
      <>
          <div className="input-group">
              <label>Poblacion correspondiente a muestra 1</label>
              <input required ref={inputs.poblacion1.media} type="number" placeholder="Media" />
              <input required ref={inputs.poblacion1.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.poblacion1.tamano} type="number" placeholder="Tamaño de poblacion" />
              <label htmlFor="">Distribucion normal de la poblacion
                <input required ref={inputs.poblacion1.distr_normal} type="checkbox" placeholder="" />
              </label>
          </div>
          
          <div className="input-group">
              <label>Poblacion correspondiente a muestra 2</label>
              <input required ref={inputs.poblacion2.media} type="number" placeholder="Media" />
              <input required ref={inputs.poblacion2.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.poblacion2.tamano} type="number" placeholder="Tamaño de poblacion" />
              <label htmlFor="">Distribucion normal de la poblacion
                <input required ref={inputs.poblacion2.distr_normal} type="checkbox" placeholder="" />
              </label>
          </div>
          
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
    case '4':
      return(
      <>
          <div className="input-group">
              <label>Poblacion</label>
              <input required ref={inputs.poblacion1.media} type="number" placeholder="Media" />
              <input required ref={inputs.poblacion1.varianza} type="number" placeholder="Varianza" />
              <input required ref={inputs.poblacion1.tamano} type="number" placeholder="Tamaño de poblacion" />
              <label htmlFor="">Distribucion normal de la poblacion
                <input required ref={inputs.poblacion1.distr_normal} type="checkbox" placeholder="" />
              </label>
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
  }
}

const ProbForm = ({
  test, set_prob_type, prob_type 
} : {
  test: string; 
  set_prob_type: Dispatch<SetStateAction<{
    critical_value: string;
    tail: string;
    hypothesis: string;
  }>>; 
  prob_type: {
    critical_value: string;
    tail: string;
    hypothesis: string;
  };
})=>{

  const inputs_tail = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    console.log('Data changed:', prob_type);
    // Process your data here
  }, [prob_type]); // ✅ Runs when formData changes
  
  const handleChange = (field: string, value: any) => {
    set_prob_type(prev => ({ ...prev, [field]: value }));
  };
  
  switch (test) {
    case '2':
      return (
        <>
          <div id="div_prob" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>P</span>
              <select 
                onChange={(e)=>{handleChange('tail',inputs_tail.current?.value);}}
                required ref={inputs_tail}
                name="select_prob" 
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
              >
                <option value="X>x">&gt;</option>
                <option value="X<x">&lt;</option>
                <option value="X!=x">≠</option>
              </select>
            </span>
            
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                onChange={(e)=>{handleChange('critical_value',e.target.value)}}
                // required ref={inputs.probabilidad.critical_value}
                type="number" 
                style={{
                  width: '80px',
                  padding: '4px 0px',
                  margin: '0px -40px 0px 5px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
                placeholder="X"
              />
            </span>

            <span>| μ =</span>
            <input 
              onChange={(e)=>{handleChange('hypothesis',e.target.value)}}
              // required ref={inputs.probabilidad.hypothesis}
              type="number" 
              style={{
                width: '80px',
                padding: '4px 0px',
                border: 'none',
                borderRadius: '10px',
                outline: 'none'
              }}
              placeholder="X"
            />
          </div>
        </>
      )

    case '4':
      return (
        <>
          <div id="div_prob" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>P</span>
              <select 
                onChange={(e)=>{handleChange('tail',inputs_tail.current?.value);}}
                required ref={inputs_tail}
                name="select_prob" 
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
              >
                <option value="X>x">&gt;</option>
                <option value="X<x">&lt;</option>
                <option value="X!=x">≠</option>
              </select>
            </span>
            
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                onChange={(e)=>{handleChange('critical_value',e.target.value)}}
                // required ref={inputs.probabilidad.critical_value}
                type="number" 
                style={{
                  width: '80px',
                  padding: '4px 0px',
                  margin: '0px -40px 0px 5px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
                placeholder="X"
              />
            </span>

            <span>| var =</span>
            <input 
              onChange={(e)=>{handleChange('hypothesis',e.target.value)}}
              // required ref={inputs.probabilidad.hypothesis}
              type="number" 
              style={{
                width: '80px',
                padding: '4px 0px',
                border: 'none',
                borderRadius: '10px',
                outline: 'none'
              }}
              placeholder="X"
            />
          </div>
        </>
      )

    case '1':
      return (
        <>
          <div id="div_prob" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>P</span>
              <select 
                onChange={(e)=>{handleChange('tail',inputs_tail.current?.value);}}
                required ref={inputs_tail}
                name="select_prob" 
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
              >
                <option value="X>x">&gt;</option>
                <option value="X<x">&lt;</option>
                <option value="X!=x">≠</option>
              </select>
            </span>
            
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                onChange={(e)=>{handleChange('critical_value',e.target.value)}}
                type="number" 
                style={{
                  width: '80px',
                  padding: '4px 0px',
                  margin: '0px -40px 0px 5px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
                placeholder="X"
              />
              <span>| μ1-μ2 =</span>
              <input 
                onChange={(e)=>{handleChange('hypothesis',e.target.value)}}
                type="number" 
                style={{
                  width: '80px',
                  padding: '4px 0px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
                placeholder="X"
              />
            </span>
          </div>
        </>
      )

    case '3':
      return (
        <>
          <div id="div_prob" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>P</span>
              <select 
                onChange={(e)=>{
                  handleChange('tail',inputs_tail.current?.value);
                }}
                required ref={inputs_tail}
                name="select_prob" 
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
              >
                <option value="X>x">&gt;</option>
                <option value="X<x">&lt;</option>
                <option value="X!=x">≠</option>
              </select>
            </span>
            
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                onChange={(e)=>{handleChange('critical_value',e.target.value)}}
                // required ref={inputs.probabilidad.critical_value}
                type="number" 
                style={{
                  width: '80px',
                  padding: '4px 0px',
                  margin: '0px -40px 0px 5px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
                placeholder="X"
              />
              <span>| var1/var2 =</span>
              <input 
                onChange={(e)=>{handleChange('hypothesis',e.target.value)}}
                // required ref={inputs.probabilidad.hypothesis}
                type="number" 
                style={{
                  width: '80px',
                  padding: '4px 0px',
                  border: 'none',
                  borderRadius: '10px',
                  outline: 'none'
                }}
                placeholder="sigma"
              />
            </span>
          </div>
        </>
      )
  
    default:
      break;
  }
}

export const Formulario = () => {
  const test_type = useRef<HTMLSelectElement>(null);
  
  const [ test, setTest ] = useState('')
  const [ params, set_parameters_store ] = useState({});
  const [prob_type, set_prob_type] = useState({
    critical_value: '0',
    tail: 'X>x',
    hypothesis: 'default'
  });
  const [result, setResult] = useState<FlaskResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (params && Object.keys(params).length > 0 && prob_type && Object.keys(prob_type).length > 1) {
        const package_flask = {
          'test_type': test,
          'params': params,
          'prob_package': prob_type
        }
        console.log('Sending:', package_flask);
        
        try {
          const data = await flask_POST(JSON.stringify(package_flask));
          console.log('Result received:', data);
          setResult(data);
        } catch (error) {
          console.error('Error fetching result:', error);
        }
      } else {
        console.warn("Fill the forms!");
      }
    };
    
    fetchData();
  }, [params, prob_type, test]); // Added dependencies

  if (result && result.status === 'success' && result.probability) {
    const probData : ProbabilityResult = result.probability;
    
    return (
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          Resultado del Cálculo
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Probabilidad:</span>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>
              {(probData.result * 100).toFixed(4)}%
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Distribución:</span>
            <span style={{ color: '#1f2937' }}>{probData.distribution}</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Condición:</span>
            <span style={{ color: '#1f2937' }}>{probData.condition}</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Valor exacto:</span>
            <span style={{
              color: '#1f2937',
              fontFamily: 'monospace'
            }}>{probData.result}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-card">
        <div className="form-header">
          <h1>Formulario de Pruebas Estadísticas</h1>
        </div>
        
        <div className="form-body">
          <div className="form-group">
            <label className="required">Tipo de prueba</label>
            <select 
              onChange={(e)=>{setTest(test_type.current ? test_type.current.value : '' )}} 
              required ref={test_type}>
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
                <label>Probabilidad</label>
                <ProbForm
                prob_type={prob_type}
                set_prob_type={set_prob_type}
                test={test}
                />
              </div>
                <Estadistico
                  caso={test}
                  set_parameters_store={set_parameters_store}
                />  
            </>
            : <></>
          }

        </div>
      </div>
    </div>
  );
};



