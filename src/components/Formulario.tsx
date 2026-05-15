import { Dispatch, useState, useRef, useEffect, ReactElement, ReactEventHandler, SetStateAction } from "react";
import { flask_POST } from "@/api/flask";
import { Estadistico } from "./Estadistico"
import { ProbForm } from "./FormProb";
import { SuccessBox } from "./SuccessBox";

type ProbabilityResult = {
  result: number;
  distribution: string;
  condition: string;
};

type FlaskResponse = {
  probability: ProbabilityResult;
  status: string;
};

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

  const result_box = ()=>{
    if (result && result.status === 'success' && result.probability) {
      const probData : ProbabilityResult = result.probability;
      return (
        <div className="mb-10 w-full flex justify-center">
          <div className="w-svw max-w-full">
            <SuccessBox probData={probData}/>
          </div>
        </div>
      )   
    }
  }

  return (
    <div className="container text-2xl w-svw">
      
      
      <div className="text-center text-3xl font-bold text-blue-500 mb-5 mt-5 underline decoration-4">
        <h1>Formulario de Pruebas Estadísticas</h1>
      </div>
      
      <div>
        {result_box()}
      </div>
      
      <div className="flex flex-nowrap flex-col">
        <div className="container basis-1/2 flex justify-center">
          <div className="flex items-center flex-col">
            <label className="text-blue-500">Tipo de prueba</label>
            <select 
              className="text-center bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-mediumborder-2 border-blue-300 rounded-2xl w-2/3 min-w-50p-3 m-2shadow-lg hover:shadow-xltransition-all duration-300cursor-pointerwrap-break-word"
              onChange={(e)=>{setTest(test_type.current ? test_type.current.value : '' )}} 
              required ref={test_type}>
              <option value="0"></option>
              <option value="1">Diferencia de medias muestrales</option>
              <option value="2">Media muestral</option>
              <option value="3">Relacion de varianzas muestrales</option>
              <option value="4">Varianza muestral</option>
            </select>
          </div>
        </div>

        <div className="basis-1/2">

          {test && test != '0' ?
            <>
              <div className="container flex justify-center">
                <div className="w-4/5 border-t-2 border-blue-400 pt-5"></div>
              </div>
              <div className="container w-svw">
                <div className="flex items-center flex-col">
                  <label className="text-blue-500">Probabilidad</label>
                  <ProbForm
                  prob_type={prob_type}
                  set_prob_type={set_prob_type}
                  test={test}
                  />
                </div>
                <div className="container flex justify-center">
                  <div className="w-4/5 border-t-2 border-blue-400 pt-5"></div>
                </div>
                <div className="container">
                  <Estadistico
                    caso={test}
                    set_parameters_store={set_parameters_store}
                  />  
                </div>
              </div>
            </>
            : <></>
          }
          </div>
      </div>
    </div>
  );
};


